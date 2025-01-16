/* eslint-disable @typescript-eslint/no-explicit-any */
// import { createOpenAI } from 'https://esm.sh/@ai-sdk/openai@latest'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

// const openai = createOpenAI({
//   apiKey: Deno.env.get('OPENAI_API_KEY')
// })

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

async function* generateWorkoutsForWeek(
  weekNumber: number,
  totalWeeks: number,
  entityData: any,
  similarWorkoutsContext: string
) {
  const weekStartDate = new Date(entityData.sessionDetails.startDate)
  weekStartDate.setDate(weekStartDate.getDate() + (weekNumber - 1) * 7)
  
  const weekEndDate = new Date(weekStartDate)
  weekEndDate.setDate(weekEndDate.getDate() + 6)

  const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'developer',
          content: `You are a professional fitness coach creating detailed, personalized workout programs. 

              PROGRAM DETAILS:
              - Duration: ${entityData.sessionDetails?.schedule.length} weeks
              - Workouts per Week: ${entityData.sessionDetails?.schedule.length}
              
              INSTRUCTIONS:
              1. Generate ONLY Week ${weekNumber} of ${totalWeeks}. Current week dates: ${weekStartDate.toISOString().split('T')[0]} to ${weekEndDate.toISOString().split('T')[0]}
              2. Each day must be written out completely, with no skipping or summarizing.
              3. Provide the date, title, focus areas, detailed warmup, main workout with sets/reps/rest, and cooldown for each day.
              4. Avoid phrases like 'continue the same workouts' or 'similar to previous workouts.' Write out every session completely.
              5. Each workout must account for equipment availability, injuries, and skill levels.
              6. Always assume the client would like to continue the generation if the response is cut off.
              7. Continue the generation until all workouts for this week are complete.
              
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
              1. Write out EVERY workout in complete detail
              2. Format each day as:
                 [DATE: MM-DD-YYYY]
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
              
              Create the workouts for Week ${weekNumber} following all these requirements while carefully accounting for the listed injuries and movement restrictions.`
        }
      ],
      temperature: 0.7,
      stream: true
    })
  })

  if (!chatResponse.ok) {
    throw new Error(`OpenAI Chat API error: ${await chatResponse.text()}`)
  }

  const reader = chatResponse.body?.getReader()
  const decoder = new TextDecoder()

  while (reader) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value)
    let buffer = ''
    const lines = chunk.split('\n')
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(5).trim()
        
        if (data === '[DONE]') continue
        
        try {
          // Accumulate the buffer only for incomplete chunks
          if (!data.endsWith('}')) {
            buffer += data
            continue
          }
          
          const payload = JSON.parse(buffer + data)
          buffer = '' // Reset buffer after successful parse
          
          if (payload.choices?.[0]?.delta?.content) {
            yield payload.choices[0].delta.content
          }
        } catch (e) {
          // Only log parsing errors for complete chunks
          if (data.endsWith('}')) {
            console.error('Error parsing complete SSE chunk:', e)
          }
          continue
        }
      }
    }
  }
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

    // Get embeddings and similar workouts first
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

    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
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

    if (!embeddingResponse.ok) {
      throw new Error(`OpenAI Embedding API error: ${await embeddingResponse.text()}`)
    }

    const embedding = (await embeddingResponse.json()).data[0].embedding
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

    // Set up streaming response
    const stream = new TransformStream()
    const writer = stream.writable.getWriter()
    const encoder = new TextEncoder()

    // Start processing weeks in the background
    const processWeeks = async () => {
      try {
        const totalWeeks = entityData.sessionDetails?.schedule.length || 0
        
        for (let week = 1; week <= totalWeeks; week++) {
          try {
            // Add a week separator
            await writer.write(
              encoder.encode(`data: \n\nWeek ${week} of ${totalWeeks}:\n\n`)
            )

            // Generate and stream each week's workouts
            for await (const chunk of generateWorkoutsForWeek(
              week,
              totalWeeks,
              entityData,
              similarWorkoutsContext
            )) {
              if (chunk && typeof chunk === 'string') {
                await writer.write(encoder.encode(`data: ${chunk}\n\n`))
              }
            }
          } catch (weekError) {
            console.error(`Error processing week ${week}:`, weekError)
            await writer.write(
              encoder.encode(`data: Error generating week ${week}: ${weekError.message}\n\n`)
            )
            // Continue with next week despite error
            continue
          }
        }
      } catch (error) {
        console.error('Fatal error in week processing:', error)
        await writer.write(
          encoder.encode(`data: Fatal error generating workouts: ${error.message}\n\n`)
        )
      } finally {
        try {
          await writer.write(encoder.encode('data: [DONE]\n\n'))
          await writer.close()
        } catch (closeError) {
          console.error('Error closing writer:', closeError)
        }
      }
    }

    // Start processing in the background
    processWeeks()

    // Return the streaming response
    return new Response(stream.readable, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    })
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