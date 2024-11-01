// app/entities/GymDetails.js
import React from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { useEntityContext } from 'src/contexts/EntityContext'
import { router } from 'expo-router'

export default function GymDetails() {
  const { entityData, setEntityData } = useEntityContext()

  const handleChange = (key, value) => {
    setEntityData((prevData) => ({
      ...prevData,
      gymDetails: {
        ...prevData.gymDetails,
        [key]: value
      }
    }))
  }

  const handleNext = () => {
    router.push('/entities/WorkoutFormat')
  }

  return (
    <View className="flex-1 bg-background p-4">
      <Text className="text-lg font-bold mb-4">Gym Details</Text>

      <Text>Gym Type</Text>
      <TextInput
        className="border border-gray-300 rounded-md p-2 mb-4"
        placeholder="e.g., Commercial"
        value={entityData.gymDetails.type}
        onChangeText={(value) => handleChange('type', value)}
      />

      <Text>Unavailable Equipment</Text>
      <TextInput
        className="border border-gray-300 rounded-md p-2 mb-4"
        placeholder="e.g., Heavy Bag, Jacob's Ladder"
        value={entityData.gymDetails.unavailableEquipment}
        onChangeText={(value) => handleChange('unavailableEquipment', value)}
      />

      <Text>Excluded Movements/Equipment</Text>
      <TextInput
        className="border border-gray-300 rounded-md p-2 mb-4"
        placeholder="e.g., None"
        value={entityData.gymDetails.excludedMovements}
        onChangeText={(value) => handleChange('excludedMovements', value)}
      />

      <TouchableOpacity className="bg-orange-500 p-4 rounded-md mt-6" onPress={handleNext}>
        <Text className="text-center text-white font-semibold">Next</Text>
      </TouchableOpacity>
    </View>
  )
}
