import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Tag ID for Limitless Lab Platform Members
const LIMITLESS_LAB_TAG_ID = 1452483;

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

    // Add user to systeme.io (without tags in initial creation)
    const systemePayload = {
      email: profile.email,
      firstName: profile.first_name || '',
      lastName: profile.last_name || ''
    };

    console.log('Sending request to Systeme.io with payload:', JSON.stringify(systemePayload));

    // Add delay before calling Systeme API to ensure profile data is properly saved
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      console.log('Calling Systeme.io API at: https://api.systeme.io/api/contacts');

      const response = await fetch('https://api.systeme.io/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': SYSTEME_API_KEY,
          'Accept': 'application/json'
        },
        body: JSON.stringify(systemePayload),
      });

      // Read response text regardless of status
      const responseText = await response.text();
      console.log('API response status:', response.status);
      console.log('API raw response:', responseText);

      // Handle common error statuses
      if (response.status === 429) {
        console.error('Rate limit error from Systeme.io API');
        throw new Error('Rate limit exceeded with Systeme.io API');
      } else if (response.status === 401 || response.status === 403) {
        console.error('Authentication error from Systeme.io API');
        throw new Error('Authentication failed with Systeme.io API');
      } else if (response.status === 400) {
        console.error('Invalid input error from Systeme.io API:', responseText);
        throw new Error('Invalid input provided to Systeme.io API');
      } else if (response.status === 422) {
        console.error('Unprocessable entity error from Systeme.io API:', responseText);
        throw new Error('Unprocessable entity error from Systeme.io API');
      } else if (response.status !== 201) {
        console.error('Failed API call:', response.status, responseText);
        throw new Error(`Failed with status ${response.status}`);
      }

      // Success case (201 status)
      console.log('Success with Systeme.io contact creation!');

      let contactResult;
      let contactId = null;

      try {
        // Check if the response is actually JSON before parsing
        if (responseText.trim().startsWith('{') || responseText.trim().startsWith('[')) {
          contactResult = JSON.parse(responseText);
          // Extract contact ID from response
          contactId = contactResult.id || contactResult.contact_id || contactResult.contactId;
        } else {
          contactResult = { message: 'Response received but not in JSON format', text: responseText };
        }
      } catch (e) {
        contactResult = { message: 'Error parsing response', text: responseText };
      }

      // Attempt to assign tag if we have a contact ID
      let tagAssignmentResult = { success: false, message: 'Contact ID not found in response' };

      if (contactId) {
        console.log(`Attempting to assign tag ${LIMITLESS_LAB_TAG_ID} to contact ${contactId}`);

        try {
          const tagResponse = await fetch(`https://api.systeme.io/api/contacts/${contactId}/tags`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-API-KEY': SYSTEME_API_KEY,
              'Accept': 'application/json'
            },
            body: JSON.stringify({ tagId: LIMITLESS_LAB_TAG_ID }),
          });

          console.log('Tag assignment response status:', tagResponse.status);

          if (tagResponse.status === 204) {
            console.log('Tag assigned successfully!');
            tagAssignmentResult = { success: true, message: 'Tag assigned successfully' };
          } else if (tagResponse.status === 400) {
            console.error('Invalid input for tag assignment');
            tagAssignmentResult = { success: false, message: 'Invalid input for tag assignment' };
          } else if (tagResponse.status === 422) {
            console.error('Unprocessable entity for tag assignment');
            tagAssignmentResult = { success: false, message: 'Unprocessable entity for tag assignment' };
          } else if (tagResponse.status === 429) {
            console.error('Rate limit for tag assignment');
            tagAssignmentResult = { success: false, message: 'Rate limit exceeded for tag assignment' };
          } else {
            console.error('Failed tag assignment:', tagResponse.status);
            tagAssignmentResult = { success: false, message: `Failed with status ${tagResponse.status}` };
          }
        } catch (tagError) {
          console.error('Error during tag assignment:', tagError);
          tagAssignmentResult = { success: false, message: `Error during tag assignment: ${tagError.message}` };
        }
      } else {
        console.warn('No contact ID found in response, skipping tag assignment');
      }

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            contact: contactResult,
            contactId: contactId,
            tagAssignment: tagAssignmentResult
          }
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );

    } catch (apiError) {
      console.error('Error with Systeme.io API:', apiError);

      // Return a softer error that doesn't break the user experience
      // We don't want signup to fail just because Systeme.io integration failed
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to add user to newsletter, but account was created successfully',
          technical_details: apiError.message || 'Unknown error',
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200, // Return 200 even though there was an error with Systeme.io
        }
      );
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
