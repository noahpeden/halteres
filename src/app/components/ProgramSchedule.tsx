import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native'
import { Calendar } from 'react-native-calendars'
import { ChevronDown } from 'lucide-react-native'

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const MAX_WEEKS = 6

export default function ProgramSchedule({ data, onChange }) {
  const [showCalendar, setShowCalendar] = useState(false)
  const [showWeeksDropdown, setShowWeeksDropdown] = useState(false)
  const [selectedDays, setSelectedDays] = useState(data.schedule || [])

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Update end date when start date or weeks change
  useEffect(() => {
    if (data.startDate && data.duration_weeks) {
      const endDateObj = new Date(data.startDate)
      endDateObj.setDate(endDateObj.getDate() + data.duration_weeks * 7 - 1)
      onChange({
        ...data,
        endDate: endDateObj.toISOString().split('T')[0]
      })
    }
  }, [data.startDate, data.duration_weeks])

  // Update schedule when days change
  useEffect(() => {
    onChange({
      ...data,
      schedule: selectedDays
    })
  }, [selectedDays])

  const WeeksDropdownModal = () => (
    <Modal visible={showWeeksDropdown} transparent={true} animationType="fade" onRequestClose={() => setShowWeeksDropdown(false)}>
      <TouchableOpacity activeOpacity={1} onPress={() => setShowWeeksDropdown(false)} className="flex-1 justify-center bg-black/50">
        <View className="mx-4 bg-white rounded-lg overflow-hidden">
          <View className="p-4 border-b border-gray-200">
            <Text className="text-lg font-semibold">Select Program Duration</Text>
          </View>
          {Array.from({ length: MAX_WEEKS }, (_, i) => i + 1).map((week) => (
            <TouchableOpacity
              key={week}
              onPress={() => {
                onChange({ ...data, duration_weeks: week })
                setShowWeeksDropdown(false)
              }}
              className="p-4 border-b border-gray-200">
              <Text>
                {week} {week === 1 ? 'week' : 'weeks'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  )

  return (
    <View className="mb-8">
      <Text className="text-xl font-bold mb-6">Session Details</Text>

      {/* Program Duration */}
      <View className="mb-6">
        <Text className="font-semibold mb-2">Program Duration</Text>
        <TouchableOpacity
          onPress={() => setShowWeeksDropdown(true)}
          className="border border-gray-300 rounded-lg p-4 flex-row justify-between items-center bg-white">
          <Text>{data.duration_weeks ? `${data.duration_weeks} weeks` : 'Select number of weeks'}</Text>
          <ChevronDown size={20} className="text-gray-500" />
        </TouchableOpacity>
        <WeeksDropdownModal />
      </View>

      {/* Workout Days */}
      <View className="mb-6">
        <Text className="font-semibold mb-2">Workout Days</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {DAYS_OF_WEEK.map((day) => (
              <TouchableOpacity
                key={day}
                onPress={() => {
                  const newSelectedDays = selectedDays.includes(day) ? selectedDays.filter((d) => d !== day) : [...selectedDays, day]
                  setSelectedDays(newSelectedDays)
                }}
                className={`px-4 py-3 rounded-lg ${selectedDays.includes(day) ? 'bg-primary' : 'bg-gray-200'}`}>
                <Text className={selectedDays.includes(day) ? 'text-white' : 'text-gray-700'}>{day.substring(0, 3)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Start Date */}
      <View className="mb-6">
        <Text className="font-semibold mb-2">Start Date</Text>
        <TouchableOpacity onPress={() => setShowCalendar(true)} className="border border-gray-300 rounded-lg p-4">
          <Text>{data.startDate ? formatDate(data.startDate) : 'Select start date'}</Text>
        </TouchableOpacity>
      </View>

      {/* End Date (Read-only) */}
      {data.endDate && (
        <View className="mb-6">
          <Text className="font-semibold mb-2">End Date</Text>
          <View className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            <Text>{formatDate(data.endDate)}</Text>
          </View>
        </View>
      )}

      {/* Session Duration */}
      <View>
        <Text className="font-semibold mb-2">Session Duration (Minutes)</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3"
          placeholder="Enter session duration"
          value={data.sessionDuration}
          onChangeText={(text) => onChange({ ...data, sessionDuration: text })}
          keyboardType="numeric"
        />
      </View>

      {/* Calendar Modal */}
      <Modal visible={showCalendar} transparent={true} animationType="slide">
        <View className="flex-1 justify-center bg-black/50">
          <View className="bg-white m-4 rounded-lg overflow-hidden">
            <Calendar
              onDayPress={(day) => {
                onChange({ ...data, startDate: day.dateString })
                setShowCalendar(false)
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
            <TouchableOpacity onPress={() => setShowCalendar(false)} className="p-4 bg-gray-100">
              <Text className="text-center text-gray-600">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}
