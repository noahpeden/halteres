import React, { useState } from 'react'
import { Alert, View, Text, TextInput, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { useEntities } from 'src/hooks/useEntities'
import { useAuth } from 'src/contexts/AuthContext'

type EntityType = 'CLIENT' | 'CLASS'

const AddEntity = () => {
  const [name, setName] = useState('')
  const [type, setType] = useState<EntityType>('CLIENT')
  const { session } = useAuth()

  const { addEntity } = useEntities(session?.user?.id)
  const router = useRouter()

  const handleSubmit = async () => {
    if (name && type) {
      try {
        await addEntity({
          user_id: session?.user?.id,
          name,
          type,
          details: ''
        })
        Alert.alert('Success', 'Entity added successfully')
        router.back()
      } catch (error) {
        Alert.alert('Error', 'Failed to add entity. Please try again.')
        console.error(error)
      }
    } else {
      Alert.alert('Error', 'Please fill in all fields')
    }
  }

  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-3xl font-bold text-blue-600 mb-4 text-center">Add New Entity</Text>
      <TextInput placeholder="Entity Name" value={name} onChangeText={setName} className="bg-gray-100 p-3 rounded-md mb-3 text-lg" />
      <View className="flex-row mb-4">
        <TouchableOpacity
          onPress={() => setType('CLIENT')}
          className={`flex-row items-center mr-4 ${type === 'CLIENT' ? 'opacity-100' : 'opacity-50'}`}>
          <View className={`w-5 h-5 rounded-full border-2 ${type === 'CLIENT' ? 'bg-blue-600 border-blue-600' : 'border-gray-400'}`} />
          <Text className="ml-2">Client</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setType('CLASS')} className={`flex-row items-center ${type === 'CLASS' ? 'opacity-100' : 'opacity-50'}`}>
          <View className={`w-5 h-5 rounded-full border-2 ${type === 'CLASS' ? 'bg-blue-600 border-blue-600' : 'border-gray-400'}`} />
          <Text className="ml-2">Class</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={handleSubmit} className="bg-blue-600 p-3 rounded-md">
        <Text className="text-white font-bold text-lg text-center">Add Entity</Text>
      </TouchableOpacity>
    </View>
  )
}

export default AddEntity
