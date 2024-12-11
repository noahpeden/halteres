import React from 'react'
import { View, Text, TextInput } from 'react-native'

export default function GymDetails({ data, onChange }) {
  return (
    <View className="mb-8">
      <Text className="text-lg font-bold mb-4">Gym Details</Text>
      <Text className="mb-2">Available Equipment</Text>
      <TextInput
        className="border border-gray-300 rounded-md p-2"
        placeholder="e.g., Barbells, Dumbbells, Kettlebells"
        value={data.equipment}
        onChangeText={(text) => onChange({ ...data, equipment: text })}
      />
      <Text className="mt-4 mb-2">Gym Space Description</Text>
      <TextInput
        className="border border-gray-300 rounded-md p-2"
        placeholder="Describe the gym space"
        value={data.spaceDescription}
        onChangeText={(text) => onChange({ ...data, spaceDescription: text })}
        multiline
      />
    </View>
  )
}
