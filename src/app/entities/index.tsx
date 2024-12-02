// app/entities/index.tsx
import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { supabase } from 'src/utils/supabase/client'
import EntityCard from 'src/app/shared/EntityCard'
import Button from 'src/app/ui/Button'
import FloatingActionButton from 'src/components/FloatingActionButton'

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

  return (
    <View className="flex-1 bg-background min-h-screen">
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
        <View className="flex-1">
          {entities.map((entity) => (
            <EntityCard key={entity.id} entity={entity} deleteEntity={deleteEntity} />
          ))}
        </View>
      </ScrollView>
      <FloatingActionButton onPress={() => router.push('/entities/new')} />
    </View>
  )
}
