import React from 'react'
import { useRouter } from 'expo-router'
import { useAuth } from 'src/contexts/AuthContext'
import { View, Text, Image, ScrollView, Platform } from 'react-native'
import SCREENS from 'src/assets/images/screens.png'
import Button from 'src/app/components/ui/Button'
import CrossPlatformScrollView from './CrossPlatformScrollView'

const HomePage = () => {
  const { session } = useAuth()
  const router = useRouter()

  const handleGetStarted = () => {
    if (session) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }

  return (
    <CrossPlatformScrollView>
      <View className="flex-1 bg-background">
        {/* Hero Section */}
        <View className="w-full max-w-[1200px] px-4 md:px-6 py-12 md:py-24">
          <View className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left Column - Text Content */}
            <View className="flex-1 max-w-[600px]">
              <Text className="text-3xl md:text-5xl font-bold text-text-primary mb-4">
                Elevate Your Fitness Programming
                <Text className="text-primary"> with HalteresAI</Text>
              </Text>
              <Text className="text-lg text-text-secondary mb-8">
                AI-powered, personalized workouts designed to help fitness professionals create comprehensive training programs with confidence.
              </Text>
              <Button variant="primary" size="large" onPress={handleGetStarted} className="w-full md:w-auto">
                Get Started
              </Button>
            </View>

            {/* Right Column - Image */}
            <View className="flex-1 w-full md:w-1/2">
              <Image source={SCREENS} className="w-full h-[300px] md:h-[500px] rounded-lg shadow-lg" resizeMode="cover" />
            </View>
          </View>
        </View>

        {/* Features Section */}
        <View className="bg-background-secondary w-full py-16">
          <View className="max-w-[1200px] px-4 md:px-6">
            <Text className="text-2xl md:text-3xl font-bold text-text-primary text-center mb-12">The HalteresAI Advantage</Text>

            <View className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <View key={index} className="bg-surface p-6 rounded-lg shadow-sm">
                  <Text className="text-xl font-semibold text-text-primary mb-3">{feature.title}</Text>
                  <Text className="text-text-secondary">{feature.description}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </CrossPlatformScrollView>
  )
}

const features = [
  {
    title: 'Personalized Workouts',
    description: 'Create custom training programs tailored to individual needs and goals using advanced AI technology.'
  },
  {
    title: 'Time-Saving Efficiency',
    description: 'Generate comprehensive workout plans in minutes, not hours, while maintaining quality and personalization.'
  },
  {
    title: 'Professional Insights',
    description: 'Access AI-powered recommendations based on proven training methodologies and best practices.'
  }
]

export default HomePage
