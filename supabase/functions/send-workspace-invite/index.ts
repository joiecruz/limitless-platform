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

    console.log(`📧 Sending workspace invite to ${email} for workspace ${workspaceName}`);

    // Initialize Supabase client with service role key
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Save the invitation in the database
    const { error: inviteError } = await supabase
      .from('workspace_invitations')
      .insert({
        workspace_id: workspaceId,
        email: email,
        role: role,
        invited_by: inviterId,
        status: 'pending'
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

    // Properly encode the email for the URL
    const encodedEmail = encodeURIComponent(email);

    // Send the email invitation
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [email],
        subject: `Confirm your ${workspaceName} account`,
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirm your account</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                margin: 0;
                padding: 0;
                color: #333333;
              }
              .email-container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .email-header {
                text-align: center;
                margin-bottom: 30px;
              }
              .logo {
                max-width: 200px;
                margin-bottom: 20px;
              }
              .email-content {
                background-color: #ffffff;
                padding: 30px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              }
              .button {
                display: inline-block;
                background-color: #002B36;
                color: white;
                text-decoration: none;
                padding: 12px 24px;
                border-radius: 4px;
                margin: 20px 0;
                font-weight: 500;
              }
              .footer {
                text-align: center;
                margin-top: 30px;
                font-size: 12px;
                color: #666666;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="email-content">
                <div class="email-header">
                  <img src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/LL%20LOGO_PNG.png" alt="Logo" class="logo">
                </div>
                
                <h2>You have been added to your team's ${workspaceName} account.</h2>
                
                <p>Hi ${email},</p>
                
                <p>You have been added to your team's ${workspaceName} account by ${inviterName}. Click the button below to set a password and login.</p>
                
                <div style="text-align: center;">
                  <a href="${req.headers.get("origin")}/invite?workspace=${workspaceId}&email=${encodedEmail}&role=${role}" 
                     class="button" 
                     style="color: white !important;">
                    Set your password
                  </a>
                </div>
                
                <p>Thanks,<br>Limitless Lab Team</p>
              </div>
              
              <div class="footer">
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

    if (!res.ok) {
      const error = await res.text();
      console.error("❌ Resend API error:", error);
      throw new Error(error);
    }

    const data = await res.json();
    console.log("✅ Email sent successfully:", data);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("❌ Error in send-workspace-invite function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
};

serve(handler);