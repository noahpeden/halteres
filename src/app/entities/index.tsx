// app/entities/index.tsx
import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { supabase } from 'src/utils/supabase/client'
import EntityCard from 'src/app/shared/EntityCard'
import Button from 'src/app/ui/Button'

export default function EntitiesPage() {
  const [entities, setEntities] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
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
    }
  }

  async function fetchEntities() {
    if (!user) return

    setLoading(true)
    const { data, error } = await supabase.from('entities').select('*').eq('user_id', user.id).order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching entities:', error)
    } else {
      setEntities(data)
    }
    setLoading(false)
  }

  async function deleteEntity(id) {
    const { error } = await supabase.from('entities').delete().eq('id', id)

    if (error) {
      console.error('Error deleting entity:', error)
    } else {
      fetchEntities()
    }
  }

  const filteredEntities = entities.filter((entity) => entity.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <View className="flex-1 bg-background min-h-screen">
      {/* Header */}
      <View className="flex-row px-4 py-2 justify-between items-center bg-white border-b border-[rgba(0,0,0,0.38)] shadow-md">
        <Text className="text-lg font-bold">Halteres.ai</Text>
        <Button variant="login" size="small" onPress={() => router.push('/login')}>
          Login
        </Button>
      </View>

      {/* Search Input */}
      <View className="flex-row items-center p-2 rounded-md bg-gray-200 mx-4 mt-4">
        <TextInput className="flex-1 p-2 text-base" placeholder="Search..." onChangeText={(text) => setSearchQuery(text)} value={searchQuery} />
        <Button
          variant="icon"
          onPress={() => {
            /* Filter logic */
          }}>
          <Text>Filter</Text>
        </Button>
      </View>

      {/* Entity List */}
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
        <View className="flex-1">
          {filteredEntities.map((entity) => (
            <EntityCard key={entity.id} entity={entity} deleteEntity={deleteEntity} />
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity className="absolute bottom-40 right-6 bg-primary rounded-full p-4 shadow-lg" onPress={() => router.push('/entities/new')}>
        <Text className="text-white text-lg font-bold">+</Text>
      </TouchableOpacity>
    </View>
  )
}
