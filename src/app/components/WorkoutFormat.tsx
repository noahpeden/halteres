import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { X, Plus } from 'lucide-react-native'

const DEFAULT_WORKOUT_FORMATS = ['Strength', 'Hypertrophy', 'Endurance', 'HIIT', 'CrossFit', 'Conditioning']
const DEFAULT_FOCUS_AREAS = ['Upper Body', 'Lower Body', 'Full Body', 'Core', 'Cardio', 'Olympic Lifting']

export default function WorkoutFormat({ data, onChange }) {
  const [newFormat, setNewFormat] = useState('')
  const [newFocus, setNewFocus] = useState('')
  const [showFormatInput, setShowFormatInput] = useState(false)
  const [showFocusInput, setShowFocusInput] = useState(false)

  const toggleFormat = (format) => {
    const currentFormats = data.format || []
    const newFormats = currentFormats.includes(format) ? currentFormats.filter((f) => f !== format) : [...currentFormats, format]
    onChange({ ...data, format: newFormats })
  }

  const toggleFocus = (focus) => {
    const currentFocus = data.focus || []
    const newFocus = currentFocus.includes(focus) ? currentFocus.filter((f) => f !== focus) : [...currentFocus, focus]
    onChange({ ...data, focus: newFocus })
  }

  const addCustomFormat = () => {
    if (newFormat.trim()) {
      const currentFormats = data.format || []
      const customFormats = data.customFormats || []
      onChange({
        ...data,
        format: [...currentFormats, newFormat.trim()],
        customFormats: [...customFormats, newFormat.trim()]
      })
      setNewFormat('')
      setShowFormatInput(false)
    }
  }

  const addCustomFocus = () => {
    if (newFocus.trim()) {
      const currentFocus = data.focus || []
      const customFocus = data.customFocus || []
      onChange({
        ...data,
        focus: [...currentFocus, newFocus.trim()],
        customFocus: [...customFocus, newFocus.trim()]
      })
      setNewFocus('')
      setShowFocusInput(false)
    }
  }

  const allFormats = [...DEFAULT_WORKOUT_FORMATS, ...(data.customFormats || [])]
  const allFocusAreas = [...DEFAULT_FOCUS_AREAS, ...(data.customFocus || [])]

  return (
    <View className="mb-8">
      <Text className="text-lg font-bold mb-4">Workout Format</Text>

      <Text className="mb-2">Training Style</Text>
      <View className="flex-row flex-wrap gap-2 mb-4">
        {allFormats.map((format) => (
          <TouchableOpacity
            key={format}
            onPress={() => toggleFormat(format)}
            className={`px-3 py-2 rounded-md ${(data.format || []).includes(format) ? 'bg-blue-500' : 'bg-gray-200'}`}>
            <Text className={`${(data.format || []).includes(format) ? 'text-white' : 'text-gray-700'}`}>{format}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity onPress={() => setShowFormatInput(true)} className="px-3 py-2 rounded-md bg-gray-100 flex-row items-center">
          <Plus size={16} className="text-gray-600" />
          <Text className="text-gray-600 ml-1">Add Custom</Text>
        </TouchableOpacity>
      </View>

      {showFormatInput && (
        <View className="flex-row items-center gap-2 mb-4">
          <TextInput
            className="flex-1 border border-gray-300 rounded-md p-2"
            placeholder="Enter custom training style"
            value={newFormat}
            onChangeText={setNewFormat}
            onSubmitEditing={addCustomFormat}
          />
          <TouchableOpacity onPress={addCustomFormat} className="px-3 py-2 bg-blue-500 rounded-md">
            <Text className="text-white">Add</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowFormatInput(false)} className="p-2">
            <X size={20} className="text-gray-500" />
          </TouchableOpacity>
        </View>
      )}

      <Text className="mb-2">Focus Areas</Text>
      <View className="flex-row flex-wrap gap-2 mb-4">
        {allFocusAreas.map((focus) => (
          <TouchableOpacity
            key={focus}
            onPress={() => toggleFocus(focus)}
            className={`px-3 py-2 rounded-md ${(data.focus || []).includes(focus) ? 'bg-green-500' : 'bg-gray-200'}`}>
            <Text className={`${(data.focus || []).includes(focus) ? 'text-white' : 'text-gray-700'}`}>{focus}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity onPress={() => setShowFocusInput(true)} className="px-3 py-2 rounded-md bg-gray-100 flex-row items-center">
          <Plus size={16} className="text-gray-600" />
          <Text className="text-gray-600 ml-1">Add Custom</Text>
        </TouchableOpacity>
      </View>

      {showFocusInput && (
        <View className="flex-row items-center gap-2 mb-4">
          <TextInput
            className="flex-1 border border-gray-300 rounded-md p-2"
            placeholder="Enter custom focus area"
            value={newFocus}
            onChangeText={setNewFocus}
            onSubmitEditing={addCustomFocus}
          />
          <TouchableOpacity onPress={addCustomFocus} className="px-3 py-2 bg-green-500 rounded-md">
            <Text className="text-white">Add</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowFocusInput(false)} className="p-2">
            <X size={20} className="text-gray-500" />
          </TouchableOpacity>
        </View>
      )}

      <Text className="mt-4 mb-2">Program Instructions</Text>
      <TextInput
        className="border border-gray-300 rounded-md p-3 mb-4 min-h-[80px]"
        placeholder="Enter specific instructions for the program (e.g., 'Focus on explosive movements', 'Include mobility work')"
        value={data.instructions}
        onChangeText={(text) => onChange({ ...data, instructions: text })}
        multiline
        textAlignVertical="top"
      />

      <Text className="mt-2 mb-2">Injuries & Movement Restrictions</Text>
      <TextInput
        className="border border-gray-300 rounded-md p-3 min-h-[80px]"
        placeholder="List any injuries, movements to avoid, or movement restrictions (e.g., 'No overhead pressing', 'Limited jumping')"
        value={data.quirks}
        onChangeText={(text) => onChange({ ...data, quirks: text })}
        multiline
        textAlignVertical="top"
      />
    </View>
  )
}
