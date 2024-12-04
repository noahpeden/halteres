import React from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native'

const WORKOUT_FORMATS = ['Strength', 'Hypertrophy', 'Endurance', 'HIIT', 'CrossFit', 'Conditioning']

export default function WorkoutFormat({ data, onChange }) {
  const toggleFormat = (format) => {
    const currentFormats = data.format || []
    const newFormats = currentFormats.includes(format) ? currentFormats.filter((f) => f !== format) : [...currentFormats, format]
    onChange({ ...data, format: newFormats })
  }

  return (
    <View className="mb-8">
      <Text className="text-lg font-bold mb-4">Workout Format</Text>

      <Text className="mb-2">Preferred Format</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
        <View className="flex-row gap-2">
          {WORKOUT_FORMATS.map((format) => (
            <TouchableOpacity
              key={format}
              onPress={() => toggleFormat(format)}
              className={`px-3 py-2 rounded-md ${(data.format || []).includes(format) ? 'bg-blue-500' : 'bg-gray-200'}`}>
              <Text className={`${(data.format || []).includes(format) ? 'text-white' : 'text-gray-700'}`}>{format}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Text className="mt-4 mb-2">Special Instructions</Text>
      <TextInput
        className="border border-gray-300 rounded-md p-2"
        placeholder="Enter any special instructions"
        value={data.instructions}
        onChangeText={(text) => onChange({ ...data, instructions: text })}
        multiline
      />

      <Text className="mt-4 mb-2">Focus Area</Text>
      <TextInput
        className="border border-gray-300 rounded-md p-2"
        placeholder="e.g., Upper Body, Lower Body, Full Body"
        value={data.focus}
        onChangeText={(text) => onChange({ ...data, focus: text })}
      />

      <Text className="mt-4 mb-2">Special Requirements</Text>
      <TextInput
        className="border border-gray-300 rounded-md p-2"
        placeholder="Enter any special requirements or quirks"
        value={data.quirks}
        onChangeText={(text) => onChange({ ...data, quirks: text })}
        multiline
      />
    </View>
  )
}
