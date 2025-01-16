import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'text/event-stream; charset=utf-8',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive'
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

async function* generateWorkoutWeek(
  weekNumber: number,
  totalWeeks: number,
  entityData: any,
  previousWeeks: string,
  similarWorkoutsContext: string
) {
  const weekStartDate = new Date(entityData.programSchedule.startDate)
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
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'developer',
          content: `You are a professional fitness coach creating detailed, personalized workout programs. 
          You are currently generating Week ${weekNumber} of ${totalWeeks}. Consider the previous weeks' workouts
          for proper progression and variation.`
        },
        {
          role: 'user',
          content: `
          PROGRAM DETAILS:
          - Duration: ${totalWeeks} weeks
          - Workouts per Week: ${entityData.programSchedule?.schedule.length}
          
          INSTRUCTIONS:
          1. Generate Week ${weekNumber} of ${totalWeeks}. Current week dates: ${weekStartDate.toISOString().split('T')[0]} to ${weekEndDate.toISOString().split('T')[0]}
          2. Each day must be written out completely, with no summarizing
          3. Include date, title, focus areas, warmup, main workout (sets/reps/rest), and cooldown
          4. Account for equipment availability, injuries, and skill levels
          
          PROGRAM REQUIREMENTS:
          1. Training Styles: ${formatValue(entityData.workoutFormat?.format)}
          2. Focus Areas: ${formatValue(entityData.workoutFormat?.focus)}
          3. Workout Schedule: ${formatValue(entityData.programSchedule?.schedule)}
          4. Session Duration: ${entityData.programSchedule?.sessionDuration} minutes
          5. Program Instructions: ${entityData.workoutFormat?.instructions || 'None provided'}
          6. Equipment Available: ${entityData.gymDetails?.equipment || 'Standard Gym'}
          
          MEDICAL CONSIDERATIONS:
          ${entityData.workoutFormat?.quirks || 'None reported'}
          
          PREVIOUS WEEKS:
          ${previousWeeks}
          
          SIMILAR WORKOUTS FOR REFERENCE:
          ${similarWorkoutsContext}
          
          Create detailed workouts for Week ${weekNumber}, ensuring proper progression from previous weeks.`
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
  let buffer = ''

  while (reader) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value)
    buffer += chunk
    
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(5).trim()
        
        if (data === '[DONE]') continue
        
        try {
          const payload = JSON.parse(data)
          if (payload.choices?.[0]?.delta?.content) {
            const content = payload.choices[0].delta.content
            yield content
          }
        } catch (e) {
          if (data && data !== '[DONE]') {
            yield data
          }
          continue
        }
      }
    }
  }

  if (buffer) {
    yield buffer
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { entityData } = await req.json()
    if (!entityData) {
      throw new Error('No entity data provided')
    }

    // Get similar workouts context first
    const queryText = `
      Program: ${entityData.programOverview?.name || 'Unnamed Program'}
      Description: ${entityData.programOverview?.description || 'No description provided'}
      Training Styles: ${formatValue(entityData.workoutFormat?.format)}
      Focus Areas: ${formatValue(entityData.workoutFormat?.focus)}
      Equipment: ${entityData.gymDetails?.equipment || 'Standard Gym'}
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

    const similarWorkoutsContext = similarWorkouts?.length
      ? similarWorkouts.map(workout => `${workout.title}:\n${workout.body}`).join('\n\n')
      : 'No similar workouts found for reference.'

    // Set up streaming response
    const stream = new TransformStream()
    const writer = stream.writable.getWriter()
    const encoder = new TextEncoder()

    // Process weeks in the background
const processWeeks = async () => {
  try {
    const totalWeeks = Math.min(6, entityData.duration_weeks || 0)
    let previousWeeks = ''
    
    for (let week = 1; week <= totalWeeks; week++) {
      try {
        await writer.write(
          encoder.encode(`data: \n\n--- Starting Week ${week} of ${totalWeeks} ---\n\n`)
        )

        let weekContent = ''
        let lineBuffer = ''
        
        for await (const chunk of generateWorkoutWeek(
          week,
          totalWeeks,
          entityData,
          previousWeeks,
          similarWorkoutsContext
        )) {
          if (chunk) {
            weekContent += chunk
            lineBuffer += chunk
            
            // Send complete lines when we have them
            if (lineBuffer.includes('\n')) {
              const lines = lineBuffer.split('\n')
              lineBuffer = lines.pop() || ''
              for (const line of lines) {
                await writer.write(encoder.encode(`data: ${line}\n`))
              }
            }
          }
        }
        
        // Send any remaining content
        if (lineBuffer) {
          await writer.write(encoder.encode(`data: ${lineBuffer}\n`))
        }
        
        previousWeeks += `\n\nWEEK ${week}:\n${weekContent}`
        await writer.write(encoder.encode(`data: \n--- End of Week ${week} ---\n\n`))
      } catch (weekError) {
        console.error(`Error processing week ${week}:`, weekError)
        await writer.write(
          encoder.encode(`data: Error generating week ${week}: ${weekError.message}\n\n`)
        )
        continue
      }
    }
  } catch (error) {
    console.error('Fatal error in week processing:', error)
    await writer.write(
      encoder.encode(`data: Fatal error generating workouts: ${error.message}\n\n`)
    )
  } finally {
    await writer.write(encoder.encode('data: [DONE]\n\n'))
    await writer.close()
  }
}
    processWeeks()

    return new Response(stream.readable, {
      headers: corsHeaders
    })
  } catch (error) {
    console.error('Full error details:', error)
    return new Response(
      JSON.stringify({
        error: 'There was an error processing your request',
        details: error.message
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