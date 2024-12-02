import React, { useEffect, useState } from 'react'
import { View, ScrollView, Text } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useAuth } from 'src/contexts/AuthContext'
import Button from 'src/app/ui/Button'
import SessionDetails from 'src/app/entities/SessionDetails'
import ProgramGeneration from 'src/app/entities/ProgramGeneration'
import ProgramOverview from 'src/app/entities/ProgramOverview'
import WorkoutFormat from 'src/app/entities/WorkoutFormat'
import GymDetails from 'src/app/entities/GymDetails'

export default function Program() {
  const [program, setProgram] = useState({
    sessionDetails: {},
    programOverview: {},
    workoutFormat: {},
    gymDetails: {}
  })
  const [loading, setLoading] = useState(false)
  const { supabase, user } = useAuth()
  const router = useRouter()
  const { entityId, programId } = useLocalSearchParams()

  async function fetchProgramDetails() {
    setLoading(true)
    const { data, error } = await supabase.from('programs').select('*').eq('id', programId).single()

    if (error) {
      console.error('Error fetching program details:', error)
    } else {
      setProgram({
        sessionDetails: data.session_details || {},
        programOverview: data.program_overview || {},
        workoutFormat: data.workout_format || {},
        gymDetails: data.gym_details || {}
      })
    }
    setLoading(false)
  }

  async function saveProgram() {
    const { error } = await supabase
      .from('programs')
      .update({
        session_details: program.sessionDetails,
        program_overview: program.programOverview,
        workout_format: program.workoutFormat,
        gym_details: program.gymDetails
      })
      .eq('id', programId)

    if (error) {
      console.error('Error saving program:', error)
    } else {
      console.log('Program saved successfully')
      router.push(`/entities/${entityId}`) // Navigate back to the entity page
    }
  }

  useEffect(() => {
    if (user?.id && programId) {
      fetchProgramDetails()
    }
  }, [user?.id, programId])

  return (
    <View className="flex-1 bg-background p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-500">Loading program...</Text>
          </View>
        ) : (
          <>
            <ProgramOverview
              data={program.programOverview}
              onChange={(updatedOverview) => setProgram((prev) => ({ ...prev, programOverview: updatedOverview }))}
            />
            <SessionDetails
              data={program.sessionDetails}
              onChange={(updatedSessionDetails) => setProgram((prev) => ({ ...prev, sessionDetails: updatedSessionDetails }))}
            />
            <WorkoutFormat
              data={program.workoutFormat}
              onChange={(updatedWorkoutFormat) => setProgram((prev) => ({ ...prev, workoutFormat: updatedWorkoutFormat }))}
            />
            <GymDetails
              data={program.gymDetails}
              onChange={(updatedGymDetails) => setProgram((prev) => ({ ...prev, gymDetails: updatedGymDetails }))}
            />
            <ProgramGeneration
              programData={program}
              onGenerate={(generatedProgram) => {
                console.log('Generated Program:', generatedProgram)
                setProgram((prev) => ({ ...prev, programOverview: generatedProgram }))
              }}
            />
          </>
        )}
      </ScrollView>
    </View>
  )
}
