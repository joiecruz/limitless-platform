import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface VerifyOtpRequest {
  email: string;
  code: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, code }: VerifyOtpRequest = await req.json();

    if (!email || !code) {
      throw new Error("Email and code are required");
    }

    const normalizedEmail = email.toLowerCase();

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find valid OTP
    const { data: otpRecord, error: fetchError } = await supabase
      .from("otp_codes")
      .select("*")
      .eq("email", normalizedEmail)
      .eq("code", code)
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !otpRecord) {
      console.log("OTP verification failed:", fetchError?.message || "No valid OTP found");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Invalid or expired verification code" 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Mark OTP as used
    await supabase
      .from("otp_codes")
      .update({ used: true })
      .eq("id", otpRecord.id);

    // Clean up old OTP codes for this email
    await supabase
      .from("otp_codes")
      .delete()
      .eq("email", normalizedEmail)
      .neq("id", otpRecord.id);

    console.log("OTP verified successfully for:", normalizedEmail);

    // Create user account or sign in existing user
    const tempPassword = crypto.randomUUID();
    let userId: string;

    // Try to create new user
    const { data: createData, error: createError } = await supabase.auth.admin.createUser({
      email: normalizedEmail,
      password: tempPassword,
      email_confirm: true, // Already confirmed via OTP
    });

    if (createError) {
      // Check if user already exists
      if (createError.message.includes("already been registered") || 
          createError.message.includes("already exists")) {
        console.log("User already exists, fetching user ID");
        
        // Get existing user
        const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
        
        if (listError) {
          console.error("Error listing users:", listError);
          throw new Error("Failed to process user account");
        }
        
        const existingUser = existingUsers.users.find(
          u => u.email?.toLowerCase() === normalizedEmail
        );
        
        if (!existingUser) {
          throw new Error("User not found");
        }
        
        userId = existingUser.id;
      } else {
        console.error("Error creating user:", createError);
        throw new Error("Failed to create user account");
      }
    } else {
      userId = createData.user.id;
      console.log("New user created:", userId);
    }

    // Generate a magic link to get session tokens
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: normalizedEmail,
    });

    if (linkError) {
      console.error("Error generating link:", linkError);
      throw new Error("Failed to generate session");
    }

    // Extract the token from the link and exchange it for a session
    const tokenHash = linkData.properties?.hashed_token;
    
    if (!tokenHash) {
      console.error("No token hash in link data");
      throw new Error("Failed to generate session token");
    }

    // Use the verification token to get a session
    // We need to verify the OTP type link to get access/refresh tokens
    const verifyResponse = await fetch(`${supabaseUrl}/auth/v1/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
      },
      body: JSON.stringify({
        type: 'magiclink',
        token_hash: tokenHash,
      }),
    });

    if (!verifyResponse.ok) {
      const errorText = await verifyResponse.text();
      console.error("Verify response error:", errorText);
      throw new Error("Failed to verify session");
    }

    const sessionData = await verifyResponse.json();
    
    console.log("Session created successfully for:", normalizedEmail);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email verified successfully",
        verified: true,
        access_token: sessionData.access_token,
        refresh_token: sessionData.refresh_token,
        user_id: userId,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in verify-otp function:", error);
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
