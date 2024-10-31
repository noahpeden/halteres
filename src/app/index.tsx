import React from 'react'
import { useRouter } from 'expo-router'
import { useAuth } from 'src/contexts/AuthContext'
import { View, Text, Image, ScrollView, useWindowDimensions } from 'react-native'
import LOGO_IMG from '../assets/images/logo.png'
import SCREENS from 'src/assets/images/screens.png'
import Button from 'src/app/ui/Button'

const HomePage = () => {
  const { session } = useAuth()
  const router = useRouter()
  const { height: windowHeight } = useWindowDimensions()

  const handleGetStarted = () => {
    if (session) {
      router.push('/entities')
    } else {
      router.push('/login')
    }
  }

  const handleLearnMore = () => {
    router.push('/about')
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 bg-background min-h-screen">
        {/* Header */}
        <View className="flex-row px-4 py-2 justify-between items-center bg-white border-b border-[rgba(0,0,0,0.38)]">
          <Image source={LOGO_IMG} resizeMode="contain" className="w-[150px] h-[40px]" />
          <Button variant="login" size="small" onPress={() => router.push('/login')}>
            Login
          </Button>
        </View>

        {/* Hero Section */}
        <View className="flex-1 px-4 py-6 items-center bg-background-secondary">
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
              <Button variant="secondary" size="large" onPress={handleLearnMore}>
                Learn More
              </Button>
            </View>
          </View>

          {/* Dashboard Preview */}
          <View className="mt-6 w-full max-w-[1000px] bg-white rounded-lg shadow-lg">
            <Image source={SCREENS} className="w-full h-[500px] rounded-lg opacity-90" resizeMode="cover" />
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default HomePage
