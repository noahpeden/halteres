import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useEntityContext } from 'src/contexts/EntityContext'
import { router } from 'expo-router'
import { format, differenceInDays, addDays } from 'date-fns'
import DayCheckbox from 'src/app/ui/DayCheckbox' // Import your custom checkbox component

export default function SessionDetails() {
  const { entityData, setEntityData } = useEntityContext()
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [showStartDatePicker, setShowStartDatePicker] = useState(false)
  const [showEndDatePicker, setShowEndDatePicker] = useState(false)

  const [selectedDays, setSelectedDays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false
  })

  const handleDateChange = (key, selectedDate) => {
    const formattedDate = format(selectedDate, 'yyyy-MM-dd')
    if (key === 'start') {
      setStartDate(selectedDate)
      handleChange('startDate', formattedDate)
    } else {
      setEndDate(selectedDate)
      handleChange('endDate', formattedDate)
    }
  }

  const handleChange = (key, value) => {
    setEntityData((prevData) => ({
      ...prevData,
      sessionDetails: {
        ...prevData.sessionDetails,
        [key]: value
      }
    }))
  }

  const handleDayChange = (day) => {
    setSelectedDays((prevDays) => ({
      ...prevDays,
      [day]: !prevDays[day]
    }))
  }

  const calculateTotalWorkouts = () => {
    if (startDate && endDate) {
      const dayDifference = differenceInDays(endDate, startDate) + 1
      const selectedScheduleDays = Object.keys(selectedDays)
        .filter((day) => selectedDays[day]) // Only include selected days
        .map((day) => day.toLowerCase())

      const workoutDays = Array.from({ length: dayDifference }, (_, i) => {
        const day = addDays(startDate, i)
        return format(day, 'EEEE').toLowerCase()
      }).filter((day) => selectedScheduleDays.includes(day))

      handleChange('totalWorkouts', workoutDays.length)
    }
  }

  useEffect(() => {
    calculateTotalWorkouts()
  }, [startDate, endDate, selectedDays])

  console.log(entityData.sessionDetails.totalWorkouts)

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

      <Text>Session Start Date</Text>
      <TouchableOpacity className="border border-gray-300 rounded-md p-2 mb-4" onPress={() => setShowStartDatePicker(true)}>
        <Text>{startDate ? format(startDate, 'yyyy-MM-dd') : 'Select Start Date'}</Text>
      </TouchableOpacity>
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowStartDatePicker(false)
            if (selectedDate) handleDateChange('start', selectedDate)
          }}
        />
      )}

      <Text>Session End Date</Text>
      <TouchableOpacity className="border border-gray-300 rounded-md p-2 mb-4" onPress={() => setShowEndDatePicker(true)}>
        <Text>{endDate ? format(endDate, 'yyyy-MM-dd') : 'Select End Date'}</Text>
      </TouchableOpacity>
      {showEndDatePicker && (
        <DateTimePicker
          value={endDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowEndDatePicker(false)
            if (selectedDate) handleDateChange('end', selectedDate)
          }}
        />
      )}

      <Text>Session Schedule</Text>
      {Object.keys(selectedDays).map((day) => (
        <DayCheckbox key={day} day={day} isSelected={selectedDays[day]} onPress={() => handleDayChange(day)} />
      ))}

      <TouchableOpacity className="bg-orange-500 p-4 rounded-md mt-6" onPress={handleNext}>
        <Text className="text-center text-white font-semibold">Next</Text>
      </TouchableOpacity>
    </View>
  )
}
