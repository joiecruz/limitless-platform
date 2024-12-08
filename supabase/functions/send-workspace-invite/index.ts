import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = Deno.env.get("FROM_EMAIL");

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
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, workspaceId, workspaceName, inviterName, role } = await req.json() as InviteRequest;

    console.log(`Sending workspace invite to ${email} for workspace ${workspaceName} with role ${role}`);

    const res = await fetch("https://api.resend.com/emails", {
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
              <!-- Header Section with Logo -->
              <div class="email-header">
                <img src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/LL%20LOGO_PNG.png" alt="Logo" class="logo">
                <h2>You've been invited!</h2>
              </div>
              <!-- Body Section -->
              <div class="email-body">
                <p><strong>${inviterName}</strong> has invited you to join <strong>${workspaceName}</strong> on our platform as a ${role}.</p>
                <p>Click the link below to accept the invitation:</p>
                <a href="${req.headers.get("origin")}/invite?workspace=${workspaceId}&email=${encodeURIComponent(email)}&role=${role}" class="email-button" style="background-color: #393ca0; color: white !important; text-decoration: none;">Accept Invitation</a>
                <p style="margin-top: 16px; font-size: 14px; color: #666666;">If you didn't expect this invitation, you can safely ignore this email.</p>
              </div>
              <!-- Footer Section -->
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
