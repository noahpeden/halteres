// app/entities/EntityCreation.js
import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'
import { useEntityContext } from 'src/contexts/EntityContext'
import { router } from 'expo-router'

export default function EntityCreation() {
  const { setEntityData } = useEntityContext() // Access the setEntityData function from context
  const [userType, setUserType] = useState('Class')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const userTypeOptions = [
    { label: 'Class', value: 'Class' },
    { label: 'Client', value: 'Client' }
  ]

  const handleSaveEntity = () => {
    // Save the entity data to context
    setEntityData((prevData) => ({
      ...prevData,
      userType,
      title,
      description
    }))

    // Navigate to the CreateProgram screen
    router.push('/entities/CreateProgram')
  }

  return (
    <View className="flex-1 bg-background p-4">
      <Text className="text-lg font-bold mb-4">Create Entity</Text>

      {/* User Type Dropdown */}
      <Text className="mb-2">User Type</Text>
      <Dropdown
        style={{
          borderColor: '#D1D5DB', // border color to match Tailwind's gray-300
          borderWidth: 1,
          borderRadius: 8,
          padding: 12
        }}
        placeholderStyle={{ color: '#9CA3AF' }} // Tailwind's text-gray-400 color
        selectedTextStyle={{ fontSize: 16, color: '#111827' }} // Tailwind's text-gray-900 color
        data={userTypeOptions}
        labelField="label"
        valueField="value"
        placeholder="Select User Type"
        value={userType}
        onChange={(item) => setUserType(item.value)}
      />

      {/* Title Input */}
      <Text className="mt-6 mb-2">Title</Text>
      <TextInput className="border border-gray-300 rounded-md p-2 mb-4" placeholder="Class Name" value={title} onChangeText={setTitle} />

      {/* Description Input */}
      <Text className="mb-2">Description</Text>
      <TextInput
        className="border border-gray-300 rounded-md p-2"
        placeholder="Class description, e.g., Friday morning HIIT class..."
        value={description}
        onChangeText={setDescription}
        multiline
      />

      {/* Next Button */}
      <TouchableOpacity className="bg-orange-500 p-4 rounded-md mt-6" onPress={handleSaveEntity}>
        <Text className="text-center text-white font-semibold">Next</Text>
      </TouchableOpacity>
    </View>
  )
}
