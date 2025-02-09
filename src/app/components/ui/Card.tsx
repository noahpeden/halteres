import React from 'react'
import { X } from 'lucide-react-native'
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
} from 'src/app/components/ui/AlertDialog'
import { View, Text, TouchableOpacity } from 'react-native'

interface Entity {
  id: string
  user_id: string
  name: string
  description: string
  created_at: string
  updated_at: string
  type: 'CLASS' | 'CLIENT'
  bench_1rm: number | null
  deadlift_1rm: number | null
  squat_1rm: number | null
  mile_time: number | null
  gender: string | null
  height_cm: number | null
  weight_kg: number | null
}

interface Program {
  id: string
  name: string
  description: string
}

interface BaseCardProps {
  onDelete: (id: string) => Promise<void>
}

interface EntityCardProps extends BaseCardProps {
  type: 'entity'
  item: Entity
}

interface ProgramCardProps extends BaseCardProps {
  type: 'program'
  item: Program
  entityId: string
}

type CardProps = EntityCardProps | ProgramCardProps

export default function Card({ item, type, onDelete, entityId }: CardProps) {
  const getDescription = () => {
    if (type === 'entity') {
      return typeof item.description === 'string'
        ? item.description
        : item.type === 'CLASS'
          ? 'Class'
          : `Client since ${new Date(item.created_at).toLocaleDateString('en-US', {
              month: 'short',
              year: 'numeric'
            })}`
    }
    return item.description || 'No description available'
  }

  const getNavigationPath = () => {
    if (type === 'entity') {
      return `/entities/${item.id}`
    }
    return `/entities/${entityId}/programs/${item.id}`
  }

  const getDeleteMessage = () => {
    if (type === 'entity') {
      return 'This will permanently delete the entity and all associated programs.'
    }
    return 'This will permanently delete the program and all associated workouts.'
  }

  return (
    <View className="flex-row items-center justify-between p-4 bg-white rounded-lg shadow-sm mb-4">
      <View className="flex-row items-center flex-1">
        <View className="flex-1">
          <Text className="text-base font-semibold text-text-primary mb-0.5">{item.name}</Text>
          <Text className="text-sm text-text-secondary">{getDescription()}</Text>
        </View>
      </View>

      <View className="flex-row items-center gap-2">
        <TouchableOpacity className="px-4 py-2 rounded-lg bg-primary-light" onPress={() => router.push(getNavigationPath())}>
          <Text className="text-primary font-semibold">{type === 'entity' ? 'View' : 'View and Edit'}</Text>
        </TouchableOpacity>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <TouchableOpacity className="p-2 bg-red-100 rounded-full">
              <X color="#EF4444" size={20} />
            </TouchableOpacity>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete {item.name}?</AlertDialogTitle>
              <AlertDialogDescription>{getDeleteMessage()}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-red-500 text-white" onPress={() => onDelete(item.id)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </View>
    </View>
  )
}
