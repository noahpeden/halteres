import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'
import { useAuth } from 'src/contexts/AuthContext'

export default function EntityCreation() {
  const { supabase, user } = useAuth()
  const [userType, setUserType] = useState('Class')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const userTypeOptions = [
    { label: 'Class', value: 'CLASS' },
    { label: 'Client', value: 'CLIENT' }
  ]

  const handleSaveEntity = async () => {
    if (!title || !description) {
      Alert.alert('Error', 'Please fill out all fields.')
      return
    }

    try {
      const { error } = await supabase.from('entities').insert({
        type: userType,
        name: title,
        description,
        user_id: user?.id
      })

      if (error) {
        throw error
      }

      Alert.alert('Success', `${userType} saved successfully!`)
      setTitle('')
      setDescription('')
      setUserType('Class')
    } catch (err) {
      console.error('Error saving entity:', err)
      Alert.alert('Error', 'There was a problem saving the entity.')
    }
  }

  return (
    <View className="flex-1 bg-background p-4">
      <Text className="text-lg font-bold mb-4">Create Class or Client</Text>
      <Dropdown
        style={{
          borderColor: '#D1D5DB',
          borderWidth: 1,
          borderRadius: 8,
          padding: 12
        }}
        placeholderStyle={{ color: '#9CA3AF' }}
        selectedTextStyle={{ fontSize: 16, color: '#111827' }}
        data={userTypeOptions}
        labelField="label"
        valueField="value"
        placeholder="Select User Type"
        value={userType}
        onChange={(item) => setUserType(item.value)}
      />
      <Text className="mt-6 mb-2">Name</Text>
      <TextInput
        className="border border-gray-300 rounded-md p-2 mb-4"
        placeholder={userType === 'Client' ? 'Courtney Masters' : '8am conditioning class'}
        value={title}
        onChangeText={setTitle}
      />

      {/* Description Input */}
      <Text className="mb-2">Description</Text>
      <TextInput
        className="border border-gray-300 rounded-md p-2"
        placeholder={
          userType === 'Client' ? 'Age 34, 3 years experience in lifting, former bodybuilder, works out 5x per week' : 'Crossfit class for all levels'
        }
        value={description}
        onChangeText={setDescription}
        multiline
      />

      {/* Next Button */}
      <TouchableOpacity className="bg-primary p-4 rounded-md mt-6" onPress={handleSaveEntity}>
        <Text className="text-center text-white font-semibold">Save</Text>
      </TouchableOpacity>
    </View>
  )
}
