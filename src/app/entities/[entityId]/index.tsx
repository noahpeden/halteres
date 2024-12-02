import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useAuth } from 'src/contexts/AuthContext'
import Button from 'src/app/ui/Button'

export default function Entity() {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(false)
  const { supabase, user } = useAuth()
  const router = useRouter()
  const { entityId } = useLocalSearchParams()
  const [entity, setEntity] = useState(null)

  async function fetchEntityDetails() {
    setLoading(true)
    const { data, error } = await supabase.from('entities').select('*').eq('id', entityId).single()

    if (error) {
      console.error('Error fetching entity:', error)
    } else {
      setEntity(data)
    }

    setLoading(false)
  }

  async function fetchPrograms() {
    setLoading(true)
    const { data, error } = await supabase.from('programs').select('*').eq('entity_id', entityId)

    if (error) {
      console.error('Error fetching programs:', error)
    } else {
      setPrograms(data || [])
    }

    setLoading(false)
  }

  async function createProgram() {
    const { data, error } = await supabase
      .from('programs')
      .insert({
        entity_id: entityId,
        name: '', // Placeholder name
        description: '', // Placeholder description
        duration_weeks: 0, // Default duration
        focus_area: '' // Default focus area
      })
      .select('id') // Retrieve the ID of the newly created program
      .single()

    if (error) {
      console.error('Error creating program:', error)
      return
    }

    router.push(`/entities/${entityId}/programs/${data.id}`)
  }

  useEffect(() => {
    if (user?.id && entityId) {
      fetchEntityDetails()
      fetchPrograms()
    }
  }, [user?.id, entityId])

  return (
    <View className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-500">Loading...</Text>
          </View>
        ) : (
          <>
            <View className="mb-8">
              <Text className="text-lg font-bold">{entity?.name || 'Entity Details'}</Text>
              <Text className="text-sm text-gray-600">{entity?.description || 'No description provided.'}</Text>
            </View>

            <View className="mb-8">
              <Text className="text-lg font-bold mb-4">Programs</Text>
              {programs.length > 0 ? (
                programs.map((program) => (
                  <TouchableOpacity
                    key={program.id}
                    className="p-4 bg-white rounded-lg shadow-sm mb-4"
                    onPress={() => router.push(`/entities/${entityId}/programs/${program.id}`)}>
                    <Text className="text-base font-semibold">{program.name || 'Untitled Program'}</Text>
                    <Text className="text-sm text-gray-600">{program.description || 'No description available.'}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text className="text-sm text-gray-500">No programs found. Create a new one!</Text>
              )}
            </View>

            <Button variant="primary" size="large" onPress={createProgram}>
              Create a New Program
            </Button>
          </>
        )}
      </ScrollView>
    </View>
  )
}
