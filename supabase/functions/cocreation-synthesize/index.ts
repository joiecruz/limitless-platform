const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.0";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { session_id } = await req.json();
    if (!session_id || typeof session_id !== "string") {
      return new Response(JSON.stringify({ error: "session_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claims, error: claimsErr } = await userClient.auth.getClaims(token);
    if (claimsErr || !claims?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Verify caller can manage the session via RLS-aware client
    const { data: sess, error: sessErr } = await userClient
      .from("cocreation_sessions")
      .select("id, owner_id, workspace_id")
      .eq("id", session_id)
      .maybeSingle();
    if (sessErr || !sess) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check management permission via RPC helper we created
    const { data: canManage } = await userClient.rpc("cocreation_can_manage", {
      _session_id: session_id,
    });
    if (!canManage) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: questions } = await admin
      .from("cocreation_questions")
      .select("id, text, position, framing")
      .eq("session_id", session_id)
      .order("position");
    const { data: responses } = await admin
      .from("cocreation_responses")
      .select("id, question_id, original_text, refined_text, upvote_count")
      .eq("session_id", session_id);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;

    let themesCreated = 0;
    // Clear existing synthesis for this session
    await admin.from("cocreation_synthesis").delete().eq("session_id", session_id);

    for (const q of questions || []) {
      const qResponses = (responses || []).filter((r: any) => r.question_id === q.id);
      if (qResponses.length === 0) continue;

      const ideas = qResponses
        .map((r: any, i: number) => `${i + 1}. (▲${r.upvote_count}) ${r.refined_text || r.original_text}`)
        .join("\n");

      const system =
        "You synthesize crowdsourced ideas into 3-5 themed insights. Each theme has a short label and a 1-2 sentence insight that is clear, concise, and policy- or action-oriented. Do not repeat ideas verbatim. Prioritize the most upvoted and most repeated ideas.";
      const user = `Guide question: ${q.text}\n${q.framing ? `Framing: ${q.framing}\n` : ""}\nIdeas:\n${ideas}\n\nReturn 3-5 themes.`;

      const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "emit_themes",
                description: "Emit 3-5 themed insights",
                parameters: {
                  type: "object",
                  properties: {
                    themes: {
                      type: "array",
                      minItems: 3,
                      maxItems: 5,
                      items: {
                        type: "object",
                        properties: {
                          label: { type: "string" },
                          insight: { type: "string" },
                        },
                        required: ["label", "insight"],
                        additionalProperties: false,
                      },
                    },
                  },
                  required: ["themes"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "emit_themes" } },
        }),
      });

      if (!resp.ok) {
        console.error("AI synthesis failed", q.id, resp.status, await resp.text());
        continue;
      }
      const data = await resp.json();
      const args = data?.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
      if (!args) continue;
      let parsed: any;
      try {
        parsed = JSON.parse(args);
      } catch {
        continue;
      }
      const themes = Array.isArray(parsed?.themes) ? parsed.themes : [];
      if (themes.length === 0) continue;

      await admin.from("cocreation_synthesis").insert({
        session_id,
        question_id: q.id,
        themes,
      });
      themesCreated += themes.length;
    }

    await admin
      .from("cocreation_sessions")
      .update({ last_synthesis_at: new Date().toISOString() })
      .eq("id", session_id);

    return new Response(JSON.stringify({ themes_created: themesCreated }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
