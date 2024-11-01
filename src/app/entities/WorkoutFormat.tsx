// app/entities/WorkoutFormat.js
import React from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { useEntityContext } from 'src/contexts/EntityContext'
import { router } from 'expo-router'

export default function WorkoutFormat() {
  const { entityData, setEntityData } = useEntityContext()

  const handleChange = (key, value) => {
    setEntityData((prevData) => ({
      ...prevData,
      workoutFormat: {
        ...prevData.workoutFormat,
        [key]: value
      }
    }))
  }

  const handleNext = () => {
    router.push('/entities/ProgramOverview')
  }

  return (
    <View className="flex-1 bg-background p-4">
      <Text className="text-lg font-bold mb-4">Workout Format</Text>

      <Text>Workout Format</Text>
      <TextInput
        className="border border-gray-300 rounded-md p-2 mb-4"
        placeholder="e.g., Add Interval"
        value={entityData.workoutFormat.format}
        onChangeText={(value) => handleChange('format', value)}
      />

      <Text>Program Focuses</Text>
      <TextInput
        className="border border-gray-300 rounded-md p-2 mb-4"
        placeholder="e.g., Strength Training"
        value={entityData.workoutFormat.focus}
        onChangeText={(value) => handleChange('focus', value)}
      />

      <Text>Program Quirks</Text>
      <TextInput
        className="border border-gray-300 rounded-md p-2 mb-4"
        placeholder="e.g., None"
        value={entityData.workoutFormat.quirks}
        onChangeText={(value) => handleChange('quirks', value)}
      />

      <Text>Priority Workout</Text>
      <TextInput
        className="border border-gray-300 rounded-md p-2 mb-4"
        placeholder="e.g., Dumbbells"
        value={entityData.workoutFormat.priorityWorkout}
        onChangeText={(value) => handleChange('priorityWorkout', value)}
      />

      <TouchableOpacity className="bg-orange-500 p-4 rounded-md mt-6" onPress={handleNext}>
        <Text className="text-center text-white font-semibold">Next</Text>
      </TouchableOpacity>
    </View>
  )
}
