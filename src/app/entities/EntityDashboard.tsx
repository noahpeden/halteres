import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { router } from 'expo-router'
import EntityCard from 'src/app/components/ui/Card'
import Button from 'src/app/components/ui/Button'
import { useAuth } from 'src/contexts/AuthContext'
import Card from 'src/app/components/ui/Card'

export default function Dashboard() {
  const [entities, setEntities] = useState([])
  const [loading, setLoading] = useState(false)
  const { supabase, user } = useAuth()

  async function fetchEntities() {
    setLoading(true)
    const { data, error } = await supabase.from('entities').select('*')

    if (error) {
      console.error('Error fetching entities:', error)
    } else {
      setEntities(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchEntities()
  }, [user?.id])

  async function deleteEntity(id) {
    const { error } = await supabase.from('entities').delete().eq('id', id)

    if (error) {
      console.error('Error deleting entity:', error)
    } else {
      fetchEntities()
    }
  }

  const classes = entities.filter((entity) => entity.type === 'CLASS')
  const clients = entities.filter((entity) => entity.type === 'CLIENT')

  return (
    <View className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
        <Text className="text-lg font-bold mb-4">Entities</Text>
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-500">Loading entities...</Text>
          </View>
        ) : (
          <View>
            {classes.length > 0 && (
              <View className="mb-8">
                <Text className="text-md font-bold mb-4">Classes</Text>
                {classes.map((entity) => (
                  <Card type="entity" key={entity.id} item={entity} onDelete={deleteEntity} />
                ))}
              </View>
            )}
            {clients.length > 0 && (
              <View>
                <Text className="text-md font-bold mb-4">Clients</Text>
                {clients.map((entity) => (
                  <Card type="entity" key={entity.id} item={entity} onDelete={deleteEntity} />
                ))}
              </View>
            )}
          </View>
        )}
        <View className="flex-[0.2]">
          <Button variant="primary" size="large" onPress={() => router.push('/entities/new')}>
            Create a New Entity
          </Button>
        </View>
      </ScrollView>
    </View>
  )
}
