import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BudgetPlan {
  totalBudget: string;
  categories: Array<{
    category: string;
    description: string;
    amount: string;
    percentage: number;
  }>;
  timeline: Array<{
    period: string;
    amount: string;
    description: string;
  }>;
  assumptions: Array<{
    assumption: string;
    impact: string;
  }>;
  contingencies: Array<{
    item: string;
    amount: string;
    reason: string;
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

    const systemPrompt = `You are an expert in project budgeting and financial planning. \nGenerate a comprehensive budget plan for a project.\nReturn ONLY valid JSON as a JSON object with the following structure, and nothing else. Do not include any explanation or extra text.\n{\n  "totalBudget": "Total budget amount (e.g., $50,000)",\n  "categories": [\n    {\n      "category": "Budget category (e.g., Personnel, Technology, Marketing)",\n      "description": "Description of what this category covers",\n      "amount": "Amount allocated (e.g., $25,000)",\n      "percentage": 50\n    }\n  ],\n  "timeline": [\n    {\n      "period": "Time period (e.g., Q1, Month 1-3)",\n      "amount": "Amount for this period (e.g., $15,000)",\n      "description": "What will be spent during this period"\n    }\n  ],\n  "assumptions": [\n    {\n      "assumption": "Budget assumption (e.g., Team size, Technology costs)",\n      "impact": "How this assumption affects the budget"\n    }\n  ],\n  "contingencies": [\n    {\n      "item": "Contingency item (e.g., Additional development time)",\n      "amount": "Contingency amount (e.g., $5,000)",\n      "reason": "Why this contingency is needed"\n    }\n  ]\n}\n\nMake the budget realistic and detailed. Include 4-6 categories with reasonable percentages.`;

    const userPrompt = `Based on this project: ${contextInfo}. Generate a detailed budget plan with categories, timeline, assumptions, and contingencies. Focus on creating a comprehensive financial roadmap for this project.`;

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
        max_tokens: 1200,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Error calling OpenAI API');
    }

    const generatedText = data.choices[0].message.content;
    
    // Try to extract and parse as JSON
    let budgetPlan: BudgetPlan;
    try {
      // Use regex to extract the first JSON object in the response
      const match = generatedText.match(/\{[\s\S]*\}/);
      if (match) {
        budgetPlan = JSON.parse(match[0]);
      } else {
        throw new Error('No valid JSON found in OpenAI response');
      }
      if (!budgetPlan.categories || !Array.isArray(budgetPlan.categories)) {
        throw new Error('Invalid budget structure');
      }
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError, 'Raw response:', generatedText);
      throw new Error('Failed to generate valid budget plan data');
    }

    return new Response(
      JSON.stringify({ budgetPlan }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error generating budget plan:', error, error.stack);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to generate budget plan' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}); 