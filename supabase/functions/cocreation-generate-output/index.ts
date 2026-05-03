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
    const { data: responses } = await admin
      .from("cocreation_responses")
      .select("question_id, original_text")
      .eq("session_id", session_id);

    const synthMap = new Map<string, any[]>();
    for (const s of synthesis || []) synthMap.set(s.question_id, s.themes as any[]);
    const respMap = new Map<string, string[]>();
    for (const r of responses || []) {
      const arr = respMap.get(r.question_id) || [];
      arr.push(r.original_text);
      respMap.set(r.question_id, arr);
    }

    const summary = (questions || [])
      .map((q: any) => {
        const themes = synthMap.get(q.id) || [];
        const themeText = themes.length
          ? themes.map((t: any) => `- ${t.label}: ${t.insight}`).join("\n")
          : (respMap.get(q.id) || []).slice(0, 6).map((t) => `- ${t}`).join("\n");
        return `Q: ${q.text}\n${themeText}`;
      })
      .join("\n\n");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;

    const prompt = `Create a hand-drawn whiteboard-style infographic poster summarizing a co-creation workshop. Style: playful sketch-noted illustration, hand-lettered titles, sketchy line art, watercolor washes in teal, orange, mustard, and soft greens on an off-white background. Include a bold hand-lettered title at the top, a central concept illustration, and surrounding mini-scenes connected by sketchy lines/arrows with hand-lettered captions and tiny doodles of people, lightbulbs, hearts, plants, etc. Looks like a graphic recording / scribing artist drew it during a live event. No photorealism, no 3D, no stock-photo style.

Title: "${session?.title || "Co-Creation Summary"}"
${session?.description ? `Subtitle: "${session.description}"\n` : ""}
Themes and ideas to illustrate as captioned mini-scenes around the page:
${summary}

Render the entire poster as a single landscape image. Make sure all hand-lettered text is legible and spelled correctly.`;

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

    await admin
      .from("cocreation_outputs")
      .insert({ session_id, kind, content: { image_url, prompt } });

    return new Response(JSON.stringify({ ok: true, image_url }), {
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
