import { createOpenAI } from 'https://esm.sh/@ai-sdk/openai@latest'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const openai = createOpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY')
})

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
}

const formatValue = (value: any): string => {
  if (Array.isArray(value)) {
    return value.join(', ')
  }
  if (typeof value === 'string') {
    return value
  }
  return String(value || '')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (!Deno.env.get('OPENAI_API_KEY')) {
      throw new Error('OpenAI API key is not configured')
    }

    const { entityData } = await req.json()

    if (!entityData) {
      throw new Error('No entity data provided')
    }

    console.log('Received entity data:', JSON.stringify(entityData, null, 2))

    const queryText = `
      Program: ${entityData.programOverview?.name || 'Unnamed Program'}
      Description: ${entityData.programOverview?.description || 'No description provided'}
      Training Styles: ${formatValue(entityData.workoutFormat?.format)}
      Focus Areas: ${formatValue(entityData.workoutFormat?.focus)}
      Program Instructions: ${entityData.workoutFormat?.instructions || 'None provided'}
      Injuries/Restrictions: ${entityData.workoutFormat?.quirks || 'None provided'}
      Equipment: ${entityData.gymDetails?.equipment || 'Standard Gym'}
      Space: ${entityData.gymDetails?.spaceDescription || 'Standard space'}
    `.trim()

    try {
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'text-embedding-3-large',
          input: queryText,
          dimensions: 1536,
          encoding_format: 'float'
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`)
      }

      const embeddingResponse = await response.json()
      const embedding = embeddingResponse.data[0].embedding
      const embeddingPart1 = embedding.slice(0, Math.floor(embedding.length / 2))
      const embeddingPart2 = embedding.slice(Math.floor(embedding.length / 2))

      const { data: similarWorkouts, error: searchError } = await supabase.rpc(
        'match_similar_workouts',
        {
          query_embedding_1: embeddingPart1,
          query_embedding_2: embeddingPart2,
          match_threshold: 0.8,
          match_count: 3
        }
      )

      if (searchError) {
        console.error('Error searching workouts:', searchError)
      }

      const similarWorkoutsContext = similarWorkouts?.length
        ? similarWorkouts
            .map(
              (workout) => `
                ${workout.title}:
                ${workout.body}
              `
            )
            .join('\n\n')
        : 'No similar workouts found for reference.'

      const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are a professional fitness coach creating detailed, personalized workout programs. 
              
              PROGRAM REQUIREMENTS:
              1. Training Styles: ${formatValue(entityData.workoutFormat?.format)}
              2. Focus Areas: ${formatValue(entityData.workoutFormat?.focus)}
              3. Program Duration: ${entityData.sessionDetails?.startDate} to ${entityData.sessionDetails?.endDate}
              4. Workout Schedule: ${formatValue(entityData.sessionDetails?.schedule)}
              5. Session Duration: ${entityData.sessionDetails?.sessionDuration} minutes
              6. Program Instructions: ${entityData.workoutFormat?.instructions || 'None provided'}
              7. Equipment Available: ${entityData.gymDetails?.equipment || 'Standard Gym'}
              
              MEDICAL CONSIDERATIONS:
              Injuries and Movement Restrictions: ${entityData.workoutFormat?.quirks || 'None reported'}
              
              FORMAT REQUIREMENTS:
              1. Write out EVERY workout in complete detail for the entire program duration
              2. Format each day as:
                 [DATE: YYYY-MM-DD]
                 Workout Title:
                 
                 Focus: [Areas being targeted]
                 Duration: [Total minutes]
                 
                 Warmup: (10-15 minutes)
                 [Detailed warmup routine]
                 
                 Main Work: (Specify duration)
                 [Complete workout with all details]
                 
                 Cooldown: (5-10 minutes)
                 [Specific cooldown/mobility work]
                 
                 Modifications:
                 - Scaling options
                 - Injury accommodations
                 - Intensity adjustments
              
              3. For each exercise, specify:
                 - Sets, reps, and rest periods
                 - RX weights (male/female)
                 - Scaled weights (male/female)
                 - Form cues and common faults
                 - Modifications for listed injuries
              
              4. NEVER use phrases like:
                 - "continue with similar workouts"
                 - "repeat previous workout"
                 - "alternate between"
                 Instead, write out each workout completely.
              
              Similar Reference Workouts:
              ${similarWorkoutsContext}
              
              Create a complete program that follows all these requirements while carefully accounting for the listed injuries and movement restrictions.`
            }
          ],
          temperature: 0.7,
          stream: true
        })
      })

      if (!chatResponse.ok) {
        const errorData = await chatResponse.json()
        throw new Error(`OpenAI Chat API error: ${JSON.stringify(errorData)}`)
      }

      return new Response(chatResponse.body, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        }
      })

    } catch (apiError) {
      console.error('API error:', apiError)
      throw apiError
    }
  } catch (error) {
    console.error('Full error details:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    })
    
    return new Response(
      JSON.stringify({
        error: 'There was an error processing your request',
        details: error.message,
        stack: error.stack
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    )
  }
})