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
          <html>
            <head>
              <style>
                body { 
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                }
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                }
                .header {
                  background-color: #f8f9fa;
                  padding: 20px;
                  border-radius: 8px;
                  margin-bottom: 20px;
                }
                .button {
                  display: inline-block;
                  padding: 12px 24px;
                  background-color: #0070f3;
                  color: white;
                  text-decoration: none;
                  border-radius: 5px;
                  margin: 20px 0;
                }
                .footer {
                  font-size: 14px;
                  color: #666;
                  margin-top: 30px;
                  padding-top: 20px;
                  border-top: 1px solid #eee;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h2>You're Invited! 🎉</h2>
                </div>
                
                <p>Hello,</p>
                
                <p>${inviterName} has invited you to join <strong>${workspaceName}</strong> as a <strong>${role}</strong>.</p>
                
                <p>As a ${role}, you'll be able to collaborate with the team and contribute to the workspace.</p>
                
                <a href="${req.headers.get("origin")}/invite?workspace=${workspaceId}&email=${encodeURIComponent(email)}&role=${role}" 
                   class="button">
                  Accept Invitation
                </a>
                
                <p>This invitation link will expire in 7 days. If you don't have an account yet, you'll be able to create one when accepting the invitation.</p>
                
                <div class="footer">
                  <p>If you didn't expect this invitation, you can safely ignore this email.</p>
                  <p>This is an automated message, please do not reply to this email.</p>
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