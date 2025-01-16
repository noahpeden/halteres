import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native'
import WorkoutProgramDisplay from './GenerationDisplay'

interface ProgramGenerationProps {
  programData: any
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  loading: boolean
  onProgramGenerated: (text: string) => void
  initialProgram?: string
}

const ProgramGeneration: React.FC<ProgramGenerationProps> = ({ programData, setLoading, loading, onProgramGenerated, initialProgram = '' }) => {
  const [generatedProgram, setGeneratedProgram] = useState(initialProgram)
  const [currentWeek, setCurrentWeek] = useState<number>(0)
  const [totalWeeks, setTotalWeeks] = useState<number>(0)

  useEffect(() => {
    if (initialProgram) {
      setGeneratedProgram(initialProgram)
    }
  }, [initialProgram])

  const processStreamedContent = (text: string) => {
    const lines = text.split('\n')
    let accumulatedContent = ''

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const content = line.slice(6).trim()

        // Handle week markers
        if (content.match(/Week \d+ of \d+:/)) {
          const match = content.match(/Week (\d+) of (\d+):/)
          if (match) {
            setCurrentWeek(parseInt(match[1]))
            setTotalWeeks(parseInt(match[2]))
          }
          continue
        }

        // Handle [DONE] message
        if (content === '[DONE]') {
          continue
        }

        try {
          // Try to parse as JSON first (for OpenAI streaming format)
          const data = JSON.parse(content)
          if (data.choices?.[0]?.delta?.content) {
            accumulatedContent += data.choices[0].delta.content
          }
        } catch (e) {
          // If not JSON, treat as raw content
          accumulatedContent += content + '\n'
        }
      }
    }

    return accumulatedContent
  }

  const generateProgram = async () => {
    setLoading(true)
    setGeneratedProgram('')
    setCurrentWeek(0)
    setTotalWeeks(0)
    let fullContent = ''

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

      const text = await response.text()
      fullContent = processStreamedContent(text)
      setGeneratedProgram(fullContent)
      onProgramGenerated(fullContent)
    } catch (error) {
      console.error('Error generating program:', error)
      setGeneratedProgram('Error generating program. Please try again.')
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
      <TouchableOpacity className={`p-4 rounded-lg ${loading ? 'bg-gray-400' : 'bg-orange-500'}`} onPress={generateProgram} disabled={loading}>
        <Text className="text-center text-white font-semibold">
          {loading ? 'Generating...' : generatedProgram ? 'Regenerate Program' : 'Generate Program'}
        </Text>
      </TouchableOpacity>

      <View className="min-h-[400px] mb-4">
        {loading ? (
          <View className="flex-1 justify-center items-center py-12">
            <ActivityIndicator size="large" color="#FF7F50" />
            <Text className="mt-4 text-gray-600 text-center">
              {totalWeeks > 0
                ? `Generating Week ${currentWeek} of ${totalWeeks}...\nThis may take a few minutes`
                : 'Generating your program...\nThis may take a few minutes'}
            </Text>
          </View>
        ) : (
          <WorkoutProgramDisplay programText={generatedProgram} onProgramChange={handleProgramChange} />
        )}
      </View>
    </ScrollView>
  )
}

export default ProgramGeneration
