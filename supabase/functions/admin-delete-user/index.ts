import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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

    // Create service role client
    const serviceSupabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Parse request body
    const { userId } = await req.json();

    if (!userId) {
      throw new Error("Missing userId parameter");
    }

    // Verify the requesting user is an admin using the service client
    const userToken = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await serviceSupabase.auth.getUser(userToken);

    if (userError || !user) {
      throw new Error("Invalid authentication");
    }

    // Check if requesting user is admin/superadmin using user_roles table (secure approach)
    const { data: userRoles, error: rolesError } = await serviceSupabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .in('role', ['admin', 'superadmin']);

    if (rolesError) {
      console.error("Error checking user roles:", rolesError);
      throw new Error("Failed to verify permissions");
    }

    if (!userRoles || userRoles.length === 0) {
      throw new Error("Insufficient permissions - admin access required");
    }

    // Check if target user is a superadmin using user_roles table
    const { data: targetRoles, error: targetRolesError } = await serviceSupabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'superadmin');

    if (targetRolesError) {
      console.error("Error checking target user roles:", targetRolesError);
    }

    if (targetRoles && targetRoles.length > 0) {
      throw new Error("Cannot delete superadmin users");
    }

    // Get user email for logging
    const { data: targetProfile } = await serviceSupabase
      .from('profiles')
      .select('email')
      .eq('id', userId)
      .single();

    // Delete user from auth.users (this will cascade to profiles due to foreign key)
    const { error: deleteError } = await serviceSupabase.auth.admin.deleteUser(userId);

    if (deleteError) {
      throw new Error(`Failed to delete user: ${deleteError.message}`);
    }

    console.log(`User ${targetProfile?.email || userId} deleted by admin ${user.id}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `User deleted successfully`
      }),
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
    console.error("Error in admin-delete-user function:", errorMessage);

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
