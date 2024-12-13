import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useAuth } from 'src/contexts/AuthContext'
import Button from 'src/app/components/ui/Button'
import Card from 'src/app/components/ui/Card'

export default function EntityProgramsPage() {
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

  async function deleteProgram(programId: string) {
    Alert.alert('Delete Program', 'Are you sure you want to delete this program? This action cannot be undone.', [
      {
        text: 'Cancel',
        style: 'cancel'
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase.from('programs').delete().eq('id', programId)

          if (error) {
            console.error('Error deleting program:', error)
            Alert.alert('Error', 'Failed to delete program')
          } else {
            // Refresh programs list after deletion
            fetchPrograms()
          }
        }
      }
    ])
  }

  async function createProgram() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('programs')
        .insert({
          entity_id: entityId,
          name: 'New Program',
          description: '',
          duration_weeks: 0,
          focus_area: ''
        })
        .select('id')
        .single()

      if (error) {
        throw error
      }

      // Navigate to the new program
      router.push(`/entities/${entityId}/programs/${data.id}`)
    } catch (error) {
      console.error('Error creating program:', error)
      Alert.alert('Error', 'Failed to create program')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEntityDetails()
    fetchPrograms()
  }, [user?.id, entityId])
  console.log(programs)
  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }} // Add padding at bottom
      >
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
                programs.map((program) => <Card type="program" key={program.id} item={program} onDelete={deleteProgram} />)
              ) : (
                <Text className="text-sm text-gray-500">No programs found. Create a new one!</Text>
              )}
            </View>

            <View className="mt-auto">
              <Button variant="primary" size="large" onPress={createProgram} disabled={loading}>
                Create a New Program
              </Button>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  )
}
