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
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { user_id } = await req.json();
    console.log('Handling email verification for user:', user_id);

    if (!user_id) {
      throw new Error('No user_id provided');
    }

    const workspaceName = generateWorkspaceName();
    const workspaceSlug = workspaceName.toLowerCase().replace(/\s+/g, '-');

    console.log('Creating workspace:', { workspaceName, workspaceSlug });

    const { data: workspace, error: rpcError } = await supabaseClient.rpc(
      'create_workspace_with_owner',
      {
        workspace_name: workspaceName,
        workspace_slug: workspaceSlug,
        owner_id: user_id
      }
    );

    if (rpcError) {
      console.error('Error creating workspace:', rpcError);
      throw rpcError;
    }

    console.log('Workspace created successfully:', workspace);

    return new Response(
      JSON.stringify({ success: true, workspace }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in handle-email-verification:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});