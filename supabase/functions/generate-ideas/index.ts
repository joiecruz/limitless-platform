import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { projectName, projectDescription, projectProblem, projectCustomers, targetOutcomes } = await req.json()

    // Get OpenAI API key from environment
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    // Build dynamic prompt based on available project data
    let prompt = `Generate 5 innovative ideas for a project. Each idea should be practical, actionable, and specific to the project context.

Requirements for each idea:
- Title: Short, descriptive title (max 40 characters)
- Description: Maximum 2 sentences explaining the idea and its benefits (max 150 characters)

Project Context:`;

    if (projectName) {
      prompt += `\n- Project Name: ${projectName}`
    }
    
    if (projectDescription) {
      prompt += `\n- Project Description: ${projectDescription}`
    }
    
    if (projectProblem) {
      prompt += `\n- Main Problem/Challenge: ${projectProblem}`
    }
    
    if (projectCustomers) {
      prompt += `\n- Target Customers/Users: ${projectCustomers}`
    }
    
    if (targetOutcomes) {
      prompt += `\n- Desired Outcomes: ${targetOutcomes}`
    }

    prompt += `\n\nGenerate ideas that are:
1. Specific to this project's context and challenges
2. Practical and implementable
3. Focused on innovation and improvement
4. Tailored to the target audience
5. Aligned with the desired outcomes

Format the response as a JSON array with objects containing "title" and "description" fields.`

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert innovation consultant who generates practical, actionable ideas for projects. Always respond with valid JSON arrays containing idea objects with "title" and "description" fields. Keep descriptions to maximum 2 sentences.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 600,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      throw new Error('No content received from OpenAI')
    }

    // Parse the JSON response from OpenAI
    let ideas
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = content.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        ideas = JSON.parse(jsonMatch[0])
      } else {
        ideas = JSON.parse(content)
      }
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content)
      throw new Error('Invalid response format from AI service')
    }

    // Validate and clean the ideas
    if (!Array.isArray(ideas)) {
      throw new Error('AI response is not an array')
    }

    const cleanedIdeas = ideas
      .filter(idea => idea && typeof idea === 'object' && idea.title && idea.description)
      .map(idea => ({
        title: String(idea.title).substring(0, 40),
        description: String(idea.description).substring(0, 150)
      }))
      .slice(0, 5) // Ensure max 5 ideas

    // Fallback to default ideas if AI fails
    if (cleanedIdeas.length === 0) {
      cleanedIdeas.push(
        {
          title: "Customer Feedback Integration",
          description: "Implement a comprehensive feedback system to gather insights from users and improve the product based on real user needs."
        },
        {
          title: "Process Optimization",
          description: "Streamline workflows and eliminate bottlenecks to improve efficiency and reduce time to market."
        },
        {
          title: "Technology Enhancement",
          description: "Upgrade systems and tools to leverage the latest technologies for better performance and user experience."
        }
      )
    }

    return new Response(
      JSON.stringify({ ideas: cleanedIdeas }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error generating ideas:', error)
    
    // Return fallback ideas if everything fails
    const fallbackIdeas = [
      {
        title: "Customer Feedback Integration",
        description: "Implement a comprehensive feedback system to gather insights from users and improve the product based on real user needs."
      },
      {
        title: "Process Optimization", 
        description: "Streamline workflows and eliminate bottlenecks to improve efficiency and reduce time to market."
      },
      {
        title: "Technology Enhancement",
        description: "Upgrade systems and tools to leverage the latest technologies for better performance and user experience."
      }
    ]

    return new Response(
      JSON.stringify({ 
        ideas: fallbackIdeas,
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // Return 200 with fallback instead of error
      },
    )
  }
}) 