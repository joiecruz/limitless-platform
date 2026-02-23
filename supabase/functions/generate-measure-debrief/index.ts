import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      throw new Error('LOVABLE_API_KEY is not set in environment');
    }

    const { projectName, projectDescription, metrics } = await req.json();
    if (!projectName) {
      return new Response(
        JSON.stringify({ error: 'No projectName provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userPrompt = `Project Name: ${projectName}
${projectDescription ? `Project Description: ${projectDescription}` : ''}
${metrics && Array.isArray(metrics) ? `Key Metrics: ${metrics.map((m: any) => m.title + (m.current !== undefined ? ` (Current: ${m.current}, Target: ${m.target})` : '')).join('; ')}` : ''}`;

    const systemPrompt = `You are an expert project evaluator. Given the project context, generate a concise debrief and reflection with three sections: 
1. What went well
2. What went wrong
3. What can be improved
Return ONLY valid JSON in the following format:
{
  "wentWell": "...",
  "wentWrong": "...",
  "improvements": "..."
}
Do not include any extra text or commentary.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 400,
        temperature: 0.7,
      }),
    });

    if (response.status === 429) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded, please try again later.' }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    if (response.status === 402) {
      return new Response(JSON.stringify({ error: 'AI credits exhausted, please add funds.' }), { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Error calling AI API');
    }

    const content = data.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    let debrief;
    try {
      debrief = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    } catch (e) {
      throw new Error('Failed to parse JSON from AI response: ' + content);
    }

    return new Response(
      JSON.stringify(debrief),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating debrief:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to generate debrief' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
