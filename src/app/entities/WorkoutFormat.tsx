import React from 'react'
import { View, Text, TextInput } from 'react-native'

export default function WorkoutFormat({ data, onChange }) {
  return (
    <View className="mb-8">
      <Text className="text-lg font-bold mb-4">Workout Format</Text>
      <Text className="mb-2">Preferred Format</Text>
      <TextInput
        className="border border-gray-300 rounded-md p-2"
        placeholder="e.g., Strength, Conditioning, Hypertrophy"
        value={data.format}
        onChangeText={(text) => onChange({ ...data, format: text })}
      />
      <Text className="mt-4 mb-2">Special Instructions</Text>
      <TextInput
        className="border border-gray-300 rounded-md p-2"
        placeholder="Enter any special instructions"
        value={data.instructions}
        onChangeText={(text) => onChange({ ...data, instructions: text })}
        multiline
      />
    </View>
  )
}
