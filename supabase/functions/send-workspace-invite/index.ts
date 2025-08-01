import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = Deno.env.get("FROM_EMAIL");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};
const handler = async (req) => {
  console.log("Starting invite handler");
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
      status: 200
    });
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
    const requestBody = await req.json().catch((error)=>{
      console.error("Failed to parse request body:", error);
      throw new Error("Invalid request format");
    });
    console.log("Request body:", JSON.stringify(requestBody, null, 2));
    const { emails, workspaceId, workspaceName, inviterName, role, inviterId } = requestBody;
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
    const { data: userRole, error: roleError } = await serviceSupabase.from('workspace_members').select('role').eq('workspace_id', workspaceId).eq('user_id', inviterId).single();
    if (roleError) {
      console.error("Error checking user role:", roleError);
      throw new Error("Failed to verify your permissions");
    }
    if ([
      'admin',
      'owner'
    ].includes(userRole.role) === false) {
      throw new Error("You don't have permission to invite users to this workspace");
    }
    // Generate a unique batch ID for this invite session
    const batchId = crypto.randomUUID();
    console.log("Creating invitations in database");
    // Check for existing invitations (using service role to ensure we see all invitations)
    const { data: existingInvitations, error: checkError } = await serviceSupabase.from('workspace_invitations').select('email').in('email', emails.map((email)=>email.toLowerCase())).eq('workspace_id', workspaceId).eq('status', 'pending');
    if (checkError) {
      console.error("Error checking existing invitations:", checkError);
      throw new Error(`Failed to check existing invitations: ${checkError.message}`);
    }
    // Filter out emails that already have pending invitations
    const existingEmails = new Set(existingInvitations?.map((inv)=>inv.email.toLowerCase()) || []);
    const newEmails = emails.filter((email)=>!existingEmails.has(email.toLowerCase()));
    if (newEmails.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: "All provided emails already have pending invitations"
      }), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        },
        status: 400
      });
    }
    // Create invitations only for new emails (using service role to avoid permission issues)
    const { data: invitations, error: inviteError } = await serviceSupabase.from('workspace_invitations').insert(newEmails.map((email)=>({
        workspace_id: workspaceId,
        email: email.toLowerCase(),
        role,
        invited_by: inviterId,
        status: 'pending',
        batch_id: batchId,
        emails: newEmails
      }))).select();
    if (inviteError) {
      console.error("Error creating invitations:", inviteError);
      throw new Error(`Failed to create invitations: ${inviteError.message}`);
    }
    if (!invitations || invitations.length === 0) {
      throw new Error("No invitations were created");
    }
    console.log("Successfully created invitations:", invitations);
    // Send emails for each invitation
    const emailPromises = invitations.map(async (invitation)=>{
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
            Authorization: `Bearer ${RESEND_API_KEY}`
          },
          body: JSON.stringify({
            from: `Limitless Lab <${FROM_EMAIL}>`,
            to: [
              invitation.email
            ],
            subject: `You have been invited to Limitless Lab`,
            html: `
              <!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Reset Your Password</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .header img {
      max-width: 200px;
    }
    h1 {
      color: #333;
      text-align: center;
      margin-bottom: 20px;
    }
    .button-container {
      text-align: center;
      margin: 30px auto;
    }
    .button {
      display: inline-block;
      background-color: #45429e;
      color: white !important;
      text-align: center;
      padding: 12px 20px;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
    }
    .footer {
      margin-top: 40px;
      text-align: center;
      font-size: 12px;
      color: #666;
    }
    a {
      color: #45429e;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="header">
    <img src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/LL%20LOGO_PNG.png" alt="Limitless Lab" />
  </div>

 <h2 style="font-size:24px;margin-bottom:16px;color:rgb(51,51,51);text-align:center">You're invited to join the Limitless Lab workspace!</h2>

<span style="color:rgb(51,51,51);font-size:16px;text-align:center">Join the&nbsp;${workspaceName} workspace at the Limitless Lab platform! Click the button below to accept your invitation.</span>

  <div class="button-container">
    <a href="${inviteUrl}" class="button">Accept Invitation</a>
  </div>

<p style="margin-top:16px;font-size:14px;color:#666666">If you did not expect this invitation, you can safely ignore this email.</p>

  <p>If the button doesn't work, copy and paste this link into your browser:</p>
  <p><a href="${inviteUrl}">${inviteUrl}</a></p>

  <p>Thank you,<br>The Limitless Lab Team</p>

  <div class="footer">
    <p>Limitless Lab</p>
    <p>5F RFM Corporate Center, Pioneer Street, Mandaluyong City, Philippines</p>
    <p>#2 Venture Drive #19-21 Vision Exchange, Singapore, 608526</p>
    <p>This is an automated email, please do not reply.</p>
  </div>
</body>
</html>


            `
          })
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
    return new Response(JSON.stringify({
      success: true,
      invitedCount,
      skippedCount,
      message: skippedCount > 0 ? `Sent ${invitedCount} new invitation(s). Skipped ${skippedCount} existing invitation(s).` : `Successfully sent ${invitedCount} invitation(s).`
    }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      },
      status: 200
    });
  } catch (error) {
    console.error("Error in send-workspace-invite function:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || "An unexpected error occurred",
      details: error.toString()
    }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      },
      status: 500
    });
  }
};
serve(handler);
