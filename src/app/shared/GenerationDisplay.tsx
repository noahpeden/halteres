import React from 'react'
import { View, Text } from 'react-native'

interface WorkoutProgramDisplayProps {
  programText: string
}

const WorkoutProgramDisplay: React.FC<WorkoutProgramDisplayProps> = ({ programText }) => {
  if (!programText) {
    return <Text className="text-gray-500">No program generated yet</Text>
  }

  return (
    <View className="bg-white p-4 rounded-lg shadow-sm">
      <Text className="text-base whitespace-pre-wrap">{programText}</Text>
    </View>
  )
}

export default WorkoutProgramDisplay
