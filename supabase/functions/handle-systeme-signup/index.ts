
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

    try {
      // Verify we're using the correct API endpoint
      const apiUrl = 'https://systeme.io/api/v2/contacts'; // Updated to v2 endpoint
      console.log(`Calling Systeme.io API at: ${apiUrl}`);

      // Use fetch with more explicit error handling
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': SYSTEME_API_KEY,
          'Accept': 'application/json'
        },
        body: JSON.stringify(systemePayload),
      });

      let responseText;
      
      try {
        responseText = await response.text();
        console.log('Systeme.io raw response status:', response.status);
        console.log('Systeme.io raw response text:', responseText);
      } catch (e) {
        console.error('Error reading response text:', e);
        responseText = 'Could not read response';
      }
      
      if (!response.ok) {
        console.error('Systeme.io API error status code:', response.status);
        console.error('Systeme.io API error response:', responseText);
        
        if (response.status === 429) {
          throw new Error('Rate limit exceeded with Systeme.io API. Please try again later.');
        } else if (response.status === 401 || response.status === 403) {
          throw new Error('Authentication failed with Systeme.io API. Please check API key.');
        } else if (response.status === 404) {
          // Special handling for 404 errors
          console.error('API endpoint not found. Please verify the correct API endpoint for Systeme.io');
          
          // Try fallback to v1 endpoint as a last resort
          console.log('Attempting fallback to v1 endpoint...');
          const fallbackResponse = await fetch('https://systeme.io/api/contacts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-API-KEY': SYSTEME_API_KEY,
              'Accept': 'application/json'
            },
            body: JSON.stringify(systemePayload),
          });
          
          const fallbackText = await fallbackResponse.text();
          console.log('Fallback response status:', fallbackResponse.status);
          console.log('Fallback response text:', fallbackText);
          
          if (fallbackResponse.ok) {
            console.log('Fallback to v1 endpoint successful');
            responseText = fallbackText;
            
            // Return success with the fallback result
            let fallbackResult;
            try {
              if (fallbackText.trim().startsWith('{') || fallbackText.trim().startsWith('[')) {
                fallbackResult = JSON.parse(fallbackText);
              } else {
                fallbackResult = { message: fallbackText };
              }
            } catch (e) {
              fallbackResult = { message: fallbackText };
            }
            
            return new Response(
              JSON.stringify({ 
                success: true, 
                data: fallbackResult,
                note: 'Used fallback API endpoint'
              }),
              { 
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200,
              }
            );
          } else {
            throw new Error(`Both API endpoints failed. Please verify your Systeme.io API key and endpoint documentation.`);
          }
        } else {
          throw new Error(`Failed to add contact to systeme.io: ${response.status} - ${responseText.substring(0, 200)}`);
        }
      }

      // Try to parse the response as JSON
      let result;
      try {
        // Check if the response is actually JSON before parsing
        if (responseText.trim().startsWith('{') || responseText.trim().startsWith('[')) {
          result = JSON.parse(responseText);
          console.log('Successfully added user to systeme.io with tag:', result);
        } else {
          console.warn('Response is not JSON format:', responseText);
          result = { message: 'Response received but not in JSON format' };
        }
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
    } catch (apiError) {
      console.error('API call error:', apiError);
      throw apiError;
    }

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
