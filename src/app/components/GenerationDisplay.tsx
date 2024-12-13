import React from 'react'
import { View, Text, ScrollView } from 'react-native'

interface WorkoutProgramDisplayProps {
  programText: string
}

const WorkoutProgramDisplay: React.FC<WorkoutProgramDisplayProps> = ({ programText }) => {
  if (!programText) {
    return (
      <View className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <Text className="text-gray-500 text-center">Your program will appear here once generated</Text>
      </View>
    )
  }

  // Split the program text into sections based on headers
  const sections = programText.split(/(?=Week \d|WARM-UP:|WORKOUT OVERVIEW:|STRENGTH\/SKILL:|WORKOUT:|COOLDOWN:)/)

  return (
    <ScrollView className="bg-white rounded-lg shadow-sm">
      {sections.map((section, index) => {
        const isHeader = section.trim().startsWith('Week')
        const isSection = /^(WARM-UP|WORKOUT OVERVIEW|STRENGTH\/SKILL|WORKOUT|COOLDOWN):/.test(section.trim())

        return (
          <View
            key={index}
            className={`
              p-4 
              ${isHeader ? 'bg-orange-100' : ''} 
              ${isSection ? 'border-t border-gray-200' : ''}
            `}>
            <Text
              className={`
                ${isHeader ? 'text-lg font-bold text-orange-800' : ''}
                ${isSection ? 'text-base font-semibold mb-2' : 'text-base'}
              `}>
              {section}
            </Text>
          </View>
        )
      })}
    </ScrollView>
  )
}

export default WorkoutProgramDisplay
