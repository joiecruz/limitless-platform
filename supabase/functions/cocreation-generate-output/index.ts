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
    const { session_id, kind } = await req.json();
    if (!session_id || !["slides", "visual", "podcast"].includes(kind)) {
      return new Response(JSON.stringify({ error: "Bad input" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (kind !== "visual") {
      return new Response(JSON.stringify({ error: "coming_soon" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: canManage } = await userClient.rpc("cocreation_can_manage", {
      _session_id: session_id,
    });
    if (!canManage) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: session } = await admin
      .from("cocreation_sessions")
      .select("title, description")
      .eq("id", session_id)
      .single();
    const { data: questions } = await admin
      .from("cocreation_questions")
      .select("id, text, position")
      .eq("session_id", session_id)
      .order("position");
    const { data: synthesis } = await admin
      .from("cocreation_synthesis")
      .select("question_id, themes")
      .eq("session_id", session_id);

    const synthMap = new Map<string, any[]>();
    for (const s of synthesis || []) {
      const themes = (s.themes as any[]) || [];
      if (themes.length > 0) synthMap.set(s.question_id, themes);
    }

    if (synthMap.size === 0) {
      return new Response(
        JSON.stringify({
          error:
            "Run synthesis first — the visual summary illustrates the synthesized themes.",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Build a strict, faithful content outline from synthesis ONLY.
    const outlineSections = (questions || [])
      .filter((q: any) => synthMap.has(q.id))
      .map((q: any) => {
        const themes = synthMap.get(q.id) || [];
        const lines = themes
          .map((t: any) => `  • ${t.label}: ${t.insight}`)
          .join("\n");
        return `Question: ${q.text}\n${lines}`;
      })
      .join("\n\n");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;

    const prompt = `Create a single landscape hand-drawn whiteboard-style infographic poster summarizing a co-creation workshop.

STYLE (visual only):
- Sketch-noted / graphic-recording aesthetic, as if drawn live by a scribing artist.
- Hand-lettered titles and body text. All text must be legible and spelled exactly as provided.
- Watercolor washes in teal, orange, mustard, and soft greens on an off-white background.
- Sketchy connecting lines, arrows, underlines, simple banners, and small neutral marks (dots, ticks).
- No photorealism, no 3D, no stock-photo style.

STRICT CONTENT RULES — READ CAREFULLY:
- Render ONLY the title, question headings, and theme labels with their insights given below. Do not add, paraphrase loosely, or invent any other themes, statistics, examples, names, quotes, or captions.
- Every piece of text on the poster must come from the provided content. Do not write decorative words, taglines, or filler text.
- Do NOT add representational icons or doodles (people, lightbulbs, hearts, plants, gears, buildings, etc.) unless a theme label explicitly names that object. Decoration is limited to abstract marks: arrows, dots, underlines, simple frames, ribbons.
- If a question has no themes provided, omit it entirely.
- Preserve the exact wording, capitalization, and punctuation of the title and theme labels.

CONTENT TO RENDER:

Title: ${session?.title || "Co-Creation Summary"}
${session?.description ? `Subtitle: ${session.description}\n` : ""}
${outlineSections}

Layout: place the title prominently at the top. Group each question as a labeled section with its themes listed beneath. Use sketchy connectors between sections only — never invent additional content nodes.`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-pro-image-preview",
        messages: [{ role: "user", content: prompt }],
        modalities: ["image", "text"],
      }),
    });

    if (!resp.ok) {
      const t = await resp.text();
      console.error("AI image failed", resp.status, t);
      const status = resp.status === 429 ? 429 : resp.status === 402 ? 402 : 500;
      const msg =
        status === 429
          ? "Rate limit reached. Please try again in a moment."
          : status === 402
          ? "AI credits exhausted. Add credits in Settings → Workspace → Usage."
          : "Image generation failed.";
      return new Response(JSON.stringify({ error: msg }), {
        status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    const dataUrl: string | undefined =
      data?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    if (!dataUrl?.startsWith("data:image/")) {
      console.error("No image in response", JSON.stringify(data).slice(0, 500));
      return new Response(JSON.stringify({ error: "No image returned" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const [meta, b64] = dataUrl.split(",");
    const contentType = meta.match(/data:(image\/[^;]+)/)?.[1] || "image/png";
    const ext = contentType.split("/")[1] || "png";
    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    const path = `${session_id}/visual-${Date.now()}.${ext}`;

    const { error: upErr } = await admin.storage
      .from("cocreation-outputs")
      .upload(path, bytes, { contentType, upsert: true });
    if (upErr) {
      console.error("Upload failed", upErr);
      return new Response(JSON.stringify({ error: "Upload failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: pub } = admin.storage.from("cocreation-outputs").getPublicUrl(path);
    const image_url = pub.publicUrl;

    const { data: inserted } = await admin
      .from("cocreation_outputs")
      .insert({ session_id, kind, content: { image_url, prompt } })
      .select("id, created_at")
      .single();

    return new Response(
      JSON.stringify({
        ok: true,
        image_url,
        output: {
          id: inserted?.id,
          created_at: inserted?.created_at,
          image_url,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
