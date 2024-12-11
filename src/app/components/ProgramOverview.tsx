import React from 'react'
import { View, Text, TextInput } from 'react-native'

export default function ProgramOverview({ data, onChange }) {
  return (
    <View className="mb-8">
      <Text className="text-lg font-bold mb-4">Program Overview</Text>
      <Text className="mb-2">Program Name</Text>
      <TextInput
        className="border border-gray-300 rounded-md p-2"
        placeholder="Enter program name"
        value={data.name}
        onChangeText={(text) => onChange({ ...data, name: text })}
      />
      <Text className="mt-4 mb-2">Program Description</Text>
      <TextInput
        className="border border-gray-300 rounded-md p-2"
        placeholder="Enter program description"
        value={data.description}
        onChangeText={(text) => onChange({ ...data, description: text })}
        multiline
      />
    </View>
  )
}
