import React from 'react'
import { useRouter } from 'expo-router'
import { useAuth } from 'src/contexts/AuthContext'
import { View, Text, Image, ScrollView } from 'react-native'
import SCREENS from 'src/assets/images/screens.png'
import Button from 'src/app/components/ui/Button'

const HomePage = () => {
  const { session } = useAuth()
  const router = useRouter()

  const handleGetStarted = () => {
    if (session) {
      router.push('/entities')
    } else {
      router.push('/login')
    }
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 bg-background min-h-screen">
        <View className="flex-1 px-4 py-6 items-center">
          <View className="gap-4 max-w-[800px] items-center">
            <View className="gap-4 text-center">
              <Text className="text-4xl text-center font-bold text-text-primary">Elevate Your Fitness Programming</Text>
              <Text className="text-4xl text-center font-bold text-primary">with HalteresAI</Text>
            </View>

            <Text className="text-lg text-center text-text-secondary max-w-[600px]">
              AI-Powered, Personalized Workouts for CrossFit Gyms, Coaches, and Health Professionals
            </Text>

            <View className="gap-4 mt-4">
              <Button variant="primary" size="large" onPress={handleGetStarted}>
                Get Started
              </Button>
            </View>
          </View>

          <View className="mt-6 w-full max-w-[1000px]">
            <Image source={SCREENS} className="w-full h-[500px] rounded-lg opacity-90" resizeMode="cover" />
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default HomePage
