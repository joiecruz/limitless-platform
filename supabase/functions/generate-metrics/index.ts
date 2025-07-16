import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface KeyMetric {
  indicator: string;
  target: number;
  unit: string;
  due: string;
  lastUpdated: {
    value: number;
    date: string;
  };
  progress: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not set in environment');
    }
    
    const { 
      projectName, 
      projectDescription, 
      projectProblem, 
      projectCustomers, 
      targetOutcomes
    } = await req.json();

    // Log the received payload for debugging
    console.log('Received payload:', { projectName, projectDescription, projectProblem, projectCustomers, targetOutcomes });
    
    if (!projectName) {
      return new Response(
        JSON.stringify({ error: 'Project name is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const contextInfo = [
      `Project: "${projectName}"`,
      projectDescription ? `Description: "${projectDescription}"` : '',
      projectProblem ? `Problem: "${projectProblem}"` : '',
      projectCustomers ? `Target audience: "${projectCustomers}"` : '',
      targetOutcomes ? `Target outcomes: "${targetOutcomes}"` : ''
    ].filter(Boolean).join('. ');

    const systemPrompt = `You are an expert in innovation project management. Given the project context, generate 3-5 OKRs (Objectives and Key Results) for measuring project success. Each OKR should have a clear Objective and 2-3 measurable Key Results. Return ONLY valid JSON in the following format:\n{\n  \"metrics\": [\n    {\n      \"objective\": \"...\",\n      \"keyResults\": [\n        {\n          \"indicator\": \"...\",\n          \"target\": number,\n          \"unit\": \"...\",\n          \"due\": \"YYYY-MM-DD\",\n          \"lastUpdated\": { \"value\": number, \"date\": \"YYYY-MM-DD\" },\n          \"progress\": number\n        }\n      ]\n    }\n  ]\n}\nDo not include any extra text or commentary. Use the OKR framework, not just generic KPIs. The 'due' date for each key result should be a date later than today (a future date).`;

    const userPrompt = `Based on this project: ${contextInfo}. Generate 4-5 key performance indicators for the implementation phase. Focus on metrics that will help track the success of deploying and scaling this solution.`;

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
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Error calling OpenAI API');
    }

    const generatedText = data.choices[0].message.content;
    
    // Try to parse the whole response as JSON and extract metrics
    let metrics: KeyMetric[] = [];
    try {
      const obj = JSON.parse(generatedText);
      if (obj && Array.isArray(obj.metrics)) {
        metrics = obj.metrics;
      } else {
        throw new Error('No metrics array found in OpenAI response');
      }
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError, 'Raw response:', generatedText);
      throw new Error('Failed to generate valid metrics data');
    }

    return new Response(
      JSON.stringify({ metrics }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error generating metrics:', error, error.stack);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to generate metrics' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}); 