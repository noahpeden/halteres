import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native'
import { Calendar } from 'react-native-calendars'

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function SessionDetails({ data, onChange }) {
  const [showStartDatePicker, setShowStartDatePicker] = useState(false)
  const [showEndDatePicker, setShowEndDatePicker] = useState(false)

  const toggleDay = (day) => {
    const currentSchedule = data.schedule || []
    const newSchedule = currentSchedule.includes(day) ? currentSchedule.filter((d) => d !== day) : [...currentSchedule, day]
    onChange({ ...data, schedule: newSchedule })
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <View className="mb-8">
      <Text className="text-lg font-bold mb-4">Session Details</Text>
      <View className="mb-4">
        <Text className="mb-2">Start Date</Text>
        <TouchableOpacity onPress={() => setShowStartDatePicker(true)} className="border border-gray-300 rounded-md p-3 bg-white">
          <Text>{data.startDate ? formatDate(data.startDate) : 'Select start date'}</Text>
        </TouchableOpacity>
      </View>

      <View className="mb-4">
        <Text className="mb-2">End Date</Text>
        <TouchableOpacity onPress={() => setShowEndDatePicker(true)} className="border border-gray-300 rounded-md p-3 bg-white">
          <Text>{data.endDate ? formatDate(data.endDate) : 'Select end date'}</Text>
        </TouchableOpacity>
      </View>

      <Text className="mb-2">Weekly Schedule</Text>
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

      <Text className="mb-2">Session Duration (Minutes)</Text>
      <TextInput
        className="border border-gray-300 rounded-md p-2 mb-4"
        placeholder="Enter session duration"
        value={data.sessionDuration}
        onChangeText={(text) => onChange({ ...data, sessionDuration: text })}
        keyboardType="numeric"
      />

      {/* Start Date Calendar Modal */}
      <Modal visible={showStartDatePicker} transparent={true} animationType="slide">
        <View className="flex-1 justify-center bg-black/50">
          <View className="bg-white m-4 rounded-lg overflow-hidden">
            <Calendar
              onDayPress={(day) => {
                onChange({ ...data, startDate: day.dateString })
                setShowStartDatePicker(false)
              }}
              markedDates={
                data.startDate
                  ? {
                      [data.startDate]: { selected: true, selectedColor: '#3b82f6' }
                    }
                  : {}
              }
              minDate={new Date().toISOString().split('T')[0]}
            />
            <TouchableOpacity onPress={() => setShowStartDatePicker(false)} className="p-4 bg-gray-100">
              <Text className="text-center text-gray-600">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showEndDatePicker} transparent={true} animationType="slide">
        <View className="flex-1 justify-center bg-black/50">
          <View className="bg-white m-4 rounded-lg overflow-hidden">
            <Calendar
              onDayPress={(day) => {
                onChange({ ...data, endDate: day.dateString })
                setShowEndDatePicker(false)
              }}
              markedDates={
                data.endDate
                  ? {
                      [data.endDate]: { selected: true, selectedColor: '#3b82f6' }
                    }
                  : {}
              }
              minDate={data.startDate || new Date().toISOString().split('T')[0]}
            />
            <TouchableOpacity onPress={() => setShowEndDatePicker(false)} className="p-4 bg-gray-100">
              <Text className="text-center text-gray-600">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}
