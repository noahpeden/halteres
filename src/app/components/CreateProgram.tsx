// app/entities/CreateProgram.js
import React from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { useEntityContext } from 'src/contexts/EntityContext'
import { router } from 'expo-router'

export default function CreateProgram() {
  const { entityData, setEntityData } = useEntityContext()

  const handleProgramNameChange = (value) => {
    setEntityData((prevData) => ({
      ...prevData,
      programName: value
    }))
  }

  const handleNext = () => {
    router.push('/entities/ProgramSchedule')
  }

  return (
    <View className="flex-1 bg-background p-4">
      <Text className="text-lg font-bold mb-4">Create Program</Text>
      <Text className="mb-2">Program Name</Text>
      <TextInput
        className="border border-gray-300 rounded-md p-2 mb-4"
        placeholder="Program Name"
        value={entityData.programName}
        onChangeText={handleProgramNameChange}
      />
      <TouchableOpacity className="bg-orange-500 p-4 rounded-md mt-6" onPress={handleNext}>
        <Text className="text-center text-white font-semibold">Next</Text>
      </TouchableOpacity>
    </View>
  )
}
