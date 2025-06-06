
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
      console.log("Processing password reset email");
      
      // Extract the reset link from the email
      const resetLink = extractResetLink(emailRequest.html);
      console.log("Extracted reset link:", resetLink);
      
      // Replace with our simplified template
      if (resetLink) {
        emailRequest.html = generateSimplePasswordResetEmail(resetLink);
      } else {
        console.warn("Could not extract reset link from email HTML");
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
function extractResetLink(html: string): string {
  console.log("Extracting reset link from HTML");
  
  // First, look for template variables that didn't get replaced
  if (html.includes("{{ .RedirectTo }}")) {
    console.log("Found template variable that wasn't replaced");
    
    // Try to extract the reset token from other parts of the HTML
    const tokenMatch = html.match(/token=([^&"'\s]+)/);
    const typeMatch = html.match(/type=([^&"'\s]+)/);
    
    if (tokenMatch && tokenMatch[1] && typeMatch && typeMatch[1] === "recovery") {
      const token = tokenMatch[1];
      // Construct our own reset URL
      const resetUrl = `${getDomainFromHtml(html)}/reset-password?token=${token}&type=recovery`;
      console.log("Constructed reset URL:", resetUrl);
      return resetUrl;
    }
  }
  
  // Try different patterns for finding the recovery link
  const patterns = [
    // Standard Supabase hash format
    /href=["'](https:\/\/[^"'\s]+#access_token=[^"'\s]+type=recovery[^"'\s]*)/i,
    // URL with token and type as query params
    /href=["'](https:\/\/[^"'\s]+\?(?:[^"'\s]*&)?token=[^"'\s]+&type=recovery[^"'\s]*)/i,
    // URL with just token as query param
    /href=["'](https:\/\/[^"'\s]+\?(?:[^"'\s]*&)?token=[^"'\s]+)/i,
    // Any URL with recovery in it
    /href=["'](https:\/\/[^"'\s]+(?:recovery)[^"'\s]*)/i,
    // Last resort: any URL that might be a reset link
    /href=["'](https:\/\/[^"'\s]+reset-password[^"'\s]*)/i
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      console.log("Found reset link with pattern:", pattern);
      return match[1];
    }
  }
  
  // If all else fails, try to find any URL
  const anyUrlMatch = html.match(/https:\/\/[^"'\s]+/g);
  if (anyUrlMatch && anyUrlMatch.length > 0) {
    // Filter to URLs that might be reset links
    const possibleResetLinks = anyUrlMatch.filter(url => 
      url.includes('token=') || 
      url.includes('access_token=') || 
      url.includes('type=recovery') || 
      url.includes('reset-password')
    );
    
    if (possibleResetLinks.length > 0) {
      console.log("Found possible reset link:", possibleResetLinks[0]);
      return possibleResetLinks[0];
    }
    
    // If no reset-specific URLs found, return the first URL
    console.log("No specific reset link found, using first URL:", anyUrlMatch[0]);
    return anyUrlMatch[0];
  }
  
  console.warn("No reset link or URL found in email HTML!");
  return "#"; // Fallback if no link is found
}

// Helper function to extract domain from HTML
function getDomainFromHtml(html: string): string {
  // Try to extract domain from any URL in the HTML
  const urlMatch = html.match(/https?:\/\/([^\/]+)/i);
  if (urlMatch && urlMatch[0]) {
    return urlMatch[0]; // Return the full protocol + domain
  }
  
  // Fallback to current domain
  return `${self.location.protocol}//${self.location.host}`;
}

// Function to generate simple password reset email
function generateSimplePasswordResetEmail(resetLink: string): string {
  return `
    <!DOCTYPE html>
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
        <img src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/limitless_lab_logo.png" alt="Limitless Lab" />
      </div>
      
      <h1>Reset Your Password</h1>
      
      <p>Hello,</p>
      
      <p>We received a request to reset your password for your Limitless Lab account. Click the button below to set a new password:</p>
      
      <a href="${resetLink}" class="button">Reset Password</a>
      
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p style="word-break: break-all; font-size: 12px;">${resetLink}</p>
      
      <p>If you didn't request a password reset, you can safely ignore this email.</p>
      
      <p>Thank you,<br>The Limitless Lab Team</p>
      
      <div class="footer">
        <p>Limitless Lab</p>
        <p>This is an automated email, please do not reply.</p>
      </div>
    </body>
    </html>
  `;
}

serve(handler);
