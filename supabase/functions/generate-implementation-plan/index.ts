import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ImplementationPlan {
  phases: Array<{
    name: string;
    description: string;
    duration: string;
    tasks: Array<{
      task: string;
      responsible: string;
      timeline: string;
      dependencies: string[];
    }>;
  }>;
  timeline: string;
  resources: Array<{
    type: string;
    description: string;
    quantity: string;
  }>;
  risks: Array<{
    risk: string;
    impact: string;
    mitigation: string;
  }>;
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

    const systemPrompt = `You are an expert in project management and implementation planning. \nGenerate a comprehensive implementation plan for a project.\nReturn ONLY valid JSON as a JSON object with the following structure, and nothing else. Do not include any explanation or extra text.\n{\n  "phases": [\n    {\n      "name": "Phase name (e.g., Preparation, Development, Testing, Launch)",\n      "description": "Detailed description of what this phase involves",\n      "duration": "Estimated duration (e.g., 2-3 weeks)",\n      "tasks": [\n        {\n          "task": "Specific task description",\n          "responsible": "Who is responsible (e.g., Project Manager, Development Team)",\n          "timeline": "Timeline for this task (e.g., Week 1-2)",\n          "dependencies": ["List of tasks this depends on"]\n        }\n      ]\n    }\n  ],\n  "timeline": "Overall project timeline (e.g., 3-6 months)",\n  "resources": [\n    {\n      "type": "Resource type (e.g., Human, Technology, Budget)",\n      "description": "Description of the resource needed",\n      "quantity": "Quantity or amount needed"\n    }\n  ],\n  "risks": [\n    {\n      "risk": "Potential risk description",\n      "impact": "Impact level (High/Medium/Low) and description",\n      "mitigation": "How to mitigate this risk"\n    }\n  ]\n}\n\nMake the plan realistic and actionable. Include 3-4 phases with 3-5 tasks each.`;

    const userPrompt = `Based on this project: ${contextInfo}. Generate a detailed implementation plan with phases, tasks, resources, and risk assessment. Focus on creating a practical roadmap for executing this project successfully.`;

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
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Error calling OpenAI API');
    }

    const generatedText = data.choices[0].message.content;
    
    // Try to extract and parse as JSON
    let implementationPlan: ImplementationPlan;
    try {
      // Use regex to extract the first JSON object in the response
      const match = generatedText.match(/\{[\s\S]*\}/);
      if (match) {
        implementationPlan = JSON.parse(match[0]);
      } else {
        throw new Error('No valid JSON found in OpenAI response');
      }
      if (!implementationPlan.phases || !Array.isArray(implementationPlan.phases)) {
        throw new Error('Invalid plan structure');
      }
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError, 'Raw response:', generatedText);
      throw new Error('Failed to generate valid implementation plan data');
    }

    return new Response(
      JSON.stringify({ implementationPlan }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error generating implementation plan:', error, error.stack);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to generate implementation plan' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}); 