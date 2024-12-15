import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId } = await req.json();

    if (!userId) {
      throw new Error('User ID is required');
    }

    console.log('Starting email confirmation process for user:', userId);

    // Initialize Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // First, verify the user exists
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
    
    if (userError || !userData.user) {
      console.error('Error fetching user:', userError);
      throw new Error('User not found');
    }

    console.log('User found:', userData.user.email);

    // Update user's email confirmation status using the admin API
    const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { 
        user_metadata: {
          ...userData.user.user_metadata,
          email_confirmed: true
        },
        email_confirmed: true,
        app_metadata: {
          ...userData.user.app_metadata,
          email_confirmed: true,
          email_verified: true
        }
      }
    );

    if (updateError) {
      console.error('Error confirming user:', updateError);
      throw updateError;
    }

    console.log('Successfully confirmed user:', userId, 'Update response:', updateData);

    return new Response(
      JSON.stringify({ success: true, data: updateData }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in confirm-invited-user function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});