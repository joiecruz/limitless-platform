
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    console.log("API key available:", !!openAIApiKey);
    
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not set in environment');
    }
    
    // Parse request body
    let body;
    try {
      body = await req.json();
      console.log("Received request body:", JSON.stringify(body));
    } catch (e) {
      console.error("Error parsing request body:", e);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { prompt } = body;
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'No prompt provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Processing prompt:", prompt);

    const systemPrompt = `You are an expert in design thinking and innovation challenges. 
    Create a detailed but concise description (3-4 sentences) for a challenge based on the "How Might We" question provided. 
    The description should explain the purpose of collecting ideas for this challenge, 
    what kind of ideas are being sought, and the broader context of the challenge.
    Do not use placeholders or generic text - make it specific to the "How Might We" question.`;

    console.log("Calling OpenAI API...");
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: 250,
        temperature: 0.7,
      }),
    });

    console.log("OpenAI API response status:", response.status);
    const data = await response.json();
    
    if (!response.ok) {
      console.error("OpenAI API error:", data);
      throw new Error(data.error?.message || 'Error calling OpenAI API');
    }

    const generatedText = data.choices[0].message.content;
    console.log("Generated text:", generatedText);

    return new Response(
      JSON.stringify({ generatedText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error generating description:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to generate description' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
