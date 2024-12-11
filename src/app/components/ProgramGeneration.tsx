import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native'
import WorkoutProgramDisplay from 'src/app/shared/GenerationDisplay'

interface ProgramGenerationProps {
  programData: any
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  loading: boolean
  onProgramGenerated: (text: string) => void
}

const ProgramGeneration: React.FC<ProgramGenerationProps> = ({ programData, setLoading, loading, onProgramGenerated }) => {
  const [generatedProgram, setGeneratedProgram] = useState('')

  const readBlob = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsText(blob)
    })
  }

  const generateProgram = async () => {
    setLoading(true)
    try {
      const response = await fetch('https://vrmuakouskjbabedjhoc.supabase.co/functions/v1/generate-workout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ entityData: programData })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const blob = await response.blob()
      const text = await readBlob(blob)

      const lines = text.split('\n')
      let fullContent = ''

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6))
            if (data.choices?.[0]?.delta?.content) {
              fullContent += data.choices[0].delta.content
            }
          } catch (e) {
            if (line.slice(6) !== '[DONE]') {
              console.error('Error parsing line:', e)
            }
          }
        }
      }

      setGeneratedProgram(fullContent)
      onProgramGenerated(fullContent)
    } catch (error) {
      console.error('Error generating program:', error)
      setGeneratedProgram('Error generating program. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text className="text-lg font-bold mb-4">Program Generation</Text>
      <Text className="text-md mb-4">You can make edits or, if everything looks good, proceed by selecting 'Create Program'.</Text>

      <View className="min-h-[200px] mb-4">
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#FF7F50" />
            <Text className="mt-2 text-gray-600">Generating your program...</Text>
          </View>
        ) : (
          <WorkoutProgramDisplay programText={generatedProgram} />
        )}
      </View>

      <TouchableOpacity className="bg-orange-500 p-4 rounded-md" onPress={generateProgram} disabled={loading}>
        <Text className="text-center text-white font-semibold">{loading ? 'Generating...' : 'Create Program'}</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

export default ProgramGeneration
