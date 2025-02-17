import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native'
import WorkoutProgramDisplay from './GenerationDisplay'

interface ProgramData {
  clientMetrics: {
    gender: string
    height_cm: number | null
    weight_kg: number | null
    bench_1rm: number | null
    squat_1rm: number | null
    deadlift_1rm: number | null
    mile_time: number | null
  }
  programSchedule: {
    startDate: string
    endDate: string
    schedule: string[]
    sessionDuration: string
    duration_weeks: number
  }
}

interface ProgramGenerationProps {
  programData: ProgramData
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  loading: boolean
  onProgramGenerated: (text: string) => void
  initialProgram?: string
  entityId: string
}

const ProgramGeneration: React.FC<ProgramGenerationProps> = ({
  programData,
  setLoading,
  loading,
  onProgramGenerated,
  initialProgram = '',
  entityId
}) => {
  const [generatedProgram, setGeneratedProgram] = useState(initialProgram)
  const [currentWeek, setCurrentWeek] = useState<number>(1)
  const [totalWeeks, setTotalWeeks] = useState<number>(programData.programSchedule.duration_weeks || 1)
  const [workoutProgress, setWorkoutProgress] = useState<{
    current: number
    total: number
    totalGenerated: number
    totalProgram: number
  }>({
    current: 0,
    total: programData.programSchedule.schedule.length || 1,
    totalGenerated: 0,
    totalProgram: programData.programSchedule.duration_weeks * programData.programSchedule.schedule.length || 1
  })

  useEffect(() => {
    if (initialProgram) {
      setGeneratedProgram(initialProgram)
    }
  }, [initialProgram])

  const generateProgram = async () => {
    if (!entityId) {
      console.error('Missing entity ID')
      setGeneratedProgram('Error: Missing entity ID. Please try again.')
      return
    }

    setLoading(true)
    setGeneratedProgram('')
    let accumulatedContent = ''
    let hasReceivedData = false

    try {
      console.log('Starting program generation request...')
      const response = await fetch('https://vrmuakouskjbabedjhoc.supabase.co/functions/v1/generate-workout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          entityData: {
            ...programData,
            gender: programData.clientMetrics.gender,
            height_cm: programData.clientMetrics.height_cm,
            weight_kg: programData.clientMetrics.weight_kg,
            bench_1rm: programData.clientMetrics.bench_1rm,
            squat_1rm: programData.clientMetrics.squat_1rm,
            deadlift_1rm: programData.clientMetrics.deadlift_1rm,
            mile_time: programData.clientMetrics.mile_time,
            entity_id: entityId
          }
        })
      })

      console.log('Response received:', response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Response not OK:', errorText)
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
      }

      if (!response.body) {
        console.error('No response body received')
        throw new Error('Server returned empty response')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      console.log('Starting to read stream...')
      try {
        let buffer = ''
        let isDone = false

        while (!isDone) {
          const { done, value } = await reader.read()
          isDone = done

          if (done) {
            console.log('Stream complete, hasReceivedData:', hasReceivedData)
            if (!hasReceivedData) {
              throw new Error('Stream ended without receiving any data')
            }
            break
          }

          const chunk = decoder.decode(value)
          console.log('Received chunk:', chunk.length, 'characters')
          buffer += chunk

          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              hasReceivedData = true
              const content = line.slice(6).trim()

              if (content === '[DONE]') {
                console.log('Received [DONE] signal')
                continue
              }

              try {
                const data = JSON.parse(content)
                console.log('Parsed data type:', data.type)

                if (data.type === 'error') {
                  throw new Error(data.message)
                }

                if (data.type === 'start') {
                  console.log('Stream started successfully')
                } else if (data.type === 'progress') {
                  setCurrentWeek(data.week)
                  setTotalWeeks(data.totalWeeks)
                } else if (data.type === 'workoutProgress') {
                  setWorkoutProgress({
                    current: data.workout,
                    total: data.totalWorkouts
                  })
                } else if (data.type === 'content' && data.text) {
                  accumulatedContent += data.text
                  setGeneratedProgram(accumulatedContent)
                }
              } catch (e) {
                console.warn('Error parsing content:', e)
                // If it's not JSON, treat it as raw content
                if (content && content !== '[DONE]') {
                  accumulatedContent += content + '\n'
                  setGeneratedProgram(accumulatedContent)
                }
              }
            }
          }
        }

        console.log('Stream processing complete')
        if (accumulatedContent) {
          console.log('Generated content length:', accumulatedContent.length)
          onProgramGenerated(accumulatedContent)
        } else {
          throw new Error('No program content was generated')
        }
      } finally {
        console.log('Releasing reader lock')
        reader.releaseLock()
      }
    } catch (error: unknown) {
      console.error('Error generating program:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      setGeneratedProgram(`Error generating program: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const handleProgramChange = (newText: string) => {
    setGeneratedProgram(newText)
    onProgramGenerated(newText)
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text className="text-lg font-bold mb-4">Program Generation</Text>
      <Text className="text-md mb-4">
        {generatedProgram
          ? 'You can make edits to the program or regenerate it using the button below.'
          : 'Click the button below to generate your program.'}
      </Text>

      {loading && (
        <View className="mb-4 p-4 bg-gray-100 rounded-lg">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-gray-700 font-medium">
              Writing workouts for Week {currentWeek} of {totalWeeks}
            </Text>
            <ActivityIndicator size="small" color="#f97316" />
          </View>

          {/* {workoutProgress.total > 0 && (
            <View className="mt-2">
              <View className="flex-row justify-between mb-1">
                <Text className="text-gray-600 text-sm">
                  Generating workout {workoutProgress.current} of {workoutProgress.total}
                </Text>
                <Text className="text-gray-600 text-sm">{Math.round((workoutProgress.current / workoutProgress.total) * 100)}%</Text>
              </View>
              <View className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                <View
                  className="h-full bg-orange-500 rounded-full"
                  style={{
                    width: `${(workoutProgress.current / workoutProgress.total) * 100}%`
                  }}
                />
              </View>
            </View>
          )} */}

          {/* <View className="mt-2">
            <View className="flex-row justify-between mb-1">
              <Text className="text-gray-600 text-sm">Overall Progress</Text>
              <Text className="text-gray-600 text-sm">
                {Math.max(0, Math.min(100, Math.round((workoutProgress.totalGenerated / workoutProgress.totalProgram) * 100)))}%
              </Text>
            </View>
            <View className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
              <View
                className="h-full bg-blue-500 rounded-full"
                style={{
                  width: `${Math.max(0, Math.min(100, (workoutProgress.totalGenerated / workoutProgress.totalProgram) * 100))}%`
                }}
              />
            </View>
          </View> */}
        </View>
      )}

      <TouchableOpacity className={`p-4 rounded-lg ${loading ? 'bg-gray-400' : 'bg-orange-500'}`} onPress={generateProgram} disabled={loading}>
        <Text className="text-center text-white font-semibold">
          {loading ? 'Generating...' : generatedProgram ? 'Regenerate Program' : 'Generate Program'}
        </Text>
      </TouchableOpacity>

      <View className="min-h-[400px] mb-4">
        <WorkoutProgramDisplay programText={generatedProgram} onProgramChange={handleProgramChange} />
      </View>
    </ScrollView>
  )
}

export default ProgramGeneration
