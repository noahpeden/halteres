import { OpenAIStream, StreamingTextResponse } from 'https://esm.sh/ai'
import OpenAI from 'https://esm.sh/openai@4.26.0'

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY')
})

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

    // Construct the messages array for the chat completion
    const messages = [
      {
        role: 'system',
        content: `You are a professional fitness coach creating personalized workout programs with functional fitness focus. 
          Create detailed workout programs based on the following parameters:
          - Program Name: ${entityData.programName}
          - Session Length: ${entityData.sessionDetails.length}
          - Schedule: ${entityData.sessionDetails.schedule}
          - Gym Type: ${entityData.gymDetails.type}
          - Equipment Restrictions: ${entityData.gymDetails.unavailableEquipment.join(', ')}
          - Excluded Movements: ${entityData.gymDetails.excludedMovements.join(', ')}
          - Workout Format: ${entityData.workoutFormat.format.join(', ')}
          - Program Focus: ${entityData.workoutFormat.focus}
          - Special Requirements: ${entityData.workoutFormat.quirks}
          - Priority Workout: ${entityData.workoutFormat.priorityWorkout}

As a knowledgeable functional fitness focused personal trainer, create a comprehensive ${entityData.sessionDetails.length}-day workout plan tailored to a client. Follow this structure exactly for each day's workout:

  Start with a detailed Intro to the entire program of workouts, including what the focus is (${entityData.workoutFormat.focus}), the length of the program (${entityData.sessionDetails.length}), and the intended outcomes for the client.

  1. Title: Create a unique, engaging title for each workout.

  2. Body: 
    - RX: Provide the main workout with specific weights and movements with options, percentages, and RPE for male and female.
    - Scaled: Offer a scaled version with adjusted weights and movement modifications.
    - RX+: Include a more challenging version for advanced athletes.

  3. Coaching Strategy:
    a. Time Frame: Break down the class structure (e.g., Intro, Warmup, Strength, Workout, Cooldown, Mobility or ${entityData.workoutFormat}).
    b. Target Score: Include target times and time caps for the workout.
    c. Stimulus and Goals: Describe the intended stimulus and overall goals of the workout.

  4. Workout Strategy & Flow:
    - For each movement, provide detailed strategies including:
      • Form cues
      • Pacing advice
      • Common faults to avoid
      • Specific weights for male and female athletes
    - Include coach's notes and suggestions for each strength and conditioning component.

  5. Scaling:
    - Explain the scaling aim
    - Provide specific options for RX+, RX, Scaled, Limited Equipment, and Large Class scenarios

  Key points to remember:
  - Each week builds on the previous week's progress.
  - Make sure there is variety in movements and time domains.
  - Include benchmark workouts and retests to track progress at the beginning and end of the program.
  - Integrate the provided template workout and/or internal workouts as primary influences.
  - Infer the amount of workouts you need to generate by looking at the dates provided in ${entityData.sessionDetails.length}.
  - Use the matched external workouts as references to inform your programming.
  - Include specific stretches and cool-down movements if requested in the workout format.
  - Ensure each day's workout is unique and specific, avoiding repetitions or generic instructions.
  - Use RPE (Rate of Perceived Exertion) scales to guide intensity levels as well as percentages of max lifts.
  - DO NOT USE ANY EQUIPMENT THAT IS NOT INCLUDED IN ${entityData.gymDetails.unavailableEquipment.join(', ')}.
  - If the user has requested specific movements or types of workouts, incorporate those preferences into the program.
  - If has said in ${entityData.workoutFormat.quirks} that there are any quirks or special features of the gym, make sure to take those into account in the program creation.

  Your goal is to create a high-quality, personalized workout program that matches or exceeds the detail and specificity of professionally curated functional fitness workouts.

  Make sure to structure it like the following:
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

  Strategy:

  Time Frame
  Intro: 0:00 - 3:00
  Warmup: 3:00 - 15:00
  Skill Work: 15:00 - 25:00 (Rope Climb and HSPU Specific Prep)
  Strength Prep: 25:00 - 34:00
  Workout: 34:00 - 54:00
  Cleanup/Cooldown: 54:00 - 57:00
  Mobility: 57:00 - 60:00

  TARGET SCORE

  * Target time: 14-16 minutes
  * Time cap: 20 minutes
  * Large Class Target Time: 16-18 minutes
  * Large Class Time Cap: 23 minutes

  STIMULUS and GOALS
  * Stimulus is high-intensity with a strong emphasis on strength endurance and skilled gymnastics. Each round should be approached with strategy and precision.
  * Main goal is to maintain efficiency and approachability on heavy lifts while tackling the gymnastic elements methodically to avoid fatigue-induced errors.

  WORKOUT STRATEGY & FLOW
  * Legless Rope Climb: Focus on using a strong, efficient pulling technique. Pinch the rope between your legs to help hold positions and avoid slipping. Common faults include relying solely on upper body strength without engaging legs efficiently, which can lead to early fatigue.
  * Squat Snatches: This will be the heaviest portion of the workout. Make sure to set up with a strong base and use hook grip. Maintain a straight bar path, keep chest up, and ensure you pull yourself under the bar quickly. Common faults are early arm bend and not getting full hip extension. Single reps with ample rest in between will be strategic for most athletes.
  * Back Squats: Set up quickly but with composure, ensuring safety with the heavy load. Engage core fully before descending to maintain a strong lumbar position. Breathing technique (inhale at the top, exhale at the top) will assist with maintaining tension. Common faults include collapsing chest and not hitting depth due to fatigue.
  * Deficit Handstand Push-Ups: Keep core tight and maintain a vertical line to prevent over-strain on shoulders. Lower under control and use forceful extension to break the deficit. Common faults include losing midline stability and over-arching the back. Breaking reps early into manageable sets will help avoid reaching muscle failure.
  * Coaches: Encourage athletes to fasten their belts correctly for the squats, use magnesium for better grip during rope climbs, and set up the HSPU stations properly. Monitor closely for form degradation due to fatigue.

  SCALING
  * The Scaling aim is for athletes to maintain the integrity of the movements while completing within the target time.

      * RX+ (Competitor):
      3 RFT:
      1 Legless Rope Climb (20 ft)
      2 Squat Snatches (245/165 lb)
      3 Back Squats (405/275 lb)
      4 Deficit Handstand Push-Ups (16/12 in)
      (KG conv: 111/74.5, 184/125, 435/216)

      * RX:
      3 RFT:
      1 Legless Rope Climb (15 ft)
      2 Squat Snatches (225/145 lb)
      3 Back Squats (365/245 lb)
      4 Deficit Handstand Push-Ups (13/9 in)
      (KG conv: 102/66, 166/111, 295/191)

      * Scaled:
      3 RFT:
      1 Rope Climb using legs (15 ft)
      2 Squat Snatches (155/105 lb)
      3 Back Squats (225/145 lb)
      4 Handstand Push-Ups (no deficit)
      (KG conv: 70/47, 102/66)

      * Limited Equipment or Beginner:
      3 RFT:
      6 Strict Pull-Ups
      6 Overhead Squats (light)
      6 Back Squats (light)
      6 Pike Push-Ups

      * Large Class:
      Teams of 2:
      3 RFT:
      2 Legless Rope Climbs
      4 Squat Snatches (245/165 lb)
      6 Back Squats (405/275 lb)
      8 Deficit Handstand Push-Ups (16/12 in)
      (KG conv: 111/74.5, 184/125, 435/216)
      One partner works at a time, sharing the reps equally.
      `
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