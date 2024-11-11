import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native'
import { useEntityContext } from 'src/contexts/EntityContext'
import WorkoutProgramDisplay from 'src/app/shared/GenerationDisplay'

export default function ProgramGeneration() {
  const { entityData } = useEntityContext()
  const [loading, setLoading] = useState(false)
  const [generatedProgram, setGeneratedProgram] = useState('')

  const cleanupStreamingText = (text: string) => {
    // Split the text by newlines
    const lines = text.split('\n')

    // Process each line and combine the actual content
    return lines
      .map((line) => {
        // Match the pattern '0:"some text"' and extract just 'some text'
        const match = line.match(/^0:"(.*)"$/)
        if (match) {
          // Get the content within quotes and handle escape sequences
          return match[1]
            .replace(/\\n/g, '\n') // Convert \n string to actual newlines
            .replace(/\\"/g, '"') // Convert \" to "
        }
        return ''
      })
      .join('') // Join all the pieces together
  }

  const generateProgram = async () => {
    setLoading(true)
    setGeneratedProgram('')

    try {
      const response = await fetch('https://vrmuakouskjbabedjhoc.supabase.co/functions/v1/generate-workout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ entityData })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const text = await response.text()
      const cleanedText = cleanupStreamingText(text)
      setGeneratedProgram(cleanedText)
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

      <View className="bg-white p-4 rounded-lg mb-4">
        <Text className="font-bold text-lg mb-2">Current Program Settings:</Text>
        <Text>Program: {entityData.programName}</Text>
        <Text>Schedule: {entityData.sessionDetails.schedule}</Text>
        <Text>Focus: {entityData.workoutFormat.focus}</Text>
        <TouchableOpacity
          className="bg-gray-200 p-2 rounded-md mt-2"
          onPress={() => {
            console.log('Current Entity Data:', entityData)
          }}>
          <Text className="text-center">Debug: Log Entity Data</Text>
        </TouchableOpacity>
      </View>

      {loading ? <ActivityIndicator size="large" color="#FF7F50" /> : <WorkoutProgramDisplay programText={generatedProgram} />}

      <TouchableOpacity className="bg-blue-500 p-4 rounded-md mb-4" onPress={generateProgram} disabled={loading}>
        <Text className="text-center text-white font-semibold">{loading ? 'Generating...' : 'Generate Program'}</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}
