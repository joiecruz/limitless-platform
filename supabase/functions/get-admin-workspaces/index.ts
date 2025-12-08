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

    // Get auth header to validate user is authenticated
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    // Create Supabase client with service role key
    const supabase = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY
    );

    // Create user client to get current user
    const userClient = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY,
      {
        global: {
          headers: {
            Authorization: authHeader
          }
        }
      }
    );

    // Check if user is authenticated
    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    // Check if user is admin or superadmin using user_roles table (secure approach)
    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .in('role', ['admin', 'superadmin']);

    if (rolesError) {
      console.error("Error checking user roles:", rolesError);
      throw new Error("Failed to verify permissions");
    }

    if (!userRoles || userRoles.length === 0) {
      throw new Error("Forbidden: Only admins and superadmins can access all workspaces");
    }

    // Get all workspaces with member count
    const { data: workspaces, error: workspacesError } = await supabase
      .from('workspaces')
      .select(`
        *,
        workspace_members (
          count
        )
      `)
      .order('created_at', { ascending: false });

    if (workspacesError) {
      throw new Error(`Failed to fetch workspaces: ${workspacesError.message}`);
    }

    // Format the response
    const formattedWorkspaces = workspaces.map(workspace => ({
      id: workspace.id,
      name: workspace.name || 'Unnamed Workspace',
      slug: workspace.slug || 'unnamed',
      created_at: workspace.created_at,
      updated_at: workspace.updated_at,
      member_count: workspace.workspace_members[0]?.count || 0
    }));

    console.log(`Admin ${user.id} retrieved ${formattedWorkspaces.length} workspaces`);

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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    console.error("Error in get-admin-workspaces function:", errorMessage);

    return new Response(
      JSON.stringify({ error: errorMessage }),
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
