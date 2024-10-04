import React from 'react'
import { useRouter } from 'expo-router'
import { useAuth } from 'src/contexts/AuthContext' // Adjust the import path as needed
import { YStack, XStack, Button, H1, H2, Paragraph, Image, ScrollView } from 'tamagui'
import { useWindowDimensions } from 'react-native'
import LOGO_IMG from '../assets/images/logo.png'
const DEFAULT_IMAGE = require('../assets/images/box-jumps.jpg')

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

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <YStack flex={1} padding="$1" alignItems="center" justifyContent="space-between" backgroundColor="$blue10" minHeight={windowHeight}>
        <YStack alignItems="center" gap="$4" flex={1} justifyContent="center">
          {/* App Name */}
          <Image source={LOGO_IMG} resizeMode="contain" width={300} height={200} />

          <H1 color="$background" textAlign="center" fontSize="$10">
            halteres.ai
          </H1>

          {/* Tagline */}
          <H2 color="$blue2" textAlign="center" fontSize="$6">
            Welcome to the functional fitness industry's #1 productivity app.
          </H2>

          {/* CTA Button */}
          <Button size="$6" theme="active" pressStyle={{ backgroundColor: '$blue7' }} onPress={handleGetStarted}>
            <Paragraph color="$blue10" fontSize="$6" fontWeight="bold">
              Get Started!
            </Paragraph>
          </Button>
        </YStack>

        {/* Additional Info */}
        <XStack gap="$2" marginTop="$4">
          <Paragraph color="$blue2">Already have an account?</Paragraph>
          <Paragraph color="$blue8" fontWeight="bold" onPress={() => router.push('/login')}>
            Log in
          </Paragraph>
        </XStack>
      </YStack>
    </ScrollView>
  )
}

export default HomePage
