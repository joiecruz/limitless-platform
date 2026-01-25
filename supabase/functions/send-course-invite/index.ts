import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailTemplate {
  subject?: string;
  heading?: string;
  intro?: string;
  description?: string;
}

interface CourseInviteRequest {
  emails: string[];
  courseId: string;
  courseName: string;
  sendEmail: boolean;
  emailTemplate?: EmailTemplate;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    // Use service role client for all operations
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
    
    // Validate the user's token using the service role client
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      console.error("User auth error:", userError);
      throw new Error("Unauthorized");
    }

    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("is_admin, is_superadmin")
      .eq("id", user.id)
      .single();

    if (profileError || (!profile?.is_admin && !profile?.is_superadmin)) {
      throw new Error("Unauthorized: Admin access required");
    }

    const { emails, courseId, courseName, sendEmail, emailTemplate }: CourseInviteRequest = await req.json();

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      throw new Error("No emails provided");
    }

    if (!courseId) {
      throw new Error("Course ID is required");
    }

    const cleanEmails = [...new Set(
      emails
        .map(e => e.trim().toLowerCase())
        .filter(e => e && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))
    )];

    if (cleanEmails.length === 0) {
      throw new Error("No valid emails provided");
    }

    const { data: existingEnrollments } = await supabaseClient
      .from("pending_course_enrollments")
      .select("email")
      .eq("course_id", courseId)
      .in("email", cleanEmails);

    const existingEmails = new Set(existingEnrollments?.map(e => e.email) || []);
    const newEmails = cleanEmails.filter(e => !existingEmails.has(e));

    const { data: existingUsers } = await supabaseClient
      .from("profiles")
      .select("email")
      .in("email", newEmails);

    const userEmailsToCheck = existingUsers?.map(u => u.email) || [];
    
    let alreadyEnrolledEmails: string[] = [];
    if (userEmailsToCheck.length > 0) {
      const { data: userProfiles } = await supabaseClient
        .from("profiles")
        .select("id, email")
        .in("email", userEmailsToCheck);

      if (userProfiles && userProfiles.length > 0) {
        const userIds = userProfiles.map(p => p.id);
        
        const { data: courseAccess } = await supabaseClient
          .from("user_course_access")
          .select("user_id")
          .eq("course_id", courseId)
          .in("user_id", userIds);

        const enrolledUserIds = new Set(courseAccess?.map(a => a.user_id) || []);
        alreadyEnrolledEmails = userProfiles
          .filter(p => enrolledUserIds.has(p.id))
          .map(p => p.email);
      }
    }

    const emailsToInvite = newEmails.filter(e => !alreadyEnrolledEmails.includes(e));

    const enrollmentsToInsert = emailsToInvite.map(email => ({
      email,
      course_id: courseId,
      invited_by: user.id,
      metadata: { invited_at: new Date().toISOString() }
    }));

    let insertedCount = 0;
    if (enrollmentsToInsert.length > 0) {
      const { data: inserted, error: insertError } = await supabaseClient
        .from("pending_course_enrollments")
        .insert(enrollmentsToInsert)
        .select();

      if (insertError) {
        console.error("Insert error:", insertError);
        throw new Error(`Failed to create pending enrollments: ${insertError.message}`);
      }

      insertedCount = inserted?.length || 0;
    }

    let emailsSent = 0;
    if (sendEmail && emailsToInvite.length > 0) {
      const resendApiKey = Deno.env.get("RESEND_API_KEY");
      const fromEmail = Deno.env.get("FROM_EMAIL") || "noreply@limitlesslab.org";

      if (resendApiKey) {
        const resend = new Resend(resendApiKey);
        const signupUrl = "https://limitless-platform.lovable.app/signup";

        // Use custom template or defaults
        const subject = emailTemplate?.subject || `Welcome to ${courseName}: Your Learning Journey Starts Here!`;
        const heading = emailTemplate?.heading || `Welcome to ${courseName}!`;
        const intro = emailTemplate?.intro || "Congratulations! You've been invited to join our exclusive training program designed to help you succeed.";
        const description = emailTemplate?.description || "This course will equip you with practical skills to transform your work, enhance productivity, and unlock new opportunities.";

        for (const email of emailsToInvite) {
          try {
            await resend.emails.send({
              from: `Limitless Lab <${fromEmail}>`,
              to: [email],
              subject: subject,
              html: `
                <!DOCTYPE html>
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
                          
                          <!-- Header with Logo -->
                          <tr>
                            <td style="background: linear-gradient(135deg, #393CA0 0%, #5B5FC7 100%); padding: 30px 40px; text-align: center;">
                              <img src="https://limitless-platform.lovable.app/lovable-uploads/7fc7cd72-8cf0-4c22-b044-a9127b588f6d.png" alt="Limitless Lab" style="height: 50px; margin-bottom: 15px;">
                              <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">${heading}</h1>
                            </td>
                          </tr>

                          <!-- Main Content -->
                          <tr>
                            <td style="padding: 40px;">
                              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                ${intro}
                              </p>
                              
                              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                <strong>${courseName}</strong> — ${description}
                              </p>

                              <!-- CTA Button -->
                              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                <tr>
                                  <td align="center" style="padding: 20px 0;">
                                    <a href="${signupUrl}?email=${encodeURIComponent(email)}" 
                                       style="display: inline-block; background: linear-gradient(135deg, #393CA0 0%, #5B5FC7 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 14px rgba(57, 60, 160, 0.4);">
                                      Create Your Account & Start Learning
                                    </a>
                                  </td>
                                </tr>
                              </table>

                              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0; text-align: center;">
                                Already have an account? <a href="https://limitless-platform.lovable.app/signin" style="color: #393CA0; text-decoration: underline;">Sign in here</a>
                              </p>
                            </td>
                          </tr>

                          <!-- Footer -->
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
                </html>
              `,
            });
            emailsSent++;
          } catch (emailError) {
            console.error(`Failed to send email to ${email}:`, emailError);
          }
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        inserted: insertedCount,
        emailsSent,
        skippedDuplicate: existingEmails.size,
        skippedAlreadyEnrolled: alreadyEnrolledEmails.length,
        totalProcessed: cleanEmails.length,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-course-invite function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
