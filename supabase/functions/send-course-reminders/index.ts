import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const LIMITLESSBIZ_COURSE_ID = "e0ac8d90-bdba-4a50-a3bd-148c0903d43f";

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY")!;
    const fromEmail = Deno.env.get("FROM_EMAIL") || "noreply@limitlesslab.org";

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const resend = new Resend(resendApiKey);

    // Get all lesson IDs for the course
    const { data: lessonRows, error: lessonError } = await supabase
      .from("lessons")
      .select("id")
      .eq("course_id", LIMITLESSBIZ_COURSE_ID);

    if (lessonError) throw new Error(`Failed to fetch lessons: ${lessonError.message}`);
    const allLessonIds = new Set((lessonRows || []).map(l => l.id));
    const totalLessons = allLessonIds.size;

    if (totalLessons === 0) {
      return new Response(
        JSON.stringify({ success: true, sent_count: 0, skipped_count: 0, message: "No lessons in course" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get enrollments with progress < 100 that haven't been reminded in 7+ days
    const { data: enrollments, error: enrollError } = await supabase
      .from("enrollments")
      .select("id, user_id, progress, completed_lessons, last_reminder_sent_at")
      .eq("course_id", LIMITLESSBIZ_COURSE_ID)
      .lt("progress", 100)
      .or("last_reminder_sent_at.is.null,last_reminder_sent_at.lt." + new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    if (enrollError) {
      console.error("Error fetching enrollments:", enrollError);
      throw new Error(`Failed to fetch enrollments: ${enrollError.message}`);
    }

    if (!enrollments || enrollments.length === 0) {
      return new Response(
        JSON.stringify({ success: true, sent_count: 0, skipped_count: 0, fixed_count: 0, message: "No users to remind" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Recalculate actual progress for each enrollment and fix stale values
    // Filter out users who have actually completed all lessons
    let fixedCount = 0;
    const incompleteEnrollments = [];

    for (const enrollment of enrollments) {
      const completedLessons = enrollment.completed_lessons || [];
      // Only count lessons that still exist in the course
      const validCompleted = completedLessons.filter((id: string) => allLessonIds.has(id));
      const actualProgress = Math.round((validCompleted.length / totalLessons) * 100);

      if (actualProgress >= 100) {
        // User actually finished — fix stale progress and skip reminder
        await supabase
          .from("enrollments")
          .update({ progress: 100 })
          .eq("id", enrollment.id);
        fixedCount++;
        console.log(`Fixed stale progress for enrollment ${enrollment.id}: ${enrollment.progress}% -> 100%`);
      } else {
        // Also fix progress if it drifted
        if (actualProgress !== enrollment.progress) {
          await supabase
            .from("enrollments")
            .update({ progress: actualProgress })
            .eq("id", enrollment.id);
          enrollment.progress = actualProgress;
          console.log(`Corrected progress for enrollment ${enrollment.id}: ${enrollment.progress}% -> ${actualProgress}%`);
        }
        incompleteEnrollments.push(enrollment);
      }
    }

    if (incompleteEnrollments.length === 0) {
      return new Response(
        JSON.stringify({ success: true, sent_count: 0, skipped_count: 0, fixed_count: fixedCount, message: "All matched users already completed" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Replace enrollments reference with only truly incomplete ones
    const activeEnrollments = incompleteEnrollments;

    // Get user profiles for these enrollments
    const userIds = enrollments.map(e => e.user_id);
    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("id, email, first_name")
      .in("id", userIds);

    if (profileError) {
      throw new Error(`Failed to fetch profiles: ${profileError.message}`);
    }

    const profileMap = new Map((profiles || []).map(p => [p.id, p]));

    const baseUrl = "https://limitlesslab.org";
    const logoUrl = `${baseUrl}/images/ll-logo-email.png`;
    const courseUrl = `${baseUrl}/courses/limitlessbiz`;

    let sentCount = 0;
    let skippedCount = 0;

    for (const enrollment of enrollments) {
      const profile = profileMap.get(enrollment.user_id);
      if (!profile?.email) {
        skippedCount++;
        continue;
      }

      const completedCount = enrollment.completed_lessons?.length || 0;
      const lessonTotal = totalLessons || 28;
      const progressPercent = enrollment.progress || 0;
      const firstName = profile.first_name || "Learner";

      try {
        await resend.emails.send({
          from: `Limitless Lab <${fromEmail}>`,
          to: [profile.email],
          subject: "Continue your LimitlessBiz journey 🚀",
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
                      <tr>
                        <td style="background-color: #ffffff; padding: 30px 40px; text-align: center;">
                          <img src="${logoUrl}" alt="Limitless Lab" style="height: 50px; margin-bottom: 15px;">
                        </td>
                      </tr>
                      <tr>
                        <td style="background: linear-gradient(135deg, #393CA0 0%, #5B5FC7 100%); padding: 30px 40px; text-align: center;">
                          <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">Keep Going, ${firstName}! 💪</h1>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 40px;">
                          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                            Hi ${firstName}, you're making progress on <strong>LimitlessBiz: AI for MSME Advancement</strong> — don't stop now!
                          </p>
                          
                          <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                            <tr>
                              <td style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; text-align: center;">
                                <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px 0;">Your Progress</p>
                                <p style="color: #393CA0; font-size: 32px; font-weight: 700; margin: 0 0 8px 0;">${progressPercent}%</p>
                                <p style="color: #374151; font-size: 14px; margin: 0;">
                                  ${completedCount} of ${lessonTotal} lessons completed
                                </p>
                                <div style="background-color: #e5e7eb; border-radius: 999px; height: 8px; margin-top: 12px; overflow: hidden;">
                                  <div style="background: linear-gradient(135deg, #393CA0, #5B5FC7); height: 100%; width: ${progressPercent}%; border-radius: 999px;"></div>
                                </div>
                              </td>
                            </tr>
                          </table>

                          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                            Each lesson brings you closer to mastering AI tools that can transform your business. Pick up right where you left off!
                          </p>
                          
                          <table role="presentation" style="width: 100%; border-collapse: collapse;">
                            <tr>
                              <td align="center" style="padding: 20px 0;">
                                <a href="${courseUrl}" 
                                   style="display: inline-block; background: linear-gradient(135deg, #393CA0 0%, #5B5FC7 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 14px rgba(57, 60, 160, 0.4);">
                                  Continue Learning →
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="background-color: #1f2937; padding: 30px 40px; text-align: center;">
                          <p style="color: #9ca3af; font-size: 12px; margin: 0 0 10px 0;">
                            © ${new Date().getFullYear()} Limitless Lab. All rights reserved.
                          </p>
                          <p style="color: #6b7280; font-size: 11px; margin: 0;">
                            You're receiving this because you're enrolled in LimitlessBiz.<br>
                            Sent to ${profile.email}.
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

        // Update last_reminder_sent_at
        await supabase
          .from("enrollments")
          .update({ last_reminder_sent_at: new Date().toISOString() })
          .eq("id", enrollment.id);

        sentCount++;
      } catch (emailError) {
        console.error(`Failed to send reminder to ${profile.email}:`, emailError);
        skippedCount++;
      }
    }

    console.log(`Reminders sent: ${sentCount}, skipped: ${skippedCount}`);

    return new Response(
      JSON.stringify({ success: true, sent_count: sentCount, skipped_count: skippedCount }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in send-course-reminders:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
