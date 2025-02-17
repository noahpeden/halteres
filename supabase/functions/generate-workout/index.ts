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

export const handleCORS = (cb: (req: any) => Promise<Response>) => {
  return async (req) => {
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders })
    }

    const response = await cb(req);
    Object.entries(corsHeaders).forEach(([header, value]) => {
      response.headers.set(header, value);
    });

    return response;
  }
};

const formatValue = (value: any): string => {
  if (Array.isArray(value)) {
    return value.join(', ')
  }
  if (typeof value === 'string') {
    return value
  }
  return String(value || '')
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
  entityData: Record<string, any>,
  previousWeeks: string,
  similarWorkoutsContext: string
) {
  const weekStartDate = new Date(entityData.programSchedule.startDate)
  weekStartDate.setDate(weekStartDate.getDate() + (weekNumber - 1) * 7)
  
  const weekEndDate = new Date(weekStartDate)
  weekEndDate.setDate(weekEndDate.getDate() + 6)

  const workoutsPerWeek = entityData.programSchedule.schedule.length
  const workoutDays = entityData.programSchedule.schedule

  const prompt = `
    You are a professional fitness coach creating detailed, personalized workout programs based on the client's metrics, program overview, available equipment, restricted movements,and workout format.
    You MUST generate EXACTLY ${workoutsPerWeek} workouts for this week (Week ${weekNumber}).
    
    STRICT OUTPUT REQUIREMENTS:
    1. Generate exactly ${workoutsPerWeek} separate workouts
    2. Each workout must be for one of these days: ${workoutDays.join(', ')}
    3. Each workout must be complete with no placeholders or summaries
    4. Each workout must follow the exact format specified below
    5. Do not skip any days or combine workouts

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
    RX: 30kg (65% 1RM) @ RPE 7-8
    Rest: 90s between sets
    Progression: Increase weight by 2.5kg when RPE drops below 7
    Regression: Reduce weight by 10% if unable to maintain form

    You are currently generating Week ${weekNumber} of ${totalWeeks}. Each workout should include clear RX and scaled options, with specific weights and RPE for both men and women. Consider the previous weeks' workouts for proper progression and variation.
  `

  const userContent = `
    STRICT PROGRAM REQUIREMENTS:
    1. Week Number: ${weekNumber} of ${totalWeeks}
    2. Exact Number of Workouts Needed: ${workoutsPerWeek}
    3. Workout Days: ${workoutDays.join(', ')}
    4. Week Date Range: ${weekStartDate.toISOString().split('T')[0]} to ${weekEndDate.toISOString().split('T')[0]}
    5. Session Duration: ${entityData.programSchedule?.sessionDuration} minutes per workout

    PROGRAM DETAILS:
    - Program Name: ${entityData.programOverview?.name || 'Unnamed Program'}
    - Program Description: Generate a brief description and overview of the program focusing on how the program will focus on ${entityData.workoutFormat?.focus} and ${entityData.workoutFormat?.format}.
    - Duration: ${totalWeeks} weeks with starting date: ${entityData.programSchedule?.startDate} and ending date: ${entityData.programSchedule?.endDate}
    - Workouts per Week: ${entityData.programSchedule?.schedule.length}
    
    INSTRUCTIONS:
    1. Generate Week ${weekNumber} of ${totalWeeks}. Current week dates: ${weekStartDate.toISOString().split('T')[0]} to ${weekEndDate.toISOString().split('T')[0]}
    2. Each day must be written out completely, with no summarizing
    3. Include date, title, focus areas, and ${entityData.workoutFormat?.instructions || 'a warmup, strength, metcon, and cooldown section with specific movements and sets/reps'}
    4. Account for equipment availability, injuries, and skill levels
    5. Each workout must follow this exact format:

    [Day of Week] - [Date]
    [Workout Title]
    
    Focus Areas: [List specific focus areas and brief description of the workout]

    Description: [Brief description]

    
    Coach's Notes:
    - Target: [Brief description of intended stimulus and goal of workout]
    - Strategy: [Key points for success and pacing guidance]
    - Rx Weights: Based on ${entityData.clientMetrics.gender}'s metrics (Bench: ${entityData.bench_1rm}kg, Squat: ${entityData.squat_1rm}kg, DL: ${entityData.deadlift_1rm}kg)
    - Scaling Options: [Movement substitutions and weight/rep modifications]
    
    Workout Breakdown (${entityData.programSchedule?.sessionDuration} min total):
    
    1. Warmup (${Math.round(entityData.programSchedule?.sessionDuration * 0.15)} min):
    [Specific warmup movements and mobility work]
    
    2. Main Work (${Math.round(entityData.programSchedule?.sessionDuration * 0.7)} min):
    [Detailed workout with movements, loads, sets/reps]
    [Include RPE targets and rest periods]
    
    3. Cooldown (${Math.round(entityData.programSchedule?.sessionDuration * 0.15)} min):
    [Specific cooldown and recovery work]

    YOU MUST GENERATE ALL ${workoutsPerWeek} WORKOUTS FOR THIS WEEK BEFORE MOVING TO THE NEXT WEEK.
    
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
      model: 'o3-mini',
      messages: [
        {
          role: 'developer',
          content: 'Formatting re-enabled\n' + prompt  // Enable markdown formatting
        },
        {
          role: 'user',
          content: userContent
        }
      ],
      reasoning_effort: 'high',  // Since we want detailed, accurate workouts
      stream: true,
      store: true  // Enable storing for potential future reference
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

// Update the workout detection logic to be more precise
const countWorkouts = (content: string): number => {
  // Look for complete workout sections that start with a day and date
  const workoutPattern = /\[Day of Week\]/g
  const matches = content.match(workoutPattern) || []
  return matches.length
}

const processWeeks = async (stream: TransformStream, entityData: Record<string, any>, similarWorkoutsContext: string) => {
  const writer = stream.writable.getWriter()
  const encoder = new TextEncoder()
  
  try {
    const totalWeeks = entityData.programSchedule.duration_weeks
    if (!totalWeeks || totalWeeks <= 0) {
      throw new Error('Invalid duration_weeks specified')
    }
    
    // Send initial message to confirm stream is working
    await writer.write(encoder.encode(`data: {"type":"start"}\n\n`))
    
    console.log(`=== Starting Program Generation ===`)
    console.log(`Total Weeks: ${totalWeeks}`)
    console.log(`Workouts per Week: ${entityData.programSchedule.schedule.length}`)
    console.log(`Schedule: ${entityData.programSchedule.schedule.join(', ')}`)
    console.log(`Session Duration: ${entityData.programSchedule?.sessionDuration} minutes`)
    
    let previousWeeks = ''
    
    for (let week = 1; week <= totalWeeks; week++) {
      try {
        console.log(`\n=== Processing Week ${week}/${totalWeeks} ===`)
        console.log(`Previous weeks context length: ${previousWeeks.length} characters`)
        
        await writer.write(encoder.encode(`data: {"type":"progress","week":${week},"totalWeeks":${totalWeeks}}\n\n`))
        
        let retryCount = 0
        let weekComplete = false
        let weekContent = ''

        while (!weekComplete && retryCount < 3) {
          try {
            let workoutCount = 0
            weekContent = ''
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
                
                // Stream the content to the client immediately
                await writer.write(encoder.encode(`data: {"type":"content","text":${JSON.stringify(chunk)}}\n\n`))
                
                // Count workouts based on complete content
                const newWorkoutCount = countWorkouts(weekContent)
                if (newWorkoutCount > workoutCount) {
                  workoutCount = newWorkoutCount
                  await writer.write(
                    encoder.encode(
                      `data: {"type":"workoutProgress","week":${week},"workout":${workoutCount},"totalWorkouts":${entityData.programSchedule.schedule.length}}\n\n`
                    )
                  )
                  console.log(`Week ${week}: Generated workout ${workoutCount}/${entityData.programSchedule.schedule.length}`)
                }
              }
            }

            // Verify week completion
            if (workoutCount === entityData.programSchedule.schedule.length) {
              weekComplete = true
              previousWeeks += `\n\nWEEK ${week}:\n${weekContent}\n--- End of Week ${week} ---\n`
              console.log(`✅ Week ${week} complete with ${workoutCount} workouts`)
            } else {
              console.warn(`⚠️ Week ${week} incomplete - only generated ${workoutCount}/${entityData.programSchedule.schedule.length} workouts`)
              retryCount++
              await new Promise(res => setTimeout(res, 1000))
            }
          } catch (weekAttemptError) {
            console.error(`❌ Attempt ${retryCount + 1} failed for week ${week}:`, weekAttemptError)
            retryCount++
          }
        }

        if (!weekComplete) {
          throw new Error(`Failed to generate complete week ${week} after ${retryCount} attempts`)
        }

        // After processing each week
        console.log(`Week ${week} completion status:`)
        console.log(`- Generated workouts: ${countWorkouts(weekContent)}/${entityData.programSchedule.schedule.length}`)
        console.log(`- Week content length: ${weekContent.length} characters`)
        
        await writer.write(encoder.encode(`data: {"type":"weekComplete","week":${week}}\n\n`))
      } catch (weekError) {
        console.error(`❌ Error in Week ${week}:`, weekError)
        await writer.write(
          encoder.encode(`data: {"type":"error","week":${week},"message":"${weekError.message}"}\n\n`)
        )
        throw weekError; // Re-throw to stop processing
      }
    }
    
    console.log(`\n=== Program Generation Complete ===`)
    await writer.write(encoder.encode('data: {"type":"complete"}\n\n'))
  } catch (error) {
    console.error(`❌ Fatal error in program generation:`, error)
    await writer.write(
      encoder.encode(`data: {"type":"error","message":"${error.message}"}\n\n`)
    )
  } finally {
    try {
      await writer.write(encoder.encode('data: [DONE]\n\n'))
      await writer.close()
    } catch (e) {
      console.error('Error closing writer:', e)
    }
  }
}

Deno.serve(handleCORS(async (req) => {
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
        if (!value || !Object.prototype.hasOwnProperty.call(value, key)) {
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

    // Start processing in the background
    processWeeks(stream, entityData, similarWorkoutsContext).catch(error => {
      console.error('Process weeks error:', error)
    })

    // Return the stream immediately
    return new Response(stream.readable, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    })
  } catch (error) {
    console.error('Request handling error:', error)
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
}))
