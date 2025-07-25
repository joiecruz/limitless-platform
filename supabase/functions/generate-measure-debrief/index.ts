// import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// import "https://deno.land/x/xhr@0.1.0/mod.ts";

// const corsHeaders = {
//   'Access-Control-Allow-Origin': '*',
//   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
// };

// serve(async (req) => {
//   // Handle CORS preflight requests
//   if (req.method === 'OPTIONS') {
//     return new Response(null, { headers: corsHeaders });
//   }

//   try {
//     const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
//     if (!openAIApiKey) {
//       throw new Error('OPENAI_API_KEY is not set in environment');
//     }

//     const { projectName, projectDescription, metrics } = await req.json();
//     if (!projectName) {
//       return new Response(
//         JSON.stringify({ error: 'No projectName provided' }),
//         { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//       );
//     }

//     const userPrompt = `Project Name: ${projectName}
// ${projectDescription ? `Project Description: ${projectDescription}` : ''}
// ${metrics && Array.isArray(metrics) ? `Key Metrics: ${metrics.map(m => m.title + (m.current !== undefined ? ` (Current: ${m.current}, Target: ${m.target})` : '')).join('; ')}` : ''}`;

//     const systemPrompt = `You are an expert project evaluator. Given the project context, generate a concise debrief and reflection with three sections: \n1. What went well\n2. What went wrong\n3. What can be improved\nReturn ONLY valid JSON in the following format:\n{\n  "wentWell": "...",
//   "wentWrong": "...",
//   "improvements": "..."
// }\nDo not include any extra text or commentary.`;

//     const response = await fetch('https://api.openai.com/v1/chat/completions', {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${openAIApiKey}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         model: 'gpt-4o-mini',
//         messages: [
//           { role: 'system', content: systemPrompt },
//           { role: 'user', content: userPrompt }
//         ],
//         max_tokens: 400,
//         temperature: 0.7,
//       }),
//     });

//     const data = await response.json();
//     if (!response.ok) {
//       throw new Error(data.error?.message || 'Error calling OpenAI API');
//     }

//     // Try to extract JSON from the response
//     let content = data.choices[0].message.content;
//     let jsonMatch = content.match(/\{[\s\S]*\}/);
//     let debrief;
//     try {
//       debrief = JSON.parse(jsonMatch ? jsonMatch[0] : content);
//     } catch (e) {
//       throw new Error('Failed to parse JSON from OpenAI response: ' + content);
//     }

//     return new Response(
//       JSON.stringify(debrief),
//       { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//     );
//   } catch (error) {
//     console.error('Error generating debrief:', error);
//     return new Response(
//       JSON.stringify({ error: error.message || 'Failed to generate debrief' }),
//       { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//     );
//   }
// }); 