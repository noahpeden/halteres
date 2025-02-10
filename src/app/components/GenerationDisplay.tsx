import React, { useState, useEffect, useRef } from 'react'
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native'
import { Edit2, Save } from 'lucide-react-native'

interface WorkoutProgramDisplayProps {
  programText: string
  onProgramChange?: (text: string) => void
}

const WorkoutProgramDisplay: React.FC<WorkoutProgramDisplayProps> = ({ programText, onProgramChange }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedText, setEditedText] = useState(programText)
  const scrollViewRef = useRef<ScrollView>(null)

  useEffect(() => {
    setEditedText(programText)
    if (!isEditing) {
      scrollViewRef.current?.scrollToEnd({ animated: true })
    }
  }, [programText])

  const handleSave = () => {
    if (onProgramChange) {
      onProgramChange(editedText)
    }
    setIsEditing(false)
  }

  if (!programText && !editedText) {
    return (
      <View className="bg-gray-50 rounded-lg p-4">
        <Text className="text-gray-500 text-center">No program generated yet</Text>
      </View>
    )
  }

  return (
    <View className="bg-white rounded-lg shadow-sm">
      <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
        <Text className="text-lg font-semibold">Generated Program</Text>
        <TouchableOpacity
          onPress={isEditing ? handleSave : () => setIsEditing(true)}
          className={`p-2 rounded-full ${isEditing ? 'bg-green-100' : 'bg-blue-100'}`}>
          {isEditing ? <Save size={20} color="#16a34a" /> : <Edit2 size={20} color="#2563eb" />}
        </TouchableOpacity>
      </View>

      <ScrollView ref={scrollViewRef} className="p-4 max-h-[400px]">
        {isEditing ? (
          <TextInput
            className="text-base leading-6"
            multiline
            value={editedText}
            onChangeText={setEditedText}
            textAlignVertical="top"
            style={{ minHeight: 400 }}
          />
        ) : (
          <Text className="text-base leading-6">{editedText}</Text>
        )}
      </ScrollView>
    </View>
  )
}

export default WorkoutProgramDisplay
