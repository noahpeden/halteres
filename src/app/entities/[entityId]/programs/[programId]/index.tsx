import React, { useEffect, useState } from 'react'
import { View, ScrollView, Text, TouchableOpacity } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useAuth } from 'src/contexts/AuthContext'
import Button from 'src/app/ui/Button'
import SessionDetails from 'src/app/entities/SessionDetails'
import ProgramGeneration from 'src/app/entities/ProgramGeneration'
import ProgramOverview from 'src/app/entities/ProgramOverview'
import WorkoutFormat from 'src/app/entities/WorkoutFormat'
import GymDetails from 'src/app/entities/GymDetails'

const testProgram = {
  sessionDetails: {
    sessionsPerWeek: '4',
    sessionDuration: '60',
    totalWorkouts: 16,
    schedule: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    length: '60 minutes',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString()
  },
  programOverview: {
    name: 'Test Strength Program',
    description: 'A 4-week strength program focusing on compound movements and progressive overload.'
  },
  workoutFormat: {
    format: ['Strength', 'Hypertrophy'], // Now properly an array
    instructions: 'Focus on compound movements with progressive overload',
    focus: 'Strength and Muscle Building',
    quirks: 'Emphasize proper form and tempo',
    priorityWorkout: 'Strength training'
  },
  gymDetails: {
    equipment: 'Barbells, Dumbbells, Squat Rack, Bench, Kettlebells',
    spaceDescription: 'Full commercial gym setup',
    type: 'Commercial Gym',
    unavailableEquipment: [],
    excludedMovements: []
  }
}

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
      router.push(`/entities/${entityId}`)
    }
  }

  // Function to populate test data
  const populateTestData = () => {
    setProgram(testProgram)
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
            {/* Debug button for populating test data */}
            {__DEV__ && (
              <TouchableOpacity onPress={populateTestData} className="bg-purple-500 p-2 rounded-md mb-4">
                <Text className="text-white text-center">Populate Test Data</Text>
              </TouchableOpacity>
            )}
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
            <ProgramGeneration programData={program} setLoading={setLoading} loading={loading} />
            <Button variant="primary" size="large" onPress={saveProgram}>
              Save Program
            </Button>
          </>
        )}
      </ScrollView>
    </View>
  )
}
