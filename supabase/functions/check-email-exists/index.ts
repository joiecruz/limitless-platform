import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

export async function emailHasAccount(
  supabase: ReturnType<typeof createClient>,
  email: string,
): Promise<boolean> {
  const normalized = email.toLowerCase().trim();

  // Check auth.users via admin API (paginate up to a few pages just in case)
  for (let page = 1; page <= 5; page++) {
    const { data, error } = await (supabase as any).auth.admin.listUsers({
      page,
      perPage: 200,
    });
    if (error) throw error;
    const users = data?.users ?? [];
    if (users.some((u: any) => (u.email ?? "").toLowerCase() === normalized)) {
      return true;
    }
    if (users.length < 200) break;
  }

  // Fallback: profiles table (in case an auth user lookup is paginated past)
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", normalized)
    .maybeSingle();
  return !!profile;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string" || !/\S+@\S+\.\S+/.test(email)) {
      return new Response(
        JSON.stringify({ error: "Valid email is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const exists = await emailHasAccount(supabase, email);

    return new Response(JSON.stringify({ exists }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("check-email-exists error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
