import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = Deno.env.get("FROM_EMAIL");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, workspaceId, workspaceName, inviterName, role, inviterId } = await req.json() as InviteRequest;

    console.log(`Processing workspace invite for ${email} to workspace ${workspaceName} with role ${role}`);

    // Initialize Supabase client with service role key
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Generate a unique token for the invitation
    const magicLinkToken = crypto.randomUUID();

    // Save the invitation in the database
    const { error: inviteError } = await supabase
      .from('workspace_invitations')
      .insert({
        workspace_id: workspaceId,
        email: email.toLowerCase(),
        role: role,
        invited_by: inviterId,
        status: 'pending',
        magic_link_token: magicLinkToken
      });

    if (inviteError) {
      if (inviteError.code === '23505') {
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

    // Create the confirmation link with the magic link token
    const confirmationLink = `${req.headers.get("origin")}/invite?workspace=${workspaceId}&email=${encodeURIComponent(email)}&token=${magicLinkToken}`;

    // Send the email invitation with the confirmation link
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [email],
        subject: `Join ${workspaceName} on Limitless Lab`,
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Join Workspace</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                margin: 0;
                padding: 0;
                background-color: #f9fafb;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                text-align: center;
                padding: 20px 0;
              }
              .logo {
                max-width: 200px;
                height: auto;
              }
              .content {
                background-color: #ffffff;
                padding: 40px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                margin: 20px 0;
              }
              .button {
                display: inline-block;
                padding: 12px 24px;
                background-color: #393ca0;
                color: #ffffff;
                text-decoration: none;
                border-radius: 6px;
                font-weight: 500;
                margin: 20px 0;
              }
              .footer {
                text-align: center;
                color: #6b7280;
                font-size: 14px;
                margin-top: 40px;
              }
              .highlight {
                color: #393ca0;
                font-weight: 600;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <img src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/LL%20LOGO_PNG.png" alt="Limitless Lab Logo" class="logo">
              </div>
              <div class="content">
                <h1>You're Invited! 🎉</h1>
                <p>Hi there,</p>
                <p><span class="highlight">${inviterName}</span> has invited you to join <span class="highlight">${workspaceName}</span> as a <span class="highlight">${role}</span>.</p>
                <p>Click the button below to accept the invitation and set up your account:</p>
                <a href="${confirmationLink}" class="button">Accept Invitation</a>
                <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">This invitation link will expire in 7 days. If you don't want to join or received this by mistake, you can safely ignore this email.</p>
              </div>
              <div class="footer">
                <p>Limitless Lab</p>
                <p>5F RFM Corporate Center, Pioneer Street<br>Mandaluyong City, Philippines</p>
                <p>#2 Venture Drive #19-21 Vision Exchange<br>Singapore, 608526</p>
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Resend API error:", error);
      throw new Error(error);
    }

    const data = await res.json();
    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Error in send-workspace-invite function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
};

serve(handler);