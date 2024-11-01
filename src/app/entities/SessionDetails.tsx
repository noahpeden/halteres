// app/entities/SessionDetails.js
import React from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { useEntityContext } from 'src/contexts/EntityContext'
import { router } from 'expo-router'

export default function SessionDetails() {
  const { entityData, setEntityData } = useEntityContext()

  const handleChange = (key, value) => {
    setEntityData((prevData) => ({
      ...prevData,
      sessionDetails: {
        ...prevData.sessionDetails,
        [key]: value
      }
    }))
  }

  const handleNext = () => {
    router.push('/entities/GymDetails')
  }

  return (
    <View className="flex-1 bg-background p-4">
      <Text className="text-lg font-bold mb-4">Session Details</Text>

      <Text>Session Length</Text>
      <TextInput
        className="border border-gray-300 rounded-md p-2 mb-4"
        placeholder="e.g., 45 minutes"
        value={entityData.sessionDetails.length}
        onChangeText={(value) => handleChange('length', value)}
      />

      <Text>Session Start/End Date</Text>
      <TextInput
        className="border border-gray-300 rounded-md p-2 mb-4"
        placeholder="e.g., Mon Oct 14 - Fri Nov 1"
        value={entityData.sessionDetails.startEndDate}
        onChangeText={(value) => handleChange('startEndDate', value)}
      />

      <Text>Session Schedule</Text>
      <TextInput
        className="border border-gray-300 rounded-md p-2 mb-4"
        placeholder="e.g., Monday, Wednesday, Friday"
        value={entityData.sessionDetails.schedule}
        onChangeText={(value) => handleChange('schedule', value)}
      />

      <TouchableOpacity className="bg-orange-500 p-4 rounded-md mt-6" onPress={handleNext}>
        <Text className="text-center text-white font-semibold">Next</Text>
      </TouchableOpacity>
    </View>
  )
}
