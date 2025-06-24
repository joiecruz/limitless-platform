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

    // Check if requesting user is admin/superadmin
    const { data: adminProfile, error: adminError } = await serviceSupabase
      .from('profiles')
      .select('is_admin, is_superadmin')
      .eq('id', user.id)
      .single();

    if (adminError || (!adminProfile?.is_admin && !adminProfile?.is_superadmin)) {
      throw new Error("Insufficient permissions - admin access required");
    }

    // Get the user to be deleted to check if they're a superadmin
    const { data: targetProfile, error: targetError } = await serviceSupabase
      .from('profiles')
      .select('is_superadmin, email')
      .eq('id', userId)
      .single();

    if (targetError) {
      throw new Error("User not found");
    }

    if (targetProfile.is_superadmin) {
      throw new Error("Cannot delete superadmin users");
    }

    // Delete user from auth.users (this will cascade to profiles due to foreign key)
    const { error: deleteError } = await serviceSupabase.auth.admin.deleteUser(userId);

    if (deleteError) {
      throw new Error(`Failed to delete user: ${deleteError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `User ${targetProfile.email} deleted successfully`
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        },
        status: 200
      }
    );
  } catch (error: any) {
    console.error("Error in admin-delete-user function:", error);

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