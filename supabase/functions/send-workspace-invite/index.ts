import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = Deno.env.get("FROM_EMAIL");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface InviteRequest {
  email: string;
  workspaceId: string;
  workspaceName: string;
  inviterName: string;
  role: string;
  inviterId: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("📨 Starting invite request handler");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling CORS preflight request");
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    if (req.method !== "POST") {
      throw new Error(`Method ${req.method} not allowed`);
    }

    // Validate required environment variables
    if (!RESEND_API_KEY || !FROM_EMAIL || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing required environment variables:", {
        hasResendKey: !!RESEND_API_KEY,
        hasFromEmail: !!FROM_EMAIL,
        hasSupabaseUrl: !!SUPABASE_URL,
        hasServiceKey: !!SUPABASE_SERVICE_ROLE_KEY,
      });
      throw new Error("Server configuration error");
    }

    const requestData = await req.json();
    console.log("Request payload:", requestData);

    const { email, workspaceId, workspaceName, inviterName, role, inviterId } = requestData as InviteRequest;

    if (!email || !workspaceId || !workspaceName || !inviterName || !role || !inviterId) {
      console.error("Missing required fields in request:", { email, workspaceId, workspaceName, inviterName, role, inviterId });
      throw new Error("Missing required fields in invitation request");
    }

    console.log(`📨 Processing invite request for email: ${email}`);

    // Initialize Supabase client with service role key
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Save the invitation in the database
    const { data: invitation, error: inviteError } = await supabase
      .from('workspace_invitations')
      .insert({
        workspace_id: workspaceId,
        email: email.toLowerCase(),
        role: role,
        invited_by: inviterId,
        status: 'pending'
      })
      .select()
      .single();

    if (inviteError) {
      // If it's a unique constraint violation, it means there's already a pending invite
      if (inviteError.code === '23505') {
        console.log("Duplicate invitation detected:", inviteError);
        return new Response(
          JSON.stringify({ error: "An invitation has already been sent to this email" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      throw inviteError;
    }

    console.log("✅ Invitation created:", invitation);

    // Get the magic link token from the invitation
    const magicLinkToken = invitation.magic_link_token;

    // Send the email invitation with the magic link token
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [email],
        subject: `Join ${workspaceName} on our platform`,
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>You've Been Invited</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f9f9f9;
                margin: 0;
                padding: 0;
              }
              .email-container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              }
              .email-header {
                text-align: center;
                margin-bottom: 20px;
              }
              .logo {
                max-width: 200px;
                margin-bottom: 20px;
              }
              .email-body {
                text-align: center;
                color: #333333;
              }
              .email-body h2 {
                font-size: 24px;
                margin-bottom: 16px;
              }
              .email-body p {
                font-size: 16px;
                margin-bottom: 24px;
                line-height: 1.5;
              }
              .email-button {
                display: inline-block;
                background-color: #393ca0;
                text-decoration: none;
                padding: 12px 24px;
                border-radius: 4px;
                font-size: 16px;
                margin-top: 20px;
              }
              .email-footer {
                margin-top: 30px;
                text-align: center;
                font-size: 12px;
                color: #888888;
              }
              .email-footer p {
                margin: 5px 0;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="email-header">
                <img src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/LL%20LOGO_PNG.png" alt="Logo" class="logo">
                <h2>You've been invited!</h2>
              </div>
              <div class="email-body">
                <p><strong>${inviterName}</strong> has invited you to join <strong>${workspaceName}</strong> on our platform as a ${role}.</p>
                <p>Click the link below to accept the invitation:</p>
                <a href="${req.headers.get("origin")}/invite?token=${magicLinkToken}" class="email-button" style="background-color: #393ca0; color: white !important; text-decoration: none;">Accept Invitation</a>
                <p style="margin-top: 16px; font-size: 14px; color: #666666;">If you didn't expect this invitation, you can safely ignore this email.</p>
              </div>
              <div class="email-footer">
                <p>Limitless Lab</p>
                <p>5F RFM Corporate Center, Pioneer Street, Mandaluyong City, Philippines</p>
                <p>#2 Venture Drive #19-21 Vision Exchange, Singapore, 608526</p>
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    });

    if (!emailRes.ok) {
      const error = await emailRes.text();
      console.error("❌ Resend API error:", error);
      throw new Error(error);
    }

    const emailData = await emailRes.json();
    console.log("✉️ Email sent successfully:", emailData);

    return new Response(JSON.stringify(emailData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("❌ Error in send-workspace-invite function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "An error occurred while processing your request",
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