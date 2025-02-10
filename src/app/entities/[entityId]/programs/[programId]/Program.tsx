import React, { useEffect, useState } from 'react'
import { View, Text, SafeAreaView } from 'react-native'
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
    clientMetrics: {
      gender: '',
      height_cm: null,
      weight_kg: null,
      bench_1rm: null,
      squat_1rm: null,
      deadlift_1rm: null,
      mile_time: null
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

  if (!entityId || !programId) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Invalid program or entity ID</Text>
      </View>
    )
  }

  async function fetchProgramDetails() {
    if (!programId) return

    setLoading(true)
    try {
      const { data: programData, error: programError } = await supabase.from('programs').select('*').eq('id', programId).single()

      if (programError) throw programError

      const { data: entityData, error: entityError } = await supabase
        .from('entities')
        .select('gender, height_cm, weight_kg, bench_1rm, squat_1rm, deadlift_1rm, mile_time')
        .eq('id', programData.entity_id)
        .single()
      console.log({
        gender: entityData.gender,
        height_cm: entityData.height_cm,
        weight_kg: entityData.weight_kg,
        bench_1rm: entityData.bench_1rm,
        squat_1rm: entityData.squat_1rm,
        deadlift_1rm: entityData.deadlift_1rm,
        mile_time: entityData.mile_time
      })

      if (entityError) throw entityError

      const parsedFocusArea = Array.isArray(programData.focus_area) ? programData.focus_area : JSON.parse(programData.focus_area || '[]')

      setProgram({
        ...program,
        programSchedule: {
          startDate: programData.session_details?.startDate || '',
          endDate: programData.session_details?.endDate || '',
          schedule: programData.session_details?.schedule || [],
          sessionDuration: programData.session_details?.sessionDuration || '',
          duration_weeks: programData.duration_weeks || 0
        },
        programOverview: {
          name: programData.program_overview?.name || programData.name || '',
          description: programData.program_overview?.description || programData.description || ''
        },
        workoutFormat: {
          format: programData.workout_format?.format || [],
          focus: programData.workout_format?.focus || parsedFocusArea || [],
          instructions: programData.workout_format?.instructions || '',
          quirks: programData.workout_format?.quirks || '',
          customFocus: programData.workout_format?.customFocus || [],
          customFormats: programData.workout_format?.customFormats || []
        },
        gymDetails: {
          equipment: programData.gym_details?.equipment || '',
          spaceDescription: programData.gym_details?.spaceDescription || ''
        },
        generatedProgram: programData.generated_program || '',
        name: programData.name || '',
        description: programData.description || '',
        duration_weeks: programData.duration_weeks || 0,
        focus_area: parsedFocusArea || [],
        entity_id: programData.entity_id || '',
        clientMetrics: {
          gender: entityData.gender || '',
          height_cm: entityData.height_cm,
          weight_kg: entityData.weight_kg,
          bench_1rm: entityData.bench_1rm,
          squat_1rm: entityData.squat_1rm,
          deadlift_1rm: entityData.deadlift_1rm,
          mile_time: entityData.mile_time
        }
      })
    } catch (error) {
      console.error('Error fetching program details:', error)
    } finally {
      setLoading(false)
    }
  }

  async function saveProgram(generatedProgramText: string) {
    if (!programId) return

    try {
      const updates = {
        session_details: program.programSchedule,
        program_overview: program.programOverview,
        workout_format: program.workoutFormat,
        gym_details: program.gymDetails,
        generated_program: generatedProgramText,
        name: program.programOverview?.name || '',
        description: program.programOverview?.description || '',
        duration_weeks: program.programSchedule.duration_weeks || program.duration_weeks || 0,
        focus_area: JSON.stringify(program.workoutFormat?.focus || [])
      }

      const { error: programError } = await supabase.from('programs').update(updates).eq('id', programId)

      if (programError) throw programError

      const { error: entityError } = await supabase
        .from('entities')
        .update({
          gender: program.clientMetrics?.gender,
          height_cm: program.clientMetrics?.height_cm,
          weight_kg: program.clientMetrics?.weight_kg,
          bench_1rm: program.clientMetrics?.bench_1rm,
          squat_1rm: program.clientMetrics?.squat_1rm,
          deadlift_1rm: program.clientMetrics?.deadlift_1rm,
          mile_time: program.clientMetrics?.mile_time
        })
        .eq('id', program.entity_id)

      if (entityError) throw entityError

      console.log('Program and metrics saved successfully')
      router.push(`/entities/${program.entity_id}`)
    } catch (error) {
      console.error('Error saving program and metrics:', error)
    }
  }

  useEffect(() => {
    if (programId) {
      fetchProgramDetails()
    }
  }, [programId])

  return (
    <SafeAreaView className="flex-1 bg-background">
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
          entityId={entityId as string}
        />
      </View>

      <View className="absolute bottom-0 left-0 right-0 bg-background border-t border-gray-200 p-4">
        <Button variant="primary" size="large" onPress={() => saveProgram(program.generatedProgram)}>
          Save Program
        </Button>
      </View>
    </SafeAreaView>
  )
}
