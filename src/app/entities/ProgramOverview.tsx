// app/entities/ProgramOverview.js
import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useEntityContext } from 'src/contexts/EntityContext'
import { router } from 'expo-router'

export default function ProgramOverview() {
  const { entityData } = useEntityContext()

  const handleGenerateProgram = () => {
    console.log('Generate Program with data:', entityData)
    // Add functionality to generate program
  }

  return (
    <View className="flex-1 bg-background p-4">
      <Text className="text-lg font-bold mb-4">Program Overview</Text>

      <Text className="text-lg font-semibold mb-2">{entityData.programName}</Text>
      <Text className="text-md mb-2">Session Length: {entityData.sessionDetails.length}</Text>
      <Text className="text-md mb-2">Session Start/End Date: {entityData.sessionDetails.startEndDate}</Text>
      <Text className="text-md mb-2">Session Schedule: {entityData.sessionDetails.schedule}</Text>
      <Text className="text-md mb-2">Gym Type: {entityData.gymDetails.type}</Text>
      <Text className="text-md mb-2">Unavailable Equipment: {entityData.gymDetails.unavailableEquipment}</Text>
      <Text className="text-md mb-2">Excluded Movements/Equipment: {entityData.gymDetails.excludedMovements}</Text>
      <Text className="text-md mb-2">Workout Format: {entityData.workoutFormat.format}</Text>
      <Text className="text-md mb-2">Program Focuses: {entityData.workoutFormat.focus}</Text>
      <Text className="text-md mb-2">Program Quirks: {entityData.workoutFormat.quirks}</Text>
      <Text className="text-md mb-2">Priority Workout: {entityData.workoutFormat.priorityWorkout}</Text>

      <TouchableOpacity className="bg-orange-500 p-4 rounded-md mt-6" onPress={handleGenerateProgram}>
        <Text className="text-center text-white font-semibold">Generate Program</Text>
      </TouchableOpacity>
    </View>
  )
}
