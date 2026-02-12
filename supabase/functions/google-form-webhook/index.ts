import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-webhook-secret",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate via shared secret
    const webhookSecret = req.headers.get("x-webhook-secret");
    const expectedSecret = Deno.env.get("GOOGLE_FORM_WEBHOOK_SECRET");

    if (!expectedSecret || webhookSecret !== expectedSecret) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { email, name } = await req.json();

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return new Response(
        JSON.stringify({ error: "Invalid email" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const userName = name?.trim() || "";

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

    // Look up the LimitlessBiz course by slug
    const { data: course, error: courseError } = await supabaseClient
      .from("courses")
      .select("id, title")
      .eq("slug", "limitlessbiz")
      .single();

    if (courseError || !course) {
      console.error("Course lookup error:", courseError);
      return new Response(
        JSON.stringify({ error: "Course not found" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const courseId = course.id;
    const courseName = course.title;

    // Check if user already exists
    const { data: existingProfile } = await supabaseClient
      .from("profiles")
      .select("id, email")
      .eq("email", cleanEmail)
      .single();

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const fromEmail = Deno.env.get("FROM_EMAIL") || "noreply@limitlesslab.org";
    const baseUrl = "https://limitlesslab.org";
    const logoUrl = `${baseUrl}/images/ll-logo-email.png`;

    let status: string;

    if (existingProfile) {
      // Check if already enrolled
      const { data: existingAccess } = await supabaseClient
        .from("user_course_access")
        .select("id")
        .eq("user_id", existingProfile.id)
        .eq("course_id", courseId)
        .single();

      if (existingAccess) {
        return new Response(
          JSON.stringify({ success: true, status: "already_enrolled" }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Grant access
      await supabaseClient
        .from("user_course_access")
        .insert({ user_id: existingProfile.id, course_id: courseId });

      await supabaseClient
        .from("enrollments")
        .upsert(
          { user_id: existingProfile.id, course_id: courseId, progress: 0 },
          { onConflict: "user_id,course_id", ignoreDuplicates: true }
        );

      // Mark any pending enrollment as processed
      await supabaseClient
        .from("pending_course_enrollments")
        .update({ processed_at: new Date().toISOString() })
        .eq("course_id", courseId)
        .eq("email", cleanEmail);

      status = "existing_user_granted";

      // Send "Sign In" email
      if (resendApiKey) {
        const resend = new Resend(resendApiKey);
        const signinUrl = `${baseUrl}/signin`;

        try {
          await resend.emails.send({
            from: `Limitless Lab <${fromEmail}>`,
            to: [cleanEmail],
            subject: `Welcome to ${courseName}: Your Learning Journey Starts Here!`,
            html: buildEmailHtml({
              logoUrl,
              heading: `Welcome to ${courseName}!`,
              intro: `Hi${userName ? ` ${userName}` : ""}! Great news — you've been granted access to our training program.`,
              description: "This course will equip you with practical skills to transform your work, enhance productivity, and unlock new opportunities.",
              courseName,
              ctaUrl: signinUrl,
              ctaText: "Sign In & Start Learning",
              email: cleanEmail,
              showAltLink: false,
            }),
          });
        } catch (emailError) {
          console.error(`Failed to send email to ${cleanEmail}:`, emailError);
        }
      }
    } else {
      // New user — create pending enrollment
      const { error: insertError } = await supabaseClient
        .from("pending_course_enrollments")
        .upsert(
          {
            email: cleanEmail,
            course_id: courseId,
            metadata: { invited_at: new Date().toISOString(), name: userName, source: "google_form" },
          },
          { onConflict: "email,course_id", ignoreDuplicates: true }
        );

      if (insertError) {
        console.error("Insert error:", insertError);
        return new Response(
          JSON.stringify({ error: `Failed to create pending enrollment: ${insertError.message}` }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      status = "pending_created";

      // Send "Create Account" email
      if (resendApiKey) {
        const resend = new Resend(resendApiKey);
        const signupUrl = `${baseUrl}/signup?email=${encodeURIComponent(cleanEmail)}`;

        try {
          await resend.emails.send({
            from: `Limitless Lab <${fromEmail}>`,
            to: [cleanEmail],
            subject: `Welcome to ${courseName}: Your Learning Journey Starts Here!`,
            html: buildEmailHtml({
              logoUrl,
              heading: `Welcome to ${courseName}!`,
              intro: `Hi${userName ? ` ${userName}` : ""}! Congratulations — you've been invited to join our exclusive training program.`,
              description: "This course will equip you with practical skills to transform your work, enhance productivity, and unlock new opportunities.",
              courseName,
              ctaUrl: signupUrl,
              ctaText: "Create Your Account & Start Learning",
              email: cleanEmail,
              showAltLink: true,
              altLinkUrl: `${baseUrl}/signin`,
            }),
          });
        } catch (emailError) {
          console.error(`Failed to send email to ${cleanEmail}:`, emailError);
        }
      }
    }

    console.log(`Google Form webhook processed: ${cleanEmail} -> ${status}`);

    return new Response(
      JSON.stringify({ success: true, status }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in google-form-webhook:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

interface EmailParams {
  logoUrl: string;
  heading: string;
  intro: string;
  description: string;
  courseName: string;
  ctaUrl: string;
  ctaText: string;
  email: string;
  showAltLink: boolean;
  altLinkUrl?: string;
}

function buildEmailHtml(params: EmailParams): string {
  const { logoUrl, heading, intro, description, courseName, ctaUrl, ctaText, email, showAltLink, altLinkUrl } = params;
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="background-color: #ffffff; padding: 30px 40px; text-align: center;">
              <img src="${logoUrl}" alt="Limitless Lab" style="height: 50px; margin-bottom: 15px;">
            </td>
          </tr>
          <tr>
            <td style="background: linear-gradient(135deg, #393CA0 0%, #5B5FC7 100%); padding: 30px 40px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">${heading}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">${intro}</p>
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                <strong>${courseName}</strong> — ${description}
              </p>
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="${ctaUrl}" style="display: inline-block; background: linear-gradient(135deg, #393CA0 0%, #5B5FC7 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 14px rgba(57, 60, 160, 0.4);">
                      ${ctaText}
                    </a>
                  </td>
                </tr>
              </table>
              ${showAltLink && altLinkUrl ? `<p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0; text-align: center;">
                Already have an account? <a href="${altLinkUrl}" style="color: #393CA0; text-decoration: underline;">Sign in here</a>
              </p>` : ""}
            </td>
          </tr>
          <tr>
            <td style="background-color: #1f2937; padding: 30px 40px; text-align: center;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0 0 10px 0;">
                © ${new Date().getFullYear()} Limitless Lab. All rights reserved.
              </p>
              <p style="color: #6b7280; font-size: 11px; margin: 0;">
                This invitation was sent to ${email}.<br>
                If you didn't request this, you can safely ignore this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

serve(handler);
