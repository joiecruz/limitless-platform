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

    // Create Supabase client with service role key
    const supabase = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY
    );

    // Parse request body to get token
    const { token } = await req.json();

    if (!token) {
      throw new Error("No invitation token provided");
    }

    // Get invitation using service role to bypass RLS
    const { data: invitation, error: inviteError } = await supabase
      .from("workspace_invitations")
      .select("*")
      .eq('magic_link_token', token)
      .maybeSingle();

    if (inviteError) {
      throw new Error(`Failed to verify invitation: ${inviteError.message}`);
    }

    if (!invitation) {
      throw new Error("Invalid or expired invitation token.");
    }

    if (invitation.status !== 'pending') {
      throw new Error("This invitation has already been used or has expired.");
    }

    // Check if user already exists with this email using service role
    // Try to get user by checking the profiles table which should have the email
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', invitation.email)
      .maybeSingle();

    // User exists if we found a profile record
    const userExists = !profileError && existingProfile;

    return new Response(
      JSON.stringify({
        ...invitation,
        userExists: !!userExists
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
    console.error("Error in verify-invitation function:", error);

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
