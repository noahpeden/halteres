import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native'
import { useEntityContext } from 'src/contexts/EntityContext'
import WorkoutProgramDisplay from 'src/app/shared/GenerationDisplay'

interface ProgramGenerationProps {
  programData: any // Replace 'any' with a more specific type if available
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  loading: boolean
}

const ProgramGeneration: React.FC<ProgramGenerationProps> = ({ programData, setLoading, loading }) => {
  const [generatedProgram, setGeneratedProgram] = useState('')

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

      if (!response.body) {
        console.error('No stream returned. Falling back to error message.')
        throw new Error(await response.text()) // Attempt to read the full response body as text
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      setGeneratedProgram('')
      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        setGeneratedProgram((prev) => prev + chunk)
      }
    } catch (error) {
      console.error('Error generating program:', error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text className="text-lg font-bold mb-4">Program Generation</Text>
      <Text className="text-md mb-4">You can make edits or, if everything looks good, proceed by selecting 'Create Program'.</Text>
      {loading ? <ActivityIndicator size="large" color="#FF7F50" /> : <WorkoutProgramDisplay programText={generatedProgram} />}

      <TouchableOpacity className="bg-orange-500 p-4 rounded-md" onPress={generateProgram} disabled={loading}>
        <Text className="text-center text-white font-semibold">Create Program</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

export default ProgramGeneration
