
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase credentials");
    }

    // Get user auth token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    // Create Supabase client with service role key to bypass RLS
    const supabase = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY
    );

    // Parse request body to get user_id
    const { user_id } = await req.json();

    if (!user_id) {
      throw new Error("Missing user_id parameter");
    }

    // Check if the user exists
    const { data: userExists, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user_id)
      .single();

    if (userError || !userExists) {
      throw new Error("User not found");
    }

    // Get the user's workspaces using service role to bypass RLS
    const { data: workspaces, error: workspacesError } = await supabase
      .from('workspace_members')
      .select(`
        workspace_id,
        workspaces:workspaces (
          id,
          name,
          slug
        )
      `)
      .eq('user_id', user_id);

    if (workspacesError) {
      throw new Error(`Error fetching workspaces: ${workspacesError.message}`);
    }

    // Format the response
    const formattedWorkspaces = workspaces.map(item => {
      const workspace = item.workspaces as any;
      return {
        id: workspace.id,
        name: workspace.name || 'Unnamed Workspace',
        slug: workspace.slug || 'unnamed'
      };
    });

    return new Response(
      JSON.stringify(formattedWorkspaces),
      { 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        },
        status: 200
      }
    );
  } catch (error: any) {
    console.error("Error in get-user-workspaces function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred" }),
      { 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        },
        status: 500
      }
    );
  }
};

serve(handler);
