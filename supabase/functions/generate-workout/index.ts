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

function summarizePreviousWeeks(previousWeeks) {
  const weeks = previousWeeks.split('--- End of Week ').filter(w => w.trim())
  const summaries = weeks.map(weekContent => {
    const weekNumberMatch = weekContent.match(/Week (\d+)/)
    const focusMatch = weekContent.match(/Focus Areas:\s*(.*)/)
    const weekNumber = weekNumberMatch ? weekNumberMatch[1] : 'Unknown'
    const focus = focusMatch ? focusMatch[1] : 'Various'
    return `Week ${weekNumber}: Focused on ${focus}.`
  })
  
  // Limit to the last 2 weeks to keep the summary concise
  const recentSummaries = summaries.slice(-2).join('\n')
  
  return recentSummaries
}

async function fetchWithRetry(url, options, retries = 3, backoff = 3000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options)
      if (response.ok) return response
      else {
        const errorText = await response.text()
        throw new Error(`Attempt ${attempt}: ${errorText}`)
      }
    } catch (error) {
      console.warn(`Fetch attempt ${attempt} failed: ${error.message}`)
      if (attempt < retries) {
        console.log(`Retrying in ${backoff}ms...`)
        await new Promise(res => setTimeout(res, backoff))
      } else {
        throw new Error(`All ${retries} fetch attempts failed.`)
      }
    }
  }
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
  console.log(`Generate Week ${weekNumber} of ${totalWeeks}. Current week dates: ${weekStartDate.toISOString().split('T')[0]} to ${weekEndDate.toISOString().split('T')[0]}`)

  // Construct the prompt
  const prompt = `
    You are a professional fitness coach creating detailed, personalized workout programs.
    Each workout should be tailored to the client's metrics:

    CLIENT METRICS:
    - Gender: ${entityData.clientMetrics.gender}
    - Height: ${entityData.height_cm}cm
    - Weight: ${entityData.weight_kg}kg
    - Bench 1RM: ${entityData.bench_1rm}kg
    - Squat 1RM: ${entityData.squat_1rm}kg
    - Deadlift 1RM: ${entityData.deadlift_1rm}kg
    - Mile Time: ${formatValue(entityData.mile_time)}

    MOVEMENT STANDARDS:
    For each weighted movement, provide:
    1. Exact weight based on client's 1RM percentages
    2. RPE target (1-10 scale)
    3. Rest periods
    4. Movement progression/regression options

    Example format:
    Dumbbell Bench Press
    ♀ RX: 20kg (65% 1RM) @ RPE 7-8
    ♂ RX: 30kg (65% 1RM) @ RPE 7-8
    Rest: 90s between sets
    Progression: Increase weight by 2.5kg when RPE drops below 7
    Regression: Reduce weight by 10% if unable to maintain form

    You are currently generating Week ${weekNumber} of ${totalWeeks}. Each workout should include clear RX and scaled options, with specific weights and RPE for both men and women. Consider the previous weeks' workouts for proper progression and variation.
  `

  const userContent = `
    PROGRAM DETAILS:
    - Duration: ${totalWeeks} weeks
    - Workouts per Week: ${entityData.programSchedule?.schedule.length}
    
    INSTRUCTIONS:
    1. Generate Week ${weekNumber} of ${totalWeeks}. Current week dates: ${weekStartDate.toISOString().split('T')[0]} to ${weekEndDate.toISOString().split('T')[0]}
    2. Each day must be written out completely, with no summarizing
    3. Include date, title, focus areas, and ${entityData.workoutFormat?.instructions || 'a warmup, strength, metcon, and cooldown section with specific movements and sets/reps'}
    4. Account for equipment availability, injuries, and skill levels
    5. Each workout must follow this exact format:

    [Workout Title]
    
    [Brief description of the workout]

    [Main workout format, e.g., "3 rounds for time of:"]
    [List movements and reps]

    [Any special instructions for movement setup]

    ♀ [Women's RX weights/heights/etc]
    ♂ [Men's RX weights/heights/etc]

    Stimulus and Strategy:
    [Detailed explanation of the intended stimulus and strategies for success]
    
    RX:
    [Full workout description with modified movements/weights]
    ♀ [Women's intermediate weights/heights/etc]
    ♂ [Men's intermediate weights/heights/etc]
    
    Scaling:
    [General scaling principles and modifications]
    [Movement-specific scaling options for different limitations]
    [Injury considerations and substitutions]


    Coaching cues:
    [2-3 specific coaching points for key movements]
    [Pacing guidance if applicable]
    
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
    
    Create detailed workouts following the exact format above for Week ${weekNumber}, ensuring proper progression from previous weeks.
  `

  // Log prompt size
  console.log(`Prompt size (characters): ${prompt.length}`)
  console.log(`User content size (characters): ${userContent.length}`)
  
  const promptTokenEstimate = Math.ceil(prompt.length / 4)
  const userContentTokenEstimate = Math.ceil(userContent.length / 4)
  console.log(`Estimated Prompt Tokens: ${promptTokenEstimate}`)
  console.log(`Estimated User Content Tokens: ${userContentTokenEstimate}`)

  const chatResponse = await fetchWithRetry('https://api.openai.com/v1/chat/completions', {
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
          content: prompt
        },
        {
          role: 'user',
          content: userContent
        }
      ],
      temperature: 0.7,
      stream: true
    })
  })

  // Log response status
  console.log(`OpenAI Chat API response status: ${chatResponse.status}`)

  if (!chatResponse.ok) {
    const errorText = await chatResponse.text()
    console.error(`OpenAI Chat API error: ${errorText}`)
    throw new Error(`OpenAI Chat API error: ${errorText}`)
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
            // Log each chunk's content length
            console.log(`Received chunk (characters): ${content.length}`)
            yield content
          }
        } catch (e) {
          if (data && data !== '[DONE]') {
            console.log(`Received non-JSON data: ${data.length} characters`)
            yield data
          }
          continue
        }
      }
    }
  }

  if (buffer) {
    console.log(`Remaining buffer (characters): ${buffer.length}`)
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

    // Validation of required fields
    const requiredFields = [
      'clientMetrics.gender',
      'height_cm',
      'weight_kg',
      'bench_1rm',
      'squat_1rm',
      'deadlift_1rm',
      'programSchedule',
      'programSchedule.startDate',
      'programSchedule.duration_weeks',
      'programSchedule.schedule',
      'programSchedule.sessionDuration',
      'workoutFormat',
      'workoutFormat.format',
      'workoutFormat.focus',
      'gymDetails',
      'gymDetails.equipment'
    ]

    for (const field of requiredFields) {
      const keys = field.split('.')
      let value = entityData
      for (const key of keys) {
        if (!value || !value.hasOwnProperty(key)) {
          throw new Error(`Missing required field: ${field}`)
        }
        value = value[key]
      }
      
      // Additional validation for gender
      if (field === 'clientMetrics.gender' && !value) {
        throw new Error('Gender field cannot be empty')
      }
    }

    // Get similar workouts context first
    const queryText = `
      Program: ${entityData.programOverview?.name || 'Unnamed Program'}
      Description: ${entityData.programOverview?.description || 'No description provided'}
      Training Styles: ${formatValue(entityData.workoutFormat?.format)}
      Focus Areas: ${formatValue(entityData.workoutFormat?.focus)}
      Equipment: ${entityData.gymDetails?.equipment || 'Standard Gym'}
    `.trim()

    // Log query text size
    console.log(`Embedding query text size (characters): ${queryText.length}`)
    const embeddingTokenEstimate = Math.ceil(queryText.length / 4)
    console.log(`Estimated Embedding Tokens: ${embeddingTokenEstimate}`)

    const embeddingResponse = await fetchWithRetry('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'text-embedding-ada-002', // Updated embedding model
        input: queryText
      })
    })

    // Log embedding response status
    console.log(`OpenAI Embedding API response status: ${embeddingResponse.status}`)

    if (!embeddingResponse.ok) {
      const errorText = await embeddingResponse.text()
      console.error(`OpenAI Embedding API error: ${errorText}`)
      throw new Error(`OpenAI Embedding API error: ${errorText}`)
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

    // Log similar workouts context size
    console.log(`Similar workouts context size (characters): ${similarWorkoutsContext.length}`)

    // Set up streaming response
    const stream = new TransformStream()
    const writer = stream.writable.getWriter()
    const encoder = new TextEncoder()

    // Process weeks in the background
    const processWeeks = async () => {
      try {
        const totalWeeks = Math.min(6, entityData.programSchedule.duration_weeks || 6) // Ensure at least 6 weeks
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
            
            // Summarize the current week's content
            const summarized = summarizePreviousWeeks(`--- Week ${week} ---\n${weekContent}\n--- End of Week ${week} ---`)
            previousWeeks += `\n\nWEEK ${week}:\n${summarized}`
            
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
