import { createClient } from '../../../utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const body = await req.json()
    const { personalization, programLength, workoutFormat, focus, exampleWorkout, programId, userId } = body

    const supabase = createClient()

    const { data, error } = await supabase.from('whiteboard').upsert([
      {
        personalization,
        workout_format: workoutFormat,
        cycle_length: programLength,
        focus,
        references: exampleWorkout,
        program_id: programId,
        user_id: userId
      }
    ])
    console.log(error)
    if (error) throw error
    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
