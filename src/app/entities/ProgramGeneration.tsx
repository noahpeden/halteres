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
          Authorization: 'Bearer ' + process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
        },
        body: JSON.stringify({ entityData })
      })

      if (!response.body) {
        throw new Error('Stream not available')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { value, done } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        setGeneratedProgram((prev) => prev + chunk)
      }
    } catch (error) {
      console.error('Error generating program:', error)
      // You might want to show an error message to the user here
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text className="text-lg font-bold mb-4">Program Generation</Text>

      <Text className="text-md mb-4">You can make edits or, if everything looks good, proceed by selecting 'Create Program'.</Text>

      {loading ? <ActivityIndicator size="large" color="#FF7F50" /> : <WorkoutProgramDisplay programText={generatedProgram} />}

      <TouchableOpacity className="bg-blue-500 p-4 rounded-md mb-4" onPress={generateProgram} disabled={loading}>
        <Text className="text-center text-white font-semibold">{loading ? 'Generating...' : 'Generate Program'}</Text>
      </TouchableOpacity>

      <TouchableOpacity className="bg-orange-500 p-4 rounded-md" onPress={() => console.log('Program Created:', generatedProgram)} disabled={loading}>
        <Text className="text-center text-white font-semibold">Create Program</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}
