import React from 'react'
import { MoreVertical } from 'lucide-react-native'
import { router } from 'expo-router'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from 'src/app/ui/AlertDialog'
import { View, Text, TouchableOpacity, Image } from 'react-native'
const PLACEHOLDER_AVATAR = '/api/placeholder/40/40'

export default function EntityCard({ entity, deleteEntity }) {
  console.log('Rendering EntityCard for:', entity)

  const memberCount = entity.details?.members?.length || 0
  const descriptionText =
    typeof entity.description === 'string'
      ? entity.description
      : entity.type === 'CLASS'
        ? `+${memberCount} members`
        : `Client since ${new Date(entity.created_at).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric'
          })}`

  return (
    <View className="flex-row items-center justify-between p-4 bg-white rounded-lg shadow-sm mb-4">
      <View className="flex-row items-center flex-1">
        <Image source={{ uri: entity.details?.avatar || PLACEHOLDER_AVATAR }} className="w-10 h-10 rounded-full mr-4" />
        <View className="flex-1">
          <Text className="text-base font-semibold text-text-primary mb-0.5">{entity.name}</Text>
          <Text className="text-sm text-text-secondary">{descriptionText}</Text>
        </View>
      </View>

      <View className="flex-row items-center gap-2">
        <TouchableOpacity className="px-4 py-2 rounded-lg bg-primary-light" onPress={() => router.push(`/entities/${entity.id}`)}>
          <Text className="text-primary font-semibold">Select</Text>
        </TouchableOpacity>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <TouchableOpacity className="p-2">
              <MoreVertical className="text-text-secondary" size={20} />
            </TouchableOpacity>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete {entity.name}?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the entity and all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-red-500 text-white" onPress={() => deleteEntity(entity.id)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </View>
    </View>
  )
}
