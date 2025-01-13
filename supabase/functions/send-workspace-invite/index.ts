import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = Deno.env.get("FROM_EMAIL");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InviteRequest {
  emails: string[];
  workspaceId: string;
  workspaceName: string;
  inviterName: string;
  role: string;
  inviterId: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Starting invite handler");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check environment variables
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }
    if (!FROM_EMAIL) {
      throw new Error("FROM_EMAIL is not configured");
    }
    if (!SUPABASE_URL) {
      throw new Error("SUPABASE_URL is not configured");
    }
    if (!SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
    }

    // Parse and validate request body
    const requestBody = await req.json().catch(error => {
      console.error("Failed to parse request body:", error);
      throw new Error("Invalid request body");
    });

    const { emails, workspaceId, workspaceName, inviterName, role, inviterId } = requestBody as InviteRequest;

    console.log("Received invite request:", { 
      emails, 
      workspaceId, 
      workspaceName, 
      inviterName, 
      role,
      inviterId
    });

    // Validate required fields
    if (!emails?.length) {
      throw new Error("No email addresses provided");
    }
    if (!workspaceId) {
      throw new Error("Workspace ID is required");
    }
    if (!workspaceName) {
      throw new Error("Workspace name is required");
    }
    if (!inviterName) {
      throw new Error("Inviter name is required");
    }
    if (!role) {
      throw new Error("Role is required");
    }
    if (!inviterId) {
      throw new Error("Inviter ID is required");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const batchId = crypto.randomUUID();

    console.log("Creating invitations in database");

    // Create invitations for all emails
    const { data: invitations, error: inviteError } = await supabase
      .from('workspace_invitations')
      .insert(
        emails.map(email => ({
          workspace_id: workspaceId,
          email: email.toLowerCase(),
          role,
          invited_by: inviterId,
          status: 'pending',
          batch_id: batchId,
          emails: emails
        }))
      )
      .select();

    if (inviteError) {
      console.error("Error creating invitations:", inviteError);
      throw new Error(`Failed to create invitations: ${inviteError.message}`);
    }

    if (!invitations || invitations.length === 0) {
      throw new Error("No invitations were created");
    }

    console.log("Successfully created invitations:", invitations);

    // Send emails for each invitation
    const emailPromises = invitations.map(async (invitation) => {
      try {
        const inviteUrl = `${req.headers.get("origin")}/invite?token=${invitation.magic_link_token}`;
        
        console.log("Sending email for invitation:", { 
          email: invitation.email, 
          token: invitation.magic_link_token 
        });

        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: FROM_EMAIL,
            to: [invitation.email],
            subject: `Join ${workspaceName} on our platform`,
            html: `
              <!DOCTYPE html>
              <html>
                <body>
                  <h2>You've been invited!</h2>
                  <p>${inviterName} has invited you to join ${workspaceName} as a ${role}.</p>
                  <p>Click the link below to accept the invitation:</p>
                  <a href="${inviteUrl}">Accept Invitation</a>
                </body>
              </html>
            `,
          }),
        });

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`Resend API error: ${errorData}`);
        }

        return response;
      } catch (error) {
        console.error(`Failed to send email to ${invitation.email}:`, error);
        throw error;
      }
    });

    console.log("Sending invitation emails");
    
    try {
      await Promise.all(emailPromises);
      console.log("Successfully sent all invitation emails");
    } catch (error) {
      console.error("Error sending invitation emails:", error);
      throw new Error("Failed to send some invitation emails");
    }

    return new Response(
      JSON.stringify({ success: true, count: emails.length }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error in send-workspace-invite function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "An unexpected error occurred",
        details: error.toString()
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
};

serve(handler);