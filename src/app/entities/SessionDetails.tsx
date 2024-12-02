import React from 'react'
import { View, Text, TextInput } from 'react-native'

export default function SessionDetails({ data, onChange }) {
  return (
    <View className="mb-8">
      <Text className="text-lg font-bold mb-4">Session Details</Text>
      <Text className="mb-2">Number of Sessions Per Week</Text>
      <TextInput
        className="border border-gray-300 rounded-md p-2"
        placeholder="Enter number of sessions"
        value={data.sessionsPerWeek}
        onChangeText={(text) => onChange({ ...data, sessionsPerWeek: text })}
        keyboardType="numeric"
      />
      <Text className="mt-4 mb-2">Session Duration (Minutes)</Text>
      <TextInput
        className="border border-gray-300 rounded-md p-2"
        placeholder="Enter session duration"
        value={data.sessionDuration}
        onChangeText={(text) => onChange({ ...data, sessionDuration: text })}
        keyboardType="numeric"
      />
    </View>
  )
}
