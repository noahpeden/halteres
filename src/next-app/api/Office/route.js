import { createClient } from '../../../utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const body = await req.json()
    const { openAir, outdoorRunning, quirks, gymName, equipmentList, coachList, classSchedule, classDuration, userId, programId } = body
    const supabase = createClient()

    const { data, error } = await supabase.from('gyms').upsert([
      {
        open_air: openAir,
        outside_running_path: outdoorRunning,
        quirks,
        name: gymName,
        equipment: equipmentList,
        coaches: coachList,
        schedule: classSchedule,
        duration: classDuration,
        user_id: userId,
        program_id: programId
      }
    ])
    if (error) throw error
    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
