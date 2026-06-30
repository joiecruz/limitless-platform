import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface SendOtpRequest {
  email: string;
}

function generateOTP(): string {
  // Generate a 6-digit numeric OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: SendOtpRequest = await req.json();

    if (!email) {
      throw new Error("Email is required");
    }

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Block sending if an account already exists for this email
    const normalizedEmail = email.toLowerCase().trim();
    let accountExists = false;
    for (let page = 1; page <= 5; page++) {
      const { data, error } = await (supabase as any).auth.admin.listUsers({ page, perPage: 200 });
      if (error) break;
      const users = data?.users ?? [];
      if (users.some((u: any) => (u.email ?? "").toLowerCase() === normalizedEmail)) {
        accountExists = true;
        break;
      }
      if (users.length < 200) break;
    }
    if (accountExists) {
      return new Response(
        JSON.stringify({ error: "account_exists", message: "An account with this email already exists. Please sign in instead." }),
        { status: 409, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    // Generate OTP
    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Invalidate any existing OTP codes for this email
    await supabase
      .from("otp_codes")
      .update({ used: true })
      .eq("email", email.toLowerCase())
      .eq("used", false);

    // Store the OTP
    const { error: insertError } = await supabase.from("otp_codes").insert({
      email: email.toLowerCase(),
      code,
      expires_at: expiresAt.toISOString(),
    });

    if (insertError) {
      console.error("Error storing OTP:", insertError);
      throw new Error("Failed to generate verification code");
    }

    // Send email via Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const resend = new Resend(resendApiKey);
    const fromEmail = Deno.env.get("FROM_EMAIL") || "notification@limitlesslab.org";

    const emailResponse = await resend.emails.send({
      from: `Limitless Lab <${fromEmail}>`,
      to: [email],
      subject: "Your Limitless Lab Verification Code",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  <tr>
                    <td align="center" style="padding: 40px 40px 20px;">
                      <img src="https://limitlesslab.org/images/ll-logo-email.png" alt="Limitless Lab" style="height: 50px; width: auto;">
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding: 0 40px;">
                      <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #1a1a1a;">
                        Your Verification Code
                      </h1>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding: 20px 40px;">
                      <p style="margin: 0; font-size: 16px; color: #666666; line-height: 1.5;">
                        Enter this code to verify your email address:
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding: 10px 40px 30px;">
                      <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px 40px; display: inline-block;">
                        <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #1a1a1a; font-family: 'Courier New', monospace;">
                          ${code}
                        </span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding: 0 40px 30px;">
                      <p style="margin: 0; font-size: 14px; color: #999999; line-height: 1.5;">
                        This code expires in 10 minutes.<br>
                        If you didn't request this, you can safely ignore this email.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 20px 40px; background-color: #f8f9fa; border-radius: 0 0 12px 12px;">
                      <p style="margin: 0; font-size: 12px; color: #999999; text-align: center; line-height: 1.5;">
                        Limitless Lab<br>
                        5F RFM Corporate Center, Pioneer Street, Mandaluyong City, Philippines<br>
                        #2 Venture Drive #19-21 Vision Exchange, Singapore, 608526
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    console.log("OTP email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, message: "Verification code sent" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-otp function:", error);
    return new Response(
      JSON.stringify({ error: "Unable to send verification code. Please try again." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
