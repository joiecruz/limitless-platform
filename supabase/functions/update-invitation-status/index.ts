
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

    // Parse request body
    const { invitation_id, status, user_id } = await req.json();

    if (!invitation_id || !status || !user_id) {
      throw new Error("Missing required parameters");
    }

    if (!['accepted', 'rejected'].includes(status)) {
      throw new Error("Invalid status. Must be 'accepted' or 'rejected'");
    }

    // Get the user's email to verify permission
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', user_id)
      .single();

    if (userError || !userData) {
      throw new Error("Failed to verify user");
    }

    // Get the invitation to check permissions
    const { data: invitation, error: getError } = await supabase
      .from("workspace_invitations")
      .select("email, workspace_id, role")
      .eq("id", invitation_id)
      .single();

    if (getError || !invitation) {
      throw new Error("Invitation not found");
    }

    // Check if the user's email matches the invitation email
    if (userData.email.toLowerCase() !== invitation.email.toLowerCase()) {
      throw new Error("You don't have permission to update this invitation");
    }

    // Update the invitation status
    const { error: updateError } = await supabase
      .from("workspace_invitations")
      .update({ 
        status,
        accepted_at: status === 'accepted' ? new Date().toISOString() : null
      })
      .eq("id", invitation_id);

    if (updateError) {
      throw new Error(`Failed to update invitation: ${updateError.message}`);
    }

    // If accepted, add user to workspace
    if (status === 'accepted') {
      const { error: memberError } = await supabase
        .from("workspace_members")
        .insert({
          workspace_id: invitation.workspace_id,
          user_id: user_id,
          role: invitation.role
        });

      if (memberError) {
        // Check if it's a duplicate key violation (user already a member)
        if (memberError.code === '23505') {
          console.log("User is already a member of this workspace");
        } else {
          throw new Error(`Failed to add user to workspace: ${memberError.message}`);
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        },
        status: 200
      }
    );
  } catch (error: any) {
    console.error("Error in update-invitation-status function:", error);
    
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
