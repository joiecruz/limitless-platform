import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface MasterTrainerNotificationRequest {
  email: string;
  firstName?: string;
  lastName?: string;
  isNewUser: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, firstName, lastName, isNewUser }: MasterTrainerNotificationRequest = await req.json();

    const displayName = firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || email;

    let subject: string;
    let htmlContent: string;

    if (isNewUser) {
      subject = "Welcome! Create Your Account for AI Ready ASEAN Master Trainer Access";
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🌏 AI Ready ASEAN</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Master Trainer Dashboard</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
            <h2 style="color: #333; margin-top: 0;">Welcome to AI Ready ASEAN!</h2>
            <p style="color: #666; line-height: 1.6;">
              Hello${displayName !== email ? ` ${displayName}` : ''},
            </p>
            <p style="color: #666; line-height: 1.6;">
              You have been invited to become a Master Trainer for the AI Ready ASEAN initiative! This is an exciting opportunity to lead AI education in Southeast Asia and help us reach our goal of empowering 5.5 million people.
            </p>
            <p style="color: #666; line-height: 1.6;">
              <strong>Next Steps:</strong>
            </p>
            <ol style="color: #666; line-height: 1.8;">
              <li>Create your account at <a href="https://limitlesslab.org/signup" style="color: #667eea;">https://limitlesslab.org/signup</a></li>
              <li>Use this email address: <strong>${email}</strong></li>
              <li>Once registered, you'll automatically have access to the Master Trainer dashboard</li>
            </ol>
          </div>

          <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin-bottom: 25px;">
            <h3 style="color: #333; margin-top: 0;">🎯 Your Mission as a Master Trainer</h3>
            <ul style="color: #666; line-height: 1.6; margin-bottom: 0;">
              <li>Conduct AI workshops and training sessions</li>
              <li>Guide participants through our Hour of Code modules</li>
              <li>Foster AI literacy in your community</li>
              <li>Join a network of changemakers across ASEAN</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://limitlesslab.org/signup" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
              Create Your Account Now
            </a>
          </div>

          <div style="text-align: center; color: #999; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p>AI Ready ASEAN | A regional initiative led by ASEAN Foundation, supported by Google.org</p>
            <p>Implemented in the Philippines by Limitless Lab</p>
          </div>
        </div>
      `;
    } else {
      subject = "🎉 You're Now a Master Trainer for AI Ready ASEAN!";
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🌏 AI Ready ASEAN</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Master Trainer Dashboard</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
            <h2 style="color: #333; margin-top: 0;">Congratulations, Master Trainer!</h2>
            <p style="color: #666; line-height: 1.6;">
              Hello${displayName !== email ? ` ${displayName}` : ''},
            </p>
            <p style="color: #666; line-height: 1.6;">
              🎉 You now have access to the AI Ready ASEAN Master Trainer dashboard! You're officially part of our mission to empower 5.5 million people across Southeast Asia with essential AI skills.
            </p>
          </div>

          <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin-bottom: 25px;">
            <h3 style="color: #333; margin-top: 0;">🚀 What You Can Do Now</h3>
            <ul style="color: #666; line-height: 1.6; margin-bottom: 0;">
              <li>Access exclusive Master Trainer resources and materials</li>
              <li>Download Hour of Code modules and training content</li>
              <li>View training recordings and best practices</li>
              <li>Connect with other Master Trainers in the region</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://limitlesslab.org/ai-ready-asean" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
              Access Your Dashboard
            </a>
          </div>

          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107; margin-bottom: 25px;">
            <h3 style="color: #856404; margin-top: 0;">📅 Important Dates</h3>
            <ul style="color: #856404; line-height: 1.6; margin-bottom: 0;">
              <li><strong>June 21, 2024</strong> - Master Trainer Orientation</li>
              <li><strong>Ongoing</strong> - Workshops and training sessions</li>
            </ul>
          </div>

          <div style="text-align: center; color: #999; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p>AI Ready ASEAN | A regional initiative led by ASEAN Foundation, supported by Google.org</p>
            <p>Implemented in the Philippines by Limitless Lab</p>
          </div>
        </div>
      `;
    }

    const emailResponse = await resend.emails.send({
      from: "AI Ready ASEAN <noreply@limitlesslab.org>",
      to: [email],
      subject: subject,
      html: htmlContent,
    });

    console.log("Master trainer notification sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-master-trainer-notification function:", error);
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