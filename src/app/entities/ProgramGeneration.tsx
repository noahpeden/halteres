import React from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'

export default function ProgramGeneration({ programData, onGenerate }) {
  return (
    <View className="mb-8">
      <Text className="text-lg font-bold mb-4">Program Generation</Text>
      <Text className="mb-2">Any Additional Notes for the Program</Text>
      <TextInput
        className="border border-gray-300 rounded-md p-2"
        placeholder="Enter additional notes"
        multiline
        onChangeText={(text) => onGenerate({ ...programData, additionalNotes: text })}
      />
      <TouchableOpacity className="bg-primary mt-4 p-4 rounded-md" onPress={() => onGenerate(programData)}>
        <Text className="text-white text-center font-semibold">Generate Program</Text>
      </TouchableOpacity>
    </View>
  )
}
