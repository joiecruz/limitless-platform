/**
 * Load test for the Co-Creation public page.
 *
 * Simulates N concurrent QR-code joins:
 *   1. Each virtual participant fetches the session by slug.
 *   2. Inserts a cocreation_participants row (anon_token).
 *   3. Subscribes to realtime INSERTs on cocreation_responses.
 *   4. Submits an idea and records:
 *        - join latency  (slug fetch + participant create)
 *        - submit latency (insert round-trip)
 *        - propagation latency (own insert -> realtime echo)
 *        - time-to-first-idea (start -> first realtime payload seen)
 *
 * Usage:
 *   bun scripts/load-test-cocreation.ts <slug> [users=100] [rampMs=5000] [submitDelayMs=2000]
 *
 * Env (optional, falls back to known project values):
 *   SUPABASE_URL, SUPABASE_ANON_KEY
 *
 * NOTE: Run against a TEST session you own. This inserts real rows into
 * cocreation_participants / cocreation_responses. Run cleanup after.
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  "https://crllgygjuqpluvdpwayi.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNybGxneWdqdXFwbHV2ZHB3YXlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM1NDQ1MjksImV4cCI6MjA0OTEyMDUyOX0.-L1Kc059oqFdOacRh9wcbf5wBCOqqTHBzvmIFKqlWU8";

const slug = process.argv[2];
const USERS = Number(process.argv[3] || 100);
const RAMP_MS = Number(process.argv[4] || 5000);
const SUBMIT_DELAY_MS = Number(process.argv[5] || 2000);

if (!slug) {
  console.error("Usage: bun scripts/load-test-cocreation.ts <slug> [users] [rampMs] [submitDelayMs]");
  process.exit(1);
}

interface Metrics {
  user: number;
  joinMs?: number;
  submitMs?: number;
  propagationMs?: number;
  firstIdeaMs?: number;
  errors: string[];
}

const results: Metrics[] = [];
const tStart = Date.now();

function pct(arr: number[], p: number) {
  if (!arr.length) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
  return sorted[idx];
}

async function fetchSession(client: SupabaseClient) {
  const { data, error } = await client
    .from("cocreation_sessions")
    .select("id, status, active_question_id")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("session not found");
  return data as { id: string; status: string; active_question_id: string | null };
}

async function fetchAnyQuestionId(client: SupabaseClient, sessionId: string) {
  const { data } = await client
    .from("cocreation_questions")
    .select("id")
    .eq("session_id", sessionId)
    .order("position")
    .limit(1);
  return (data?.[0] as any)?.id as string | undefined;
}

async function runVirtualUser(i: number): Promise<Metrics> {
  const m: Metrics = { user: i, errors: [] };
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    realtime: { params: { eventsPerSecond: 10 } },
  });

  const userStart = Date.now();
  let firstIdeaSeen = false;
  let ownInsertedAt = 0;
  let participantId = "";
  let resolveProp: (() => void) | null = null;
  const propPromise = new Promise<void>((r) => (resolveProp = r));

  try {
    const session = await fetchSession(client);
    const sessionId = session.id;
    const questionId =
      session.active_question_id || (await fetchAnyQuestionId(client, sessionId));
    if (!questionId) throw new Error("no question available");

    // Realtime subscription mirrors what the public page does
    const channel = client
      .channel(`loadtest:${sessionId}:${i}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "cocreation_responses", filter: `session_id=eq.${sessionId}` },
        (payload: any) => {
          if (!firstIdeaSeen) {
            firstIdeaSeen = true;
            m.firstIdeaMs = Date.now() - userStart;
          }
          if (ownInsertedAt && payload?.new?.participant_id === participantId) {
            m.propagationMs = Date.now() - ownInsertedAt;
            resolveProp?.();
          }
        },
      );
    await new Promise<void>((resolve) => {
      channel.subscribe((status) => {
        if (status === "SUBSCRIBED") resolve();
      });
    });

    // Create participant
    const joinT0 = Date.now();
    const anonToken = crypto.randomUUID();
    const displayName = `LoadBot${i}`;
    const { data: created, error: pErr } = await client
      .from("cocreation_participants")
      .insert({ session_id: sessionId, anon_token: anonToken, display_name: displayName })
      .select("id")
      .single();
    if (pErr) throw new Error(`participant insert: ${pErr.message}`);
    participantId = (created as any).id as string;
    m.joinMs = Date.now() - joinT0;

    // Wait staggered before submitting
    await new Promise((r) => setTimeout(r, SUBMIT_DELAY_MS + Math.random() * 500));

    const submitT0 = Date.now();
    ownInsertedAt = submitT0;
    const { error: rErr } = await client.from("cocreation_responses").insert({
      session_id: sessionId,
      question_id: questionId,
      participant_id: participantId,
      original_text: `Load test idea from user ${i} @ ${new Date().toISOString()}`,
    });
    if (rErr) throw new Error(`response insert: ${rErr.message}`);
    m.submitMs = Date.now() - submitT0;

    // Wait up to 10s for own insert echo via realtime
    await Promise.race([propPromise, new Promise((r) => setTimeout(r, 10000))]);
    if (m.propagationMs == null) m.errors.push("propagation timeout");

    await client.removeChannel(channel);
  } catch (e: any) {
    m.errors.push(e?.message || String(e));
  }

  return m;
}

async function main() {
  console.log(`▶︎ Load test: ${USERS} users, ramp ${RAMP_MS}ms, slug=${slug}`);
  const tasks: Promise<Metrics>[] = [];
  for (let i = 0; i < USERS; i++) {
    const delay = (RAMP_MS / USERS) * i;
    tasks.push(
      new Promise<Metrics>((resolve) =>
        setTimeout(() => resolve(runVirtualUser(i)), delay),
      ),
    );
  }
  const all = await Promise.all(tasks);
  results.push(...all);

  const totalMs = Date.now() - tStart;
  const ok = results.filter((r) => r.errors.length === 0);
  const failed = results.length - ok.length;
  const joins = results.map((r) => r.joinMs).filter((v): v is number => v != null);
  const submits = results.map((r) => r.submitMs).filter((v): v is number => v != null);
  const props = results.map((r) => r.propagationMs).filter((v): v is number => v != null);
  const firsts = results.map((r) => r.firstIdeaMs).filter((v): v is number => v != null);

  const fmt = (arr: number[]) =>
    arr.length
      ? `p50=${pct(arr, 50)}ms p95=${pct(arr, 95)}ms p99=${pct(arr, 99)}ms max=${Math.max(...arr)}ms`
      : "n/a";

  console.log("\n───── Co-Creation Load Test Results ─────");
  console.log(`Users:                ${results.length}`);
  console.log(`Successful:           ${ok.length}`);
  console.log(`Failed:               ${failed}`);
  console.log(`Total wall time:      ${totalMs}ms`);
  console.log(`Throughput (submits): ${(submits.length / (totalMs / 1000)).toFixed(2)}/s`);
  console.log(`Join latency:         ${fmt(joins)}`);
  console.log(`Submit latency:       ${fmt(submits)}`);
  console.log(`Realtime propagation: ${fmt(props)}`);
  console.log(`Time-to-first-idea:   ${fmt(firsts)}`);

  if (failed) {
    const errorCounts = new Map<string, number>();
    for (const r of results) {
      for (const e of r.errors) errorCounts.set(e, (errorCounts.get(e) || 0) + 1);
    }
    console.log("\nErrors:");
    for (const [e, n] of [...errorCounts].sort((a, b) => b[1] - a[1])) {
      console.log(`  ${n}× ${e}`);
    }
  }

  console.log("\nTip: clean up with SQL:");
  console.log(
    `  DELETE FROM cocreation_responses WHERE original_text LIKE 'Load test idea from user %';`,
  );
  console.log(
    `  DELETE FROM cocreation_participants WHERE display_name LIKE 'LoadBot%';`,
  );

  process.exit(failed ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
