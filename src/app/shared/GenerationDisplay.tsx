// app/entities/WorkoutProgramDisplay.js
import React from 'react'
import { View, Text } from 'react-native'

export default function WorkoutProgramDisplay({ programText }) {
  if (!programText) {
    return <Text className="text-gray-500 text-center text-base py-4">No workout program generated yet.</Text>
  }

  // Helper function to parse the text into sections
  const parseProgram = (text) => {
    const sections = {
      title: '',
      body: '',
      strategy: '',
      scaling: ''
    }

    // Split the text into lines
    const lines = text.split('\n')
    let currentSection = 'title'

    lines.forEach((line) => {
      if (line.includes('Body:')) {
        currentSection = 'body'
      } else if (line.includes('Strategy:')) {
        currentSection = 'strategy'
      } else if (line.includes('Scaling:')) {
        currentSection = 'scaling'
      } else {
        sections[currentSection] += `${line}\n`
      }
    })

    return sections
  }

  const { title, body, strategy, scaling } = parseProgram(programText)

  return (
    <View className="bg-white p-4 rounded-lg my-4 shadow">
      {/* Title Section */}
      <Text className="text-2xl font-bold text-gray-800 mb-4">{title.trim()}</Text>

      {/* Body Section */}
      <Text className="text-lg font-semibold text-orange-500 mt-4">Workout Details</Text>
      <Text className="text-base text-gray-700 mt-2">{body.trim()}</Text>

      {/* Strategy Section */}
      <Text className="text-lg font-semibold text-orange-500 mt-4">Strategy</Text>
      <Text className="text-base text-gray-700 mt-2">{strategy.trim()}</Text>

      {/* Scaling Section */}
      <Text className="text-lg font-semibold text-orange-500 mt-4">Scaling Options</Text>
      <Text className="text-base text-gray-700 mt-2">{scaling.trim()}</Text>
    </View>
  )
}
