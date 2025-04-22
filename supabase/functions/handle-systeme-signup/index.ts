
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id } = await req.json();
    const SYSTEME_API_KEY = Deno.env.get('SYSTEME_API_KEY');

    if (!SYSTEME_API_KEY) {
      console.error('SYSTEME_API_KEY is not set in environment variables');
      throw new Error('Missing API key configuration');
    }

    if (!user_id) {
      throw new Error('No user_id provided');
    }

    console.log('Processing signup for user:', user_id);

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user profile
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('email, first_name, last_name')
      .eq('id', user_id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      throw profileError;
    }

    if (!profile?.email) {
      console.error('No email found for user:', user_id);
      throw new Error('No email found for user');
    }

    console.log('Found user profile:', profile.email, profile.first_name, profile.last_name);

    // Add user to systeme.io with tag
    const systemePayload = {
      email: profile.email,
      firstName: profile.first_name || '',
      lastName: profile.last_name || '',
      source: 'web_signup',
      tags: ['Limitless Lab Platform Members']
    };

    console.log('Sending request to Systeme.io with payload:', JSON.stringify(systemePayload));

    const response = await fetch('https://systeme.io/api/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': SYSTEME_API_KEY,
      },
      body: JSON.stringify(systemePayload),
    });

    const responseText = await response.text();
    console.log('Systeme.io raw response:', responseText);
    
    if (!response.ok) {
      console.error('Systeme.io API error:', responseText);
      throw new Error(`Failed to add contact to systeme.io: ${responseText}`);
    }

    let result;
    try {
      result = JSON.parse(responseText);
      console.log('Successfully added user to systeme.io with tag:', result);
    } catch (e) {
      console.error('Error parsing JSON response:', e);
      result = { message: responseText };
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in handle-systeme-signup:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
