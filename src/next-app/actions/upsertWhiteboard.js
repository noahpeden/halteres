'use server'
import { createClient } from '../../utils/supabase/server'

const supabase = createClient()

export const upsertWhiteboard = async (whiteboardDetails) => {
  const { workoutFormat, personalization, programLength, focus, exampleWorkout, programId, userId, internalWorkoutName } = whiteboardDetails

  const { data, error } = await supabase.from('whiteboard').upsert(
    {
      workout_format: workoutFormat,
      personalization: personalization,
      cycle_length: programLength,
      focus: focus,
      references: exampleWorkout,
      program_id: programId,
      user_id: userId,
      internal_workout: internalWorkoutName
    },
    {
      onConflict: ['program_id']
    }
  )

  if (error) {
    console.error('Error upserting whiteboard:', error)
    throw new Error('Error upserting whiteboard')
  }

  return data
}
