
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
    const { invitation_id, user_id, workspace_id, role } = await req.json();

    if (!invitation_id || !user_id || !workspace_id || !role) {
      throw new Error("Missing required parameters");
    }

    // Check if user is already a member of the workspace
    const { data: existingMember, error: memberCheckError } = await supabase
      .from('workspace_members')
      .select('user_id')
      .eq('workspace_id', workspace_id)
      .eq('user_id', user_id)
      .maybeSingle();

    if (memberCheckError) {
      throw new Error(`Error checking membership: ${memberCheckError.message}`);
    }

    if (existingMember) {
      // User is already a member, update the invitation status anyway
      const { error: updateError } = await supabase
        .from('workspace_invitations')
        .update({ 
          status: 'accepted',
          accepted_at: new Date().toISOString()
        })
        .eq('id', invitation_id);

      if (updateError) {
        console.error("Error updating invitation status:", updateError);
      }

      return new Response(
        JSON.stringify({ 
          success: true,
          message: "User is already a member of this workspace" 
        }),
        { 
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json" 
          },
          status: 200
        }
      );
    }

    // Add user to workspace
    const { error: memberError } = await supabase
      .from('workspace_members')
      .insert({
        workspace_id,
        user_id,
        role
      });

    if (memberError) {
      throw new Error(`Error adding member to workspace: ${memberError.message}`);
    }

    // Update invitation status
    const { error: updateError } = await supabase
      .from('workspace_invitations')
      .update({ 
        status: 'accepted',
        accepted_at: new Date().toISOString()
      })
      .eq('id', invitation_id);

    if (updateError) {
      console.error("Error updating invitation status:", updateError);
      // Continue despite error in updating status
      console.warn("Continuing despite error in updating invitation status");
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "User successfully added to workspace"
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
    console.error("Error in process-invitation-acceptance function:", error);
    
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
