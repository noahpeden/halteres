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
        content: `You are a professional fitness coach creating workout programs. 
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

          Format your response exactly like this:
          Title: [Program Name]
          
          Body:
          [Detailed workout description]
          
          Strategy:
          [How to approach the workout]
          
          Scaling:
          [Scaling options for different fitness levels]`
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