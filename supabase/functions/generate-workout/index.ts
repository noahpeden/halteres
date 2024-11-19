import { OpenAIStream, StreamingTextResponse } from 'https://esm.sh/ai'
import OpenAI from 'https://esm.sh/openai@4.26.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY')
})

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { entityData } = await req.json()
    
    if (!entityData) {
      throw new Error('No entity data provided')
    }

    console.log('Received entity data:', JSON.stringify(entityData, null, 2))

    // Create an embedding for the query
    const queryText = `
      Program: ${entityData.programName}
      Focus: ${entityData.workoutFormat.focus}
      Format: ${entityData.workoutFormat.format.join(', ')}
      Equipment: ${entityData.gymDetails.type}
      Movements: ${entityData.workoutFormat.quirks}
    `.trim()

    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-large',
      input: queryText,
      dimensions: 1024
    })

    // Split the embedding into two parts
    const embedding = embeddingResponse.data[0].embedding
    const embeddingPart1 = embedding.slice(0, 512)
    const embeddingPart2 = embedding.slice(512)

    // Find similar workouts
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

    // Format similar workouts as context
    const similarWorkoutsContext = similarWorkouts && similarWorkouts.length > 0
      ? `Here are some similar workouts to use as references:
        ${similarWorkouts.map(workout => `
          ${workout.title}:
          ${workout.body}
        `).join('\n\n')}`
      : 'No similar workouts found for reference.'

    console.log('Similar workouts:', similarWorkoutsContext)

    // Construct the messages array for the chat completion
    const messages = [
      {
        role: 'system',
        content: `You are a professional fitness coach creating personalized workout programs with a functional fitness focus.

        Similar Reference Workouts:
        ${similarWorkoutsContext}

        Create a detailed workout program based on the following parameters:
        - Program Name: ${entityData.programName}
        - Total Days in Program: ${entityData.sessionDetails.totalWorkouts}
        - Session Length: ${entityData.sessionDetails.length}
        - Schedule: ${entityData.sessionDetails.schedule} (only generate workouts on these days)
        - Start Date: ${entityData.sessionDetails.startDate}
        - End Date: ${entityData.sessionDetails.endDate}
        - Gym Type: ${entityData.gymDetails.type}
        - Equipment Restrictions: ${entityData.gymDetails.unavailableEquipment.join(', ')}
        - Excluded Movements: ${entityData.gymDetails.excludedMovements.join(', ')}
        - Workout Format: ${entityData.workoutFormat.format.join(', ')}
        - Program Focus: ${entityData.workoutFormat.focus}
        - Special Requirements: ${entityData.workoutFormat.quirks}
        - Priority Workout: ${entityData.workoutFormat.priorityWorkout}

As a knowledgeable functional fitness-focused personal trainer, create a comprehensive program tailored to a client. Write workouts for each day required in the program length, ensuring each day’s workout aligns with the schedule (${entityData.sessionDetails.schedule}). Provide the exact number of days in the workout program based on the total workout days calculated: ${entityData.sessionDetails.totalWorkouts}.

Each workout should follow this structure:

1. **Title**: Provide a unique, engaging title for each workout.

2. **Body**: 
   - RX: Include the main workout with specific weights and movements with options, percentages, and RPE for male and female.
   - Scaled: Offer a scaled version with adjusted weights and movement modifications.
   - RX+: Include a more challenging version for advanced athletes.

3. **Coaching Strategy**:
   - **Time Frame**: Break down the class structure (e.g., Intro, Warmup, Strength, Workout, Cooldown, Mobility or ${entityData.workoutFormat}).
   - **Target Score**: Include target times and time caps for the workout.
   - **Stimulus and Goals**: Describe the intended stimulus and overall goals of the workout.

4. **Workout Strategy & Flow**:
   - For each movement, provide detailed strategies including:
     • Form cues
     • Pacing advice
     • Common faults to avoid
     • Specific weights for male and female athletes
   - Include coach's notes and suggestions for each strength and conditioning component.

5. **Scaling**:
   - Explain the scaling aim.
   - Provide specific scaling options for each movement and lift.
   - Provide specific options for RX+, RX, Scaled, Limited Equipment, and Large Class scenarios.

### Key points:
- Create exactly ${entityData.sessionDetails.totalWorkouts} unique workouts based on the specified schedule. Each workout day should follow the sequence of dates, starting from ${entityData.sessionDetails.startDate} and ending on ${entityData.sessionDetails.endDate}.
- Ensure each day’s workout is unique. If any exercises are repeated across days, explain the rationale and include adjustments (e.g., load, volume, intensity).
- Each week builds on the previous week's progress.
- Include a variety of movements and time domains.
- Integrate benchmark workouts and retests to track progress at the start and end of the program.
- Use RPE (Rate of Perceived Exertion) scales to guide intensity levels as well as percentages of max lifts.
- DO NOT USE ANY EQUIPMENT THAT IS NOT AVAILABLE in ${entityData.gymDetails.unavailableEquipment.join(', ')}.
- Incorporate client preferences and specific movements noted in ${entityData.workoutFormat.quirks}.

**Example Format**:
Title: "Godzilla"
Body:
RX
3 Rounds For Time:
1 Legless Rope Climb (15 ft)
2 Squat Snatches (225/145 lb)
3 Back Squats (365/245 lb)
4 Deficit Handstand Push-Ups (13/9 in)

Scaled
3 Rounds For Time:
1 Rope Climb using legs (15 ft)
2 Squat Snatches (155/105 lb)
3 Back Squats (225/145 lb)
4 Handstand Push-Ups

RX+
3 Rounds For Time:
1 Legless Rope Climb (20 ft)
2 Squat Snatches (245/165 lb)
3 Back Squats (405/275 lb)
4 Deficit Handstand Push-Ups (16/12 in)

**Strategy**:
- Time Frame: 
   Intro: 0:00 - 3:00
   Warmup: 3:00 - 15:00
   Skill Work: 15:00 - 25:00 (Rope Climb and HSPU Specific Prep)
   Strength Prep: 25:00 - 34:00
   Workout: 34:00 - 54:00
   Cleanup/Cooldown: 54:00 - 57:00
   Mobility: 57:00 - 60:00

**Scaling**:
   * Aim to maintain movement integrity while meeting the target time. Specify adjustments for RX+, RX, Scaled, Limited Equipment, and Large Class setups.` 
      }
    ]

    // Create the chat completion with streaming
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      temperature: 0.7,
      stream: true
    })

    // Create a streaming response
    const stream = OpenAIStream(completion)
    return new StreamingTextResponse(stream, { headers: corsHeaders })

  } catch (error) {
    console.error('Error:', error)
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
