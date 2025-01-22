import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import Button from './ui/Button'

type Gender = 'male' | 'female' | 'other'

interface ClientMetricsData {
  gender?: Gender
  height_cm?: number
  weight_kg?: number
  bench_1rm?: number
  squat_1rm?: number
  deadlift_1rm?: number
  mile_time?: number
}

interface ClientMetricsProps {
  data: ClientMetricsData
  onSave: (updatedData: ClientMetricsData) => void
}

export default function ClientMetrics({ data, onSave }: ClientMetricsProps) {
  const [formData, setFormData] = useState<ClientMetricsData>({ ...data })
  const [feet, setFeet] = useState<number>(Math.floor((data.height_cm || 0) / 30.48))
  const [inches, setInches] = useState<number>(Math.round(((data.height_cm || 0) / 2.54) % 12))
  const [weightInPounds, setWeightInPounds] = useState<number>(Math.round((data.weight_kg || 0) * 2.20462))
  const [benchMax, setBenchMax] = useState<number>(Math.round((data.bench_1rm || 0) * 2.20462))
  const [squatMax, setSquatMax] = useState<number>(Math.round((data.squat_1rm || 0) * 2.20462))
  const [deadliftMax, setDeadliftMax] = useState<number>(Math.round((data.deadlift_1rm || 0) * 2.20462))

  const toCm = (feet: number, inches: number) => Math.round((feet * 12 + inches) * 2.54)
  const toKg = (lbs: number) => Math.round(lbs / 2.20462)

  const handleSave = () => {
    const updatedData = {
      ...formData,
      height_cm: toCm(feet, inches),
      weight_kg: toKg(weightInPounds),
      bench_1rm: toKg(benchMax),
      squat_1rm: toKg(squatMax),
      deadlift_1rm: toKg(deadliftMax)
    }
    onSave(updatedData)
  }

  return (
    <View className="mb-8">
      <Text className="text-xl font-bold mb-6">Client Metrics</Text>

      {/* Gender Selection */}
      <View className="mb-4">
        <Text className="font-semibold mb-2">Gender</Text>
        <View className="flex-row gap-4">
          {['male', 'female', 'other'].map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => setFormData({ ...formData, gender: option as Gender })}
              className={`px-4 py-2 rounded-lg ${formData.gender === option ? 'bg-primary' : 'bg-gray-200'}`}>
              <Text className={formData.gender === option ? 'text-white' : 'text-gray-700'}>{option.charAt(0).toUpperCase() + option.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Height */}
      <View className="flex-row gap-4 mb-4">
        <View className="flex-1">
          <Text className="font-semibold mb-2">Height (Feet)</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3"
            keyboardType="numeric"
            value={feet.toString()}
            onChangeText={(text) => setFeet(parseInt(text) || 0)}
            placeholder="Feet"
          />
        </View>
        <View className="flex-1">
          <Text className="font-semibold mb-2">Height (Inches)</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3"
            keyboardType="numeric"
            value={inches.toString()}
            onChangeText={(text) => setInches(parseInt(text) || 0)}
            placeholder="Inches"
          />
        </View>
      </View>

      {/* Weight */}
      <View className="mb-4">
        <Text className="font-semibold mb-2">Weight (lbs)</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3"
          keyboardType="numeric"
          value={weightInPounds.toString()}
          onChangeText={(text) => setWeightInPounds(parseInt(text) || 0)}
          placeholder="Weight in pounds"
        />
      </View>

      {/* 1 Rep Maxes */}
      <Text className="font-semibold mb-2">1 Rep Maxes (lbs)</Text>
      <View className="flex-row gap-4 mb-4">
        <View className="flex-1">
          <TextInput
            className="border border-gray-300 rounded-lg p-3"
            keyboardType="numeric"
            value={benchMax.toString()}
            onChangeText={(text) => setBenchMax(parseInt(text) || 0)}
            placeholder="Bench Press"
          />
          <Text className="text-xs text-gray-500 mt-1">Bench Press</Text>
        </View>
        <View className="flex-1">
          <TextInput
            className="border border-gray-300 rounded-lg p-3"
            keyboardType="numeric"
            value={squatMax.toString()}
            onChangeText={(text) => setSquatMax(parseInt(text) || 0)}
            placeholder="Squat"
          />
          <Text className="text-xs text-gray-500 mt-1">Squat</Text>
        </View>
        <View className="flex-1">
          <TextInput
            className="border border-gray-300 rounded-lg p-3"
            keyboardType="numeric"
            value={deadliftMax.toString()}
            onChangeText={(text) => setDeadliftMax(parseInt(text) || 0)}
            placeholder="Deadlift"
          />
          <Text className="text-xs text-gray-500 mt-1">Deadlift</Text>
        </View>
      </View>

      {/* Save Button */}
      <Button variant="primary" size="medium" onPress={handleSave} className="bg-primary text-white rounded-lg">
        Save Metrics
      </Button>
    </View>
  )
}
