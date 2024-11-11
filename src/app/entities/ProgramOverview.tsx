import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native'
import { useEntityContext } from 'src/contexts/EntityContext'
import WorkoutProgramDisplay from 'src/app/shared/GenerationDisplay'

export default function ProgramGeneration() {
  const { entityData } = useEntityContext()
  const [loading, setLoading] = useState(false)
  const [generatedProgram, setGeneratedProgram] = useState('')

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

      // Handle the text response
      const text = await response.text()

      // Process the text response - it might come as chunks with "data: " prefix
      const lines = text.split('\n')
      let fullResponse = ''

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const jsonData = JSON.parse(line.slice(6))
            if (jsonData.choices?.[0]?.delta?.content) {
              fullResponse += jsonData.choices[0].delta.content
              setGeneratedProgram(fullResponse)
            }
          } catch (e) {
            // Skip invalid JSON
            console.log('Skipping invalid JSON:', e)
          }
        }
      }

      if (!fullResponse) {
        // If we couldn't parse the streaming response, just use the raw text
        setGeneratedProgram(text)
      }
    } catch (error) {
      console.error('Error generating program:', error)
      setGeneratedProgram('Error generating program. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Show current context data
  const renderEntityData = () => (
    <View className="bg-white p-4 rounded-lg mb-4">
      <Text className="font-bold text-lg mb-2">Current Program Settings:</Text>
      <Text>Program: {entityData.programName}</Text>
      <Text>Schedule: {entityData.sessionDetails.schedule}</Text>
      <Text>Focus: {entityData.workoutFormat.focus}</Text>
      <TouchableOpacity className="bg-gray-200 p-2 rounded-md mt-2" onPress={() => console.log('Current Entity Data:', entityData)}>
        <Text className="text-center">Debug: Log Entity Data</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text className="text-lg font-bold mb-4">Program Generation</Text>

      {renderEntityData()}

      {loading ? <ActivityIndicator size="large" color="#FF7F50" /> : <WorkoutProgramDisplay programText={generatedProgram} />}

      <TouchableOpacity className="bg-blue-500 p-4 rounded-md mb-4" onPress={generateProgram} disabled={loading}>
        <Text className="text-center text-white font-semibold">{loading ? 'Generating...' : 'Generate Program'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-orange-500 p-4 rounded-md"
        onPress={() => console.log('Program Created:', generatedProgram)}
        disabled={loading || !generatedProgram}>
        <Text className="text-center text-white font-semibold">Create Program</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}
