import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = Deno.env.get("FROM_EMAIL");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
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
    // Validate environment variables
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      throw new Error("Email service configuration is missing");
    }
    if (!FROM_EMAIL) {
      console.error("FROM_EMAIL is not configured");
      throw new Error("Sender email configuration is missing");
    }
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Supabase configuration is missing");
      throw new Error("Database configuration is missing");
    }

    // Get user's token from request to validate permissions
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error("Authorization header is missing");
    }

    // Parse and validate request body
    const requestBody = await req.json().catch(error => {
      console.error("Failed to parse request body:", error);
      throw new Error("Invalid request format");
    });

    console.log("Request body:", JSON.stringify(requestBody, null, 2));

    const { emails, workspaceId, workspaceName, inviterName, role, inviterId } = requestBody as InviteRequest;

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

    // Create clients
    // Service role client for admin operations
    const serviceSupabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // User client for user-scoped operations (use anon key with user's JWT)
    const userSupabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: {
          Authorization: authHeader
        }
      }
    });

    // Verify the user has admin or owner role in the workspace (using service role for reliability)
    const { data: userRole, error: roleError } = await serviceSupabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', workspaceId)
      .eq('user_id', inviterId)
      .single();

    if (roleError) {
      console.error("Error checking user role:", roleError);
      throw new Error("Failed to verify your permissions");
    }

    if (!['admin', 'owner'].includes(userRole.role)) {
      throw new Error("You don't have permission to invite users to this workspace");
    }

    // Generate a unique batch ID for this invite session
    const batchId = crypto.randomUUID();

    console.log("Creating invitations in database");

    // Check for existing invitations (using service role to ensure we see all invitations)
    const { data: existingInvitations, error: checkError } = await serviceSupabase
      .from('workspace_invitations')
      .select('email')
      .in('email', emails.map(email => email.toLowerCase()))
      .eq('workspace_id', workspaceId)
      .eq('status', 'pending');

    if (checkError) {
      console.error("Error checking existing invitations:", checkError);
      throw new Error(`Failed to check existing invitations: ${checkError.message}`);
    }

    // Filter out emails that already have pending invitations
    const existingEmails = new Set(existingInvitations?.map(inv => inv.email.toLowerCase()) || []);
    const newEmails = emails.filter(email => !existingEmails.has(email.toLowerCase()));

    if (newEmails.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "All provided emails already have pending invitations"
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Create invitations only for new emails (using service role to avoid permission issues)
    const { data: invitations, error: inviteError } = await serviceSupabase
      .from('workspace_invitations')
      .insert(
        newEmails.map(email => ({
          workspace_id: workspaceId,
          email: email.toLowerCase(),
          role,
          invited_by: inviterId,
          status: 'pending',
          batch_id: batchId,
          emails: newEmails
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
          token: invitation.magic_link_token,
          inviteUrl
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

        const responseData = await response.text();
        console.log("Resend API response:", {
          status: response.status,
          data: responseData
        });

        if (!response.ok) {
          throw new Error(`Resend API error: ${responseData}`);
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

    const skippedCount = existingEmails.size;
    const invitedCount = newEmails.length;

    return new Response(
      JSON.stringify({
        success: true,
        invitedCount,
        skippedCount,
        message: skippedCount > 0
          ? `Sent ${invitedCount} new invitation(s). Skipped ${skippedCount} existing invitation(s).`
          : `Successfully sent ${invitedCount} invitation(s).`
      }),
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
