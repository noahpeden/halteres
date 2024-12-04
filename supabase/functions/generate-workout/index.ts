import { createOpenAI } from 'https://esm.sh/@ai-sdk/openai@latest';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const openai = createOpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY'),
});

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const formatValue = (value: any): string => {
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  if (typeof value === 'string') {
    return value;
  }
  return String(value || '');
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (!Deno.env.get('OPENAI_API_KEY')) {
      throw new Error('OpenAI API key is not configured');
    }

    const { entityData } = await req.json();

    if (!entityData) {
      throw new Error('No entity data provided');
    }

    console.log('Received entity data:', JSON.stringify(entityData, null, 2));

    const queryText = `
      Program: ${entityData.programOverview?.name || 'Unnamed Program'}
      Description: ${entityData.programOverview?.description || 'No description provided'}
      Focus: ${entityData.workoutFormat?.instructions || 'General Fitness'}
      Format: ${formatValue(entityData.workoutFormat?.format)}
      Equipment: ${entityData.gymDetails?.equipment || 'Standard Gym'}
      Space: ${entityData.gymDetails?.spaceDescription || 'No space description available'}
    `.trim();

    try {
      // Make a direct fetch call to the OpenAI API for embeddings
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'text-embedding-3-large',
          input: queryText,
          dimensions: 1536,
          encoding_format: 'float',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
      }

      const embeddingResponse = await response.json();
      console.log('Raw embedding response:', JSON.stringify(embeddingResponse, null, 2));

      if (!embeddingResponse.data?.[0]?.embedding) {
        throw new Error('Invalid embedding response structure');
      }

      const embedding = embeddingResponse.data[0].embedding;
      const embeddingPart1 = embedding.slice(0, Math.floor(embedding.length / 2));
      const embeddingPart2 = embedding.slice(Math.floor(embedding.length / 2));

      console.log('Embedding parts created:', {
        part1Length: embeddingPart1.length,
        part2Length: embeddingPart2.length
      });

      // Find similar workouts in Supabase
      const { data: similarWorkouts, error: searchError } = await supabase.rpc(
        'match_similar_workouts',
        {
          query_embedding_1: embeddingPart1,
          query_embedding_2: embeddingPart2,
          match_threshold: 0.8,
          match_count: 3,
        }
      );

      if (searchError) {
        console.error('Error searching workouts:', searchError);
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
        : 'No similar workouts found for reference.';

      // Make a direct fetch call to the OpenAI chat completions API
      const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are a professional fitness coach creating personalized workout programs with a functional fitness focus.

                Similar Reference Workouts:
                ${similarWorkoutsContext}

                Create a detailed workout program based on the following parameters:
                - Program Name: ${entityData.programOverview?.name}
                - Total Days in Program: ${entityData.sessionDetails?.totalWorkouts || 0}
                - Session Length: ${entityData.sessionDetails?.length || 'Unknown'}
                - Schedule: ${formatValue(entityData.sessionDetails?.schedule)}
                - Start Date: ${entityData.sessionDetails?.startDate || 'Unknown'}
                - End Date: ${entityData.sessionDetails?.endDate || 'Unknown'}
                - Gym Type: ${entityData.gymDetails?.type || 'General'}
                - Equipment Restrictions: ${formatValue(entityData.gymDetails?.unavailableEquipment)}
                - Excluded Movements: ${formatValue(entityData.gymDetails?.excludedMovements)}
                - Workout Format: ${formatValue(entityData.workoutFormat?.format)}
                - Program Focus: ${entityData.workoutFormat?.focus || 'General Fitness'}
                - Special Requirements: ${entityData.workoutFormat?.quirks || 'None'}
                - Priority Workout: ${entityData.workoutFormat?.priorityWorkout || 'None'}

                Key points:
                - Ensure workouts align with the specified schedule (${formatValue(entityData.sessionDetails?.schedule)}).
                - Ensure each day's workout is unique.
                - Use only available equipment and respect client restrictions.
                - Include variety, progressions, and benchmarks.`
            }
          ],
          temperature: 0.7,
          stream: true,
        }),
      });

      if (!chatResponse.ok) {
        const errorData = await chatResponse.json();
        throw new Error(`OpenAI Chat API error: ${JSON.stringify(errorData)}`);
      }

      // Return the streaming response with correct headers
      return new Response(chatResponse.body, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });

    } catch (apiError) {
      console.error('API error:', apiError);
      throw apiError;
    }
  } catch (error) {
    console.error('Full error details:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
    
    return new Response(
      JSON.stringify({
        error: 'There was an error processing your request',
        details: error.message,
        stack: error.stack,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});