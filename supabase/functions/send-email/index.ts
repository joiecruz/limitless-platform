
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = "notification@limitlesslab.org";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string[];
  subject: string;
  html: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const emailRequest: EmailRequest = await req.json();
    console.log("Sending email to:", emailRequest.to);
    
    // Check if this is a password reset email
    if (emailRequest.subject.includes("Reset Your Password") || 
        emailRequest.html.includes("reset your password")) {
      console.log("Password reset email detected, customizing template...");
      
      // Extract the reset link from the original email
      const resetLink = extractResetLink(emailRequest.html);
      console.log("Extracted reset link:", resetLink);
      
      if (resetLink) {
        // Replace with our streamlined template
        emailRequest.html = generatePasswordResetEmail(resetLink, emailRequest.to[0]);
        console.log("Generated new email template with reset link:", resetLink);
      } else {
        console.error("Could not extract reset link from email");
      }
    }
    
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: emailRequest.to,
        subject: emailRequest.subject,
        html: emailRequest.html,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      console.log("Email sent successfully:", data);
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      const error = await res.text();
      console.error("Error sending email:", error);
      return new Response(JSON.stringify({ error }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (error: any) {
    console.error("Error in sendemail function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

// Helper function to extract the reset link from the original email
function extractResetLink(html: string): string | null {
  // Use a very robust regex to find the password reset URL 
  // Look for either href attributes or plain URLs in the text
  const hrefRegex = /href=["'](https:\/\/[^"']+)["']/g;
  const matches = [...html.matchAll(hrefRegex)];
  
  // Find the link that contains recovery or reset
  for (const match of matches) {
    if (match[1] && (match[1].includes("type=recovery") || match[1].includes("reset-password"))) {
      console.log("Found reset link via href:", match[1]);
      return match[1];
    }
  }
  
  // Fallback to finding URLs directly in the text
  const urlRegex = /(https:\/\/[^\s<>"']+)/g;
  const urlMatches = [...html.matchAll(urlRegex)];
  
  for (const match of urlMatches) {
    if (match[1] && (match[1].includes("type=recovery") || match[1].includes("reset-password"))) {
      console.log("Found reset link via direct URL:", match[1]);
      return match[1];
    }
  }
  
  return null;
}

// Function to generate password reset email
function generatePasswordResetEmail(resetLink: string, email: string): string {
  // Use backticks (`) for template literals to properly interpolate ${resetLink}
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Reset Your Password</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .header img {
      max-width: 200px;
    }
    h1 {
      color: #333;
      text-align: center;
      margin-bottom: 20px;
    }
    .button {
      display: block;
      width: 200px;
      background-color: #45429e;
      color: white;
      text-align: center;
      padding: 12px 20px;
      text-decoration: none;
      border-radius: 4px;
      margin: 30px auto;
      font-weight: bold;
    }
    .footer {
      margin-top: 40px;
      text-align: center;
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="header">
    <img src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/LL%20LOGO_PNG.png" alt="Limitless Lab" />
  </div>
  
  <h1>Reset Your Password</h1>
  
  <p>Hello,</p>
  
  <p>We received a request to reset your password for your Limitless Lab account. Click the button below to set a new password:</p>
  
  <a href="${resetLink}" class="button">Reset Password</a>
  
  <p>If you didn't request a password reset, you can safely ignore this email.</p>
  
  <p>If the button doesn't work, copy and paste this link into your browser:</p>
  <p style="word-break: break-all; color: #3355bb;"><a href="${resetLink}">${resetLink}</a></p>
  
  <p>Thank you,<br>The Limitless Lab Team</p>
  
  <div class="footer">
    <p>Limitless Lab</p>
    <p>5F RFM Corporate Center, Pioneer Street, Mandaluyong City, Philippines</p>
    <p>#2 Venture Drive #19-21 Vision Exchange, Singapore, 608526</p>
    <p>This is an automated email, please do not reply.</p>
  </div>
</body>
</html>`;
}

serve(handler);
