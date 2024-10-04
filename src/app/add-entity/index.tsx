import React, { useState } from 'react'
import { Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { YStack, XStack, Text, Input, Button, View, RadioGroup, Label, H1 } from 'tamagui'
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
    <YStack flex={1} padding="$4" backgroundColor="$background">
      <H1 color="$primary" marginBottom="$4" textAlign="center">
        Add New Entity
      </H1>
      <Input
        placeholder="Entity Name"
        value={name}
        onChangeText={setName}
        backgroundColor="$background"
        padding="$3"
        borderRadius={2}
        marginBottom="$3"
        fontSize="$4"
      />
      <RadioGroup value={type} onValueChange={(value) => setType(value as EntityType)} marginBottom="$4">
        <XStack alignItems="center">
          <RadioGroup.Item value="CLIENT" id="client">
            <RadioGroup.Indicator />
          </RadioGroup.Item>
          <Label htmlFor="client" marginLeft="$2">
            Client
          </Label>
        </XStack>
        <XStack alignItems="center" marginLeft="$4">
          <RadioGroup.Item value="CLASS" id="class">
            <RadioGroup.Indicator />
          </RadioGroup.Item>
          <Label htmlFor="class" marginLeft="$2">
            Class
          </Label>
        </XStack>
      </RadioGroup>
      <Button backgroundColor="$primary" onPress={handleSubmit} padding="$3" borderRadius={2}>
        <Text color="$background" fontWeight="bold" fontSize="$4">
          Add Entity
        </Text>
      </Button>
    </YStack>
  )
}

export default AddEntity
