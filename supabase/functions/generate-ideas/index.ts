import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { projectName, projectDescription, projectProblem, projectCustomers, targetOutcomes } = await req.json()

    const apiKey = Deno.env.get('LOVABLE_API_KEY')
    if (!apiKey) {
      throw new Error('LOVABLE_API_KEY is not configured')
    }

    let prompt = `Generate 5 innovative ideas for a project. Each idea should be practical, actionable, and specific to the project context.

Requirements for each idea:
- Title: Short, descriptive title (max 40 characters)
- Description: Maximum 2 sentences explaining the idea and its benefits (max 150 characters)

Project Context:`;

    if (projectName) prompt += `\n- Project Name: ${projectName}`
    if (projectDescription) prompt += `\n- Project Description: ${projectDescription}`
    if (projectProblem) prompt += `\n- Main Problem/Challenge: ${projectProblem}`
    if (projectCustomers) prompt += `\n- Target Customers/Users: ${projectCustomers}`
    if (targetOutcomes) prompt += `\n- Desired Outcomes: ${targetOutcomes}`

    prompt += `\n\nGenerate ideas that are:
1. Specific to this project's context and challenges
2. Practical and implementable
3. Focused on innovation and improvement
4. Tailored to the target audience
5. Aligned with the desired outcomes

Format the response as a JSON array with objects containing "title" and "description" fields.`

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          {
            role: 'system',
            content: 'You are an expert innovation consultant who generates practical, actionable ideas for projects. Always respond with valid JSON arrays containing idea objects with "title" and "description" fields. Keep descriptions to maximum 2 sentences.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 600,
      }),
    })

    if (response.status === 429) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded, please try again later.' }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    if (response.status === 402) {
      return new Response(JSON.stringify({ error: 'AI credits exhausted, please add funds.' }), { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      throw new Error('No content received from AI')
    }

    let ideas
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        ideas = JSON.parse(jsonMatch[0])
      } else {
        ideas = JSON.parse(content)
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', content)
      throw new Error('Invalid response format from AI service')
    }

    if (!Array.isArray(ideas)) {
      throw new Error('AI response is not an array')
    }

    const cleanedIdeas = ideas
      .filter(idea => idea && typeof idea === 'object' && idea.title && idea.description)
      .map(idea => ({
        title: String(idea.title).substring(0, 40),
        description: String(idea.description).substring(0, 150)
      }))
      .slice(0, 5)

    if (cleanedIdeas.length === 0) {
      cleanedIdeas.push(
        { title: "Customer Feedback Integration", description: "Implement a comprehensive feedback system to gather insights from users and improve the product based on real user needs." },
        { title: "Process Optimization", description: "Streamline workflows and eliminate bottlenecks to improve efficiency and reduce time to market." },
        { title: "Technology Enhancement", description: "Upgrade systems and tools to leverage the latest technologies for better performance and user experience." }
      )
    }

    return new Response(
      JSON.stringify({ ideas: cleanedIdeas }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 },
    )

  } catch (error) {
    console.error('Error generating ideas:', error)
    
    const fallbackIdeas = [
      { title: "Customer Feedback Integration", description: "Implement a comprehensive feedback system to gather insights from users and improve the product based on real user needs." },
      { title: "Process Optimization", description: "Streamline workflows and eliminate bottlenecks to improve efficiency and reduce time to market." },
      { title: "Technology Enhancement", description: "Upgrade systems and tools to leverage the latest technologies for better performance and user experience." }
    ]

    return new Response(
      JSON.stringify({ ideas: fallbackIdeas, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 },
    )
  }
})
