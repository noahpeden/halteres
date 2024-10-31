import React, { useState, useEffect } from 'react'
import { Alert, ScrollView, View, Text, TextInput, TouchableOpacity } from 'react-native'
import { supabase } from '../../utils/supabase/client'
import { Picker } from '@react-native-picker/picker'
import { router } from 'expo-router'

const entityTypes = [
  { name: 'CrossFit Class', value: 'CLASS' },
  { name: 'Personal Training Client', value: 'CLIENT' }
]

export default function EntitiesPage() {
  const [entities, setEntities] = useState([])
  const [newEntityName, setNewEntityName] = useState('')
  const [newEntityType, setNewEntityType] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const {
      data: { user: authUser }
    } = await supabase.auth.getUser()
    if (authUser) {
      setUser(authUser)
      fetchEntities()
    } else {
      Alert.alert('Authentication required', 'Please log in to view and manage entities')
    }
  }

  async function fetchEntities() {
    if (!user) return

    setLoading(true)
    const { data, error } = await supabase.from('entities').select('*').eq('user_id', user.id).order('created_at', { ascending: false })

    if (error) Alert.alert('Error fetching entities', error.message)
    else setEntities(data)
    setLoading(false)
  }

  async function createEntity() {
    if (!user) {
      Alert.alert('Authentication required', 'Please log in to create an entity')
      return
    }

    if (!newEntityName || !newEntityType) {
      Alert.alert('Please enter a name and select a type for the new entity')
      return
    }

    setLoading(true)
    const { data, error } = await supabase
      .from('entities')
      .insert({
        name: newEntityName,
        type: newEntityType,
        user_id: user.id,
        details: {}, // Add an empty JSONB object for the details column
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .single()

    if (error) {
      console.error('Error creating entity:', error)
      Alert.alert('Error creating entity', error.message)
    } else {
      setNewEntityName('')
      setNewEntityType('')
      fetchEntities()
    }
    setLoading(false)
  }

  if (!user) {
    return (
      <View className="p-4">
        <Text>Please log in to view and manage entities.</Text>
      </View>
    )
  }

  return (
    <ScrollView className="bg-white">
      <View className="p-4 space-y-4">
        <Text className="text-2xl font-bold">Your Entities</Text>

        <View className="flex-row space-x-2">
          <TextInput
            className="flex-1 border border-gray-300 rounded-md p-2"
            placeholder="New entity name"
            value={newEntityName}
            onChangeText={setNewEntityName}
          />
          <Picker selectedValue={newEntityType} onValueChange={(itemValue) => setNewEntityType(itemValue)} style={{ width: 220 }}>
            <Picker.Item label="Select type" value="" />
            {entityTypes.map((item) => (
              <Picker.Item key={item.value} label={item.name} value={item.value} />
            ))}
          </Picker>
          <TouchableOpacity className={`bg-blue-500 p-2 rounded-md ${loading ? 'opacity-50' : ''}`} onPress={createEntity} disabled={loading}>
            <Text className="text-white">Add</Text>
          </TouchableOpacity>
        </View>
        {entities.map((entity) => (
          <View key={entity.id} className="flex-row justify-between items-center">
            <Text>
              {entity.name} - {entity.type}
            </Text>
            <TouchableOpacity className="bg-blue-500 p-2 rounded-md" onPress={() => router.push(`/entity/${entity.id}`)}>
              <Text className="text-white">Manage</Text>
            </TouchableOpacity>
          </View>
        ))}

        {loading && <Text>Loading...</Text>}
      </View>
    </ScrollView>
  )
}
