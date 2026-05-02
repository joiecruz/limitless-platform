import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const generateWorkspaceName = () => {
  const adjectives = ['Creative', 'Dynamic', 'Innovative', 'Brilliant', 'Strategic'];
  const nouns = ['Hub', 'Space', 'Team', 'Group', 'Squad'];
  const randomNum = Math.floor(Math.random() * 1000);
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${randomAdjective} ${randomNoun} ${randomNum}`;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

    // Validate JWT - derive user_id from token, not from request body
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data: { user }, error: userError } = await authClient.auth.getUser(token);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const workspaceName = generateWorkspaceName();
    const workspaceSlug = workspaceName.toLowerCase().replace(/\s+/g, '-');

    const { data: workspace, error: rpcError } = await supabaseClient.rpc(
      'create_workspace_with_owner',
      {
        workspace_name: workspaceName,
        workspace_slug: workspaceSlug,
        owner_id: user.id,
      }
    );

    if (rpcError) {
      console.error('Error creating workspace:', rpcError);
      throw rpcError;
    }

    return new Response(
      JSON.stringify({ success: true, workspace }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error('Error in handle-email-verification:', error);
    return new Response(
      JSON.stringify({ error: 'Operation failed. Please try again or contact support.' }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
