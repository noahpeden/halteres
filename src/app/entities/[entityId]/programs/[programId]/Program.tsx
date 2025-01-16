import React, { useEffect, useState } from 'react'
import { View, ScrollView, Text, SafeAreaView } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useAuth } from 'src/contexts/AuthContext'
import Button from 'src/app/components/ui/Button'
import ProgramSchedule from 'src/app/components/ProgramSchedule'
import ProgramGeneration from 'src/app/components/ProgramGeneration'
import ProgramOverview from 'src/app/components/ProgramOverview'
import WorkoutFormat from 'src/app/components/WorkoutFormat'
import GymDetails from 'src/app/components/GymDetails'
import CollapsibleSection from 'src/app/components/ui/CollapsibleSection'

export default function Program() {
  const [program, setProgram] = useState({
    programSchedule: {
      startDate: '',
      endDate: '',
      schedule: [],
      sessionDuration: '',
      duration_weeks: 0
    },
    programOverview: {
      name: '',
      description: ''
    },
    workoutFormat: {
      format: [],
      focus: [],
      instructions: '',
      quirks: '',
      customFocus: [],
      customFormats: []
    },
    gymDetails: {
      equipment: '',
      spaceDescription: ''
    },
    generatedProgram: '',
    name: '',
    description: '',
    duration_weeks: 0,
    focus_area: '',
    entity_id: ''
  })

  const [loading, setLoading] = useState(false)
  const { supabase, user } = useAuth()
  const router = useRouter()
  const { entityId, programId } = useLocalSearchParams()
  console.log('Component params:', { entityId, programId })

  async function fetchProgramDetails() {
    if (!programId) return

    setLoading(true)
    try {
      const { data, error } = await supabase.from('programs').select('*').eq('id', programId).single()

      if (error) throw error
      if (!data) return

      // Parse focus area if it's a string
      let parsedFocusArea = []
      try {
        if (typeof data.focus_area === 'string') {
          parsedFocusArea = JSON.parse(data.focus_area)
        } else if (Array.isArray(data.focus_area)) {
          parsedFocusArea = data.focus_area
        }
      } catch (e) {
        console.warn('Error parsing focus area:', e)
      }

      setProgram({
        programSchedule: {
          startDate: data.session_details?.startDate || '',
          endDate: data.session_details?.endDate || '',
          schedule: data.session_details?.schedule || [],
          sessionDuration: data.session_details?.sessionDuration || '',
          duration_weeks: data.duration_weeks || 0
        },
        programOverview: {
          name: data.program_overview?.name || data.name || '',
          description: data.program_overview?.description || data.description || ''
        },
        workoutFormat: {
          format: data.workout_format?.format || [],
          focus: data.workout_format?.focus || parsedFocusArea || [],
          instructions: data.workout_format?.instructions || '',
          quirks: data.workout_format?.quirks || '',
          customFocus: data.workout_format?.customFocus || [],
          customFormats: data.workout_format?.customFormats || []
        },
        gymDetails: {
          equipment: data.gym_details?.equipment || '',
          spaceDescription: data.gym_details?.spaceDescription || ''
        },
        generatedProgram: data.generated_program || '',
        name: data.name || '',
        description: data.description || '',
        duration_weeks: data.duration_weeks || 0,
        focus_area: parsedFocusArea || [],
        entity_id: data.entity_id || ''
      })
      console.log(data.generated_program)
    } catch (error) {
      console.error('Error in fetchProgramDetails:', error)
    } finally {
      setLoading(false)
    }
  }

  console.log(program.duration_weeks)
  async function saveProgram(generatedProgramText: string) {
    if (!programId) return

    try {
      const { data: existingProgram } = await supabase.from('programs').select('entity_id').eq('id', programId).single()
      const updates = {
        session_details: program.programSchedule,
        program_overview: program.programOverview,
        workout_format: program.workoutFormat,
        gym_details: program.gymDetails,
        generated_program: generatedProgramText,
        name: program.programOverview?.name || '',
        description: program.programOverview?.description || '',
        duration_weeks: program.programSchedule.duration_weeks || program.duration_weeks || 0,
        focus_area: JSON.stringify(program.workoutFormat?.focus || []),
        entity_id: existingProgram?.entity_id
      }

      const { error } = await supabase.from('programs').update(updates).eq('id', programId)
      if (error) throw error

      console.log('Program saved successfully')
      router.push(`/entities/${existingProgram?.entity_id}`)
    } catch (error) {
      console.error('Error saving program:', error)
    }
  }

  useEffect(() => {
    if (programId) {
      fetchProgramDetails()
    }
  }, [programId])

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading program details...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
          <View className="mb-24">
            <ProgramOverview
              data={program.programOverview}
              onChange={(updatedOverview) => setProgram((prev) => ({ ...prev, programOverview: updatedOverview }))}
            />
            <CollapsibleSection title="Program Schedule">
              <ProgramSchedule
                data={{
                  ...program.programSchedule,
                  duration_weeks: program.duration_weeks // Make sure we pass the correct field
                }}
                onChange={(updatedProgramSchedule) =>
                  setProgram((prev) => ({
                    ...prev,
                    programSchedule: updatedProgramSchedule,
                    duration_weeks: updatedProgramSchedule.duration_weeks // Update both places
                  }))
                }
              />
            </CollapsibleSection>
            <CollapsibleSection title="Workout Format">
              <WorkoutFormat
                data={program.workoutFormat}
                onChange={(updatedWorkoutFormat) => setProgram((prev) => ({ ...prev, workoutFormat: updatedWorkoutFormat }))}
              />
            </CollapsibleSection>
            <CollapsibleSection title={'Gym Details'}>
              <GymDetails
                data={program.gymDetails}
                onChange={(updatedGymDetails) => setProgram((prev) => ({ ...prev, gymDetails: updatedGymDetails }))}
              />
            </CollapsibleSection>
            <ProgramGeneration
              programData={program}
              setLoading={setLoading}
              loading={loading}
              onProgramGenerated={(text) => setProgram((prev) => ({ ...prev, generatedProgram: text }))}
              initialProgram={program.generatedProgram}
            />
          </View>
        </ScrollView>

        <View className="absolute bottom-0 left-0 right-0 bg-background border-t border-gray-200 p-4">
          <Button variant="primary" size="large" onPress={() => saveProgram(program.generatedProgram)}>
            Save Program
          </Button>
        </View>
      </View>
    </SafeAreaView>
  )
}
