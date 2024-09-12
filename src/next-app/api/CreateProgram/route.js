import { createClient } from '../../../utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const body = await req.json()
    const { name, userId } = body

    const supabase = createClient()

    const { data, error } = await supabase
      .from('programs')
      .insert([
        {
          name,
          user_id: userId
        }
      ])
      .select('*')
    if (error) throw error
    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
