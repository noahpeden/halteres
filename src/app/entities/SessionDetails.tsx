import React from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native'

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function SessionDetails({ data, onChange }) {
  const toggleDay = (day) => {
    const currentSchedule = data.schedule || []
    const newSchedule = currentSchedule.includes(day) ? currentSchedule.filter((d) => d !== day) : [...currentSchedule, day]
    onChange({ ...data, schedule: newSchedule })
  }

  return (
    <View className="mb-8">
      <Text className="text-lg font-bold mb-4">Session Details</Text>

      <Text className="mb-2">Schedule</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
        <View className="flex-row gap-2">
          {DAYS_OF_WEEK.map((day) => (
            <TouchableOpacity
              key={day}
              onPress={() => toggleDay(day)}
              className={`px-3 py-2 rounded-md ${(data.schedule || []).includes(day) ? 'bg-blue-500' : 'bg-gray-200'}`}>
              <Text className={`${(data.schedule || []).includes(day) ? 'text-white' : 'text-gray-700'}`}>{day.slice(0, 3)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

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
