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
    for (const s of synthesis || []) synthMap.set(s.question_id, s.themes as any[]);

    const synthSummary = (questions || [])
      .map((q: any) => {
        const themes = synthMap.get(q.id) || [];
        return `Q: ${q.text}\n${themes.map((t: any) => `- ${t.label}: ${t.insight}`).join("\n")}`;
      })
      .join("\n\n");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;

    const systems: Record<string, string> = {
      slides:
        "Create a presentation outline. Structure: title, overview, key insights per question, recommendations, next steps. Keep slides concise and presentation-ready.",
      visual:
        "Create a scannable visual summary grouping insights into short statements and themes.",
      podcast:
        "Write a conversational podcast-style narrative with sections: Introduction, Key Insights, Implications, Closing. Tone: clear, engaging, professional.",
    };

    const tools: Record<string, any> = {
      slides: {
        name: "emit_slides",
        parameters: {
          type: "object",
          properties: {
            slides: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  bullets: { type: "array", items: { type: "string" } },
                },
                required: ["title", "bullets"],
                additionalProperties: false,
              },
            },
          },
          required: ["slides"],
          additionalProperties: false,
        },
      },
      visual: {
        name: "emit_visual",
        parameters: {
          type: "object",
          properties: {
            sections: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  heading: { type: "string" },
                  statements: { type: "array", items: { type: "string" } },
                },
                required: ["heading", "statements"],
                additionalProperties: false,
              },
            },
          },
          required: ["sections"],
          additionalProperties: false,
        },
      },
      podcast: {
        name: "emit_podcast",
        parameters: {
          type: "object",
          properties: {
            intro: { type: "string" },
            insights: { type: "string" },
            implications: { type: "string" },
            closing: { type: "string" },
          },
          required: ["intro", "insights", "implications", "closing"],
          additionalProperties: false,
        },
      },
    };

    const tool = tools[kind];

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systems[kind] },
          {
            role: "user",
            content: `Session: ${session?.title}\n${session?.description || ""}\n\nSynthesized insights:\n${synthSummary}`,
          },
        ],
        tools: [{ type: "function", function: { ...tool, description: `Emit ${kind} content` } }],
        tool_choice: { type: "function", function: { name: tool.name } },
      }),
    });

    if (!resp.ok) {
      const t = await resp.text();
      console.error("AI output failed", resp.status, t);
      return new Response(JSON.stringify({ error: "ai_failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const data = await resp.json();
    const args = data?.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    const content = args ? JSON.parse(args) : {};

    await admin.from("cocreation_outputs").insert({ session_id, kind, content });

    return new Response(JSON.stringify({ ok: true, content }), {
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
