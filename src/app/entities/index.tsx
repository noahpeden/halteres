import React, { useState, useEffect } from 'react'
import { Alert } from 'react-native'
import { supabase } from '../../utils/supabase/client'
import { YStack, XStack, Button, Input, Text, ScrollView, Select, Adapt, Sheet } from 'tamagui'
import { Check, ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import { router } from 'expo-router'

const entityTypes = [
  { name: 'CrossFit Class', value: 'crossfit_class' },
  { name: 'Personal Training Client', value: 'personal_training' }
]

export default function EntitiesPage() {
  const [entities, setEntities] = useState([])
  const [newEntityName, setNewEntityName] = useState('')
  const [newEntityType, setNewEntityType] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchEntities()
  }, [])

  async function fetchEntities() {
    setLoading(true)
    const { data, error } = await supabase.from('entities').select('*').order('created_at', { ascending: false })

    if (error) Alert.alert('Error fetching entities', error.message)
    else setEntities(data)
    setLoading(false)
  }

  async function createEntity() {
    if (!newEntityName || !newEntityType) {
      Alert.alert('Please enter a name and select a type for the new entity')
      return
    }

    setLoading(true)
    const { data, error } = await supabase.from('entities').insert({ name: newEntityName, type: newEntityType }).single()

    if (error) Alert.alert('Error creating entity', error.message)
    else {
      setNewEntityName('')
      setNewEntityType('')
      fetchEntities()
    }
    setLoading(false)
  }

  return (
    <ScrollView>
      <YStack padding="$4" gap="$4">
        <Text fontSize="$6" fontWeight="bold">
          Your Entities
        </Text>

        <XStack gap="$2">
          <Input flex={1} placeholder="New entity name" value={newEntityName} onChangeText={setNewEntityName} />
          <Select value={newEntityType} onValueChange={setNewEntityType}>
            <Select.Trigger width={220} iconAfter={ChevronDown}>
              <Select.Value placeholder="Select type" />
            </Select.Trigger>

            <Adapt when="sm" platform="touch">
              <Sheet modal dismissOnSnapToBottom>
                <Sheet.Frame>
                  <Sheet.ScrollView>
                    <Adapt.Contents />
                  </Sheet.ScrollView>
                </Sheet.Frame>
                <Sheet.Overlay />
              </Sheet>
            </Adapt>

            <Select.Content zIndex={200000}>
              <Select.ScrollUpButton alignItems="center" justifyContent="center" height="$3">
                <ChevronUp size={20} />
              </Select.ScrollUpButton>

              <Select.Viewport minWidth={200}>
                <Select.Group>
                  <Select.Label>Entity Types</Select.Label>
                  {entityTypes.map((item, i) => (
                    <Select.Item index={i} key={item.value} value={item.value}>
                      <Select.ItemText>{item.name}</Select.ItemText>
                      <Select.ItemIndicator marginLeft="auto">
                        <Check size={16} />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.Group>
              </Select.Viewport>

              <Select.ScrollDownButton alignItems="center" justifyContent="center" height="$3">
                <ChevronDown size={20} />
              </Select.ScrollDownButton>
            </Select.Content>
          </Select>
          <Button onPress={createEntity} disabled={loading}>
            Add
          </Button>
        </XStack>

        {entities.map((entity) => (
          <XStack key={entity.id} justifyContent="space-between" alignItems="center">
            <Text>
              {entity.name} - {entity.type}
            </Text>
            <Button onPress={() => router.push(`/entity/${entity.id}`)}>Manage</Button>
          </XStack>
        ))}

        {loading && <Text>Loading...</Text>}
      </YStack>
    </ScrollView>
  )
}
