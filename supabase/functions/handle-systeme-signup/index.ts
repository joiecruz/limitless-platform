
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
    console.log('=== Starting handle-systeme-signup function ===');
    
    // Parse request body
    let user_id;
    try {
      const body = await req.json();
      user_id = body.user_id;
      console.log('Request body parsed successfully:', body);
    } catch (error) {
      console.error('Error parsing request body:', error);
      throw new Error('Invalid request body format');
    }
    
    // Check API key
    const SYSTEME_API_KEY = Deno.env.get('SYSTEME_API_KEY');
    if (!SYSTEME_API_KEY) {
      console.error('SYSTEME_API_KEY is not set in environment variables');
      throw new Error('Missing API key configuration');
    }

    // Validate user_id
    if (!user_id) {
      console.error('No user_id provided in request body');
      throw new Error('No user_id provided');
    }

    console.log('Processing signup for user:', user_id);

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Supabase URL or Service Key not set');
      throw new Error('Missing Supabase configuration');
    }
    
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

    // Get user profile
    console.log('Fetching user profile from database...');
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('email, first_name, last_name')
      .eq('id', user_id)
      .maybeSingle(); // Use maybeSingle instead of single to avoid errors if no profile is found

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      throw profileError;
    }

    if (!profile || !profile.email) {
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

    // Add delay before calling Systeme API to ensure profile data is properly saved
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Try multiple API endpoints
    const apiEndpoints = [
      { url: 'https://systeme.io/api/v2/contacts', version: 'v2' },
      { url: 'https://systeme.io/api/contacts', version: 'v1' },
      { url: 'https://systeme.io/api/external/contacts', version: 'external' }
    ];

    let lastError = null;
    let responseText = null;
    let successResponse = null;

    // Try each endpoint until one works
    for (const endpoint of apiEndpoints) {
      try {
        console.log(`Trying Systeme.io ${endpoint.version} API at: ${endpoint.url}`);
        
        const response = await fetch(endpoint.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': SYSTEME_API_KEY,
            'Accept': 'application/json'
          },
          body: JSON.stringify(systemePayload),
        });

        // Read response text regardless of status
        responseText = await response.text();
        console.log(`${endpoint.version} response status:`, response.status);
        console.log(`${endpoint.version} raw response:`, responseText);
        
        // Handle common error statuses
        if (response.status === 429) {
          console.error('Rate limit error from Systeme.io API');
          lastError = new Error('Rate limit exceeded with Systeme.io API');
          continue;
        } else if (response.status === 401 || response.status === 403) {
          console.error('Authentication error from Systeme.io API');
          lastError = new Error('Authentication failed with Systeme.io API');
          continue;
        } else if (response.status === 404) {
          console.error(`API endpoint ${endpoint.url} not found`);
          lastError = new Error(`API endpoint ${endpoint.version} not found`);
          continue;
        } else if (!response.ok) {
          console.error(`Failed API call to ${endpoint.version} endpoint:`, response.status, responseText);
          lastError = new Error(`Failed with status ${response.status}`);
          continue;
        }

        // Success case
        console.log(`Success with ${endpoint.version} API endpoint!`);
        
        let result;
        try {
          // Check if the response is actually JSON before parsing
          if (responseText.trim().startsWith('{') || responseText.trim().startsWith('[')) {
            result = JSON.parse(responseText);
          } else {
            result = { message: 'Response received but not in JSON format', text: responseText };
          }
        } catch (e) {
          result = { message: 'Error parsing response', text: responseText };
        }

        successResponse = {
          success: true, 
          data: result,
          endpoint: endpoint.version
        };
        
        // We found a working endpoint, break the loop
        break;
      } catch (apiError) {
        console.error(`Error with ${endpoint.version} API:`, apiError);
        lastError = apiError;
      }
    }

    // If we have a successful response, return it
    if (successResponse) {
      return new Response(
        JSON.stringify(successResponse),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // If all endpoints failed
    console.error('All Systeme.io API endpoints failed');
    
    // Return a softer error that doesn't break the user experience
    // We don't want signup to fail just because Systeme.io integration failed
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to add user to newsletter, but account was created successfully',
        technical_details: lastError?.message || 'Unknown error',
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200, // Return 200 even though there was an error with Systeme.io
      }
    );

  } catch (error) {
    console.error('Error in handle-systeme-signup:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error' }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
