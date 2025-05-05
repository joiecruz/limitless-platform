
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

    // Create Supabase client with service role key to bypass RLS
    const supabase = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY
    );

    // Parse request body to get user_id
    let user_id;
    try {
      const body = await req.json();
      user_id = body.user_id;
    } catch (error) {
      // If parsing fails, try to get user from auth header
      const authHeader = req.headers.get('Authorization');
      if (authHeader) {
        const token = authHeader.replace('Bearer ', '');
        const { data, error: verifyError } = await supabase.auth.getUser(token);
        if (verifyError || !data.user) {
          throw new Error("Invalid authorization token");
        }
        user_id = data.user.id;
      } else {
        throw new Error("Missing user_id parameter and no authorization header");
      }
    }

    if (!user_id) {
      throw new Error("Could not determine user_id");
    }

    // Check if the user exists
    const { data: userExists, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user_id)
      .single();

    if (userError) {
      console.error("User check error:", userError);
      // User might still be valid but not have a profile yet
      // Continue with workspace fetch but log the issue
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
      console.error("Error fetching workspaces:", workspacesError);
      throw new Error(`Error fetching workspaces: ${workspacesError.message}`);
    }

    // Format the response
    const formattedWorkspaces = workspaces
      .filter(item => item.workspaces) // Filter out any null workspaces
      .map(item => {
        const workspace = item.workspaces as any;
        return {
          id: workspace.id,
          name: workspace.name || 'Unnamed Workspace',
          slug: workspace.slug || 'unnamed'
        };
      });

    console.log(`Returning ${formattedWorkspaces.length} workspaces for user ${user_id}`);

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
