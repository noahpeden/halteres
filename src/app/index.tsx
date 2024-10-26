import React from 'react'
import { useRouter } from 'expo-router'
import { useAuth } from 'src/contexts/AuthContext'
import { YStack, XStack, Button as TamaguiButton, H1, Text, Image, ScrollView, Theme, styled } from 'tamagui'
import { useWindowDimensions } from 'react-native'
import LOGO_IMG from '../assets/images/logo.png'
import PROGRAM_GENERATION from '../assets/images/program-generation.jpeg'

const CustomButton = styled(TamaguiButton, {
  width: 179,
  height: 65,
  paddingVertical: 10,
  paddingHorizontal: 30,
  gap: 0,
  borderRadius: 14,
  borderBottomRightRadius: 0,
  borderBottomLeftRadius: 0,
  opacity: 1 // If you mean visibility, otherwise set it to 0.5 or other values
})

const HomePage = () => {
  // const { session } = useAuth()
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
      <Theme name="light">
        <YStack flex={1} backgroundColor="$gallery" minHeight={windowHeight}>
          {/* Header */}
          <XStack
            paddingHorizontal="$4"
            paddingVertical="$2"
            justifyContent="space-between"
            alignItems="center"
            backgroundColor="$white"
            borderBottomColor="$black4"
            borderBottomWidth={1}>
            <Image source={LOGO_IMG} resizeMode="contain" width={150} height={40} />
            <CustomButton
              size="$4"
              backgroundColor="$smartBlue3"
              pressStyle={{ backgroundColor: '$smartBlue1' }}
              onPress={() => router.push('/login')}>
              <Text color="$smartBlue" fontWeight="bold">
                Login
              </Text>
            </CustomButton>
          </XStack>

          {/* Hero Section */}
          <YStack flex={1} paddingHorizontal="$4" paddingVertical="$6" gap="$4" alignItems="center" backgroundColor="$pampas">
            <YStack gap="$4" maxWidth={800} alignItems="center">
              <H1 textAlign="center" fontSize="$10" lineHeight="$10" color="$black1">
                Elevate Your Fitness Programming
              </H1>
              <H1 textAlign="center" fontSize="$10" lineHeight="$10" color="$smartBlue">
                with HalteresAI
              </H1>

              <Text textAlign="center" color="$black2" fontSize="$5" maxWidth={600}>
                AI-Powered, Personalized Workouts for CrossFit Gyms, Coaches, and Health Professionals
              </Text>

              <XStack gap="$4" marginTop="$4">
                <CustomButton
                  size="$6"
                  backgroundColor="$helpfulOrange"
                  pressStyle={{ backgroundColor: '$helpfulOrange1' }}
                  onPress={handleGetStarted}>
                  <Text color="$white" fontSize="$5" fontWeight="bold">
                    Get Started
                  </Text>
                </CustomButton>
                <CustomButton size="$6" backgroundColor="$smartBlue3" pressStyle={{ backgroundColor: '$smartBlue1' }} onPress={handleLearnMore}>
                  <Text color="$smartBlue" fontSize="$5" fontWeight="bold">
                    Learn More
                  </Text>
                </CustomButton>
              </XStack>
            </YStack>

            {/* Dashboard Preview */}
            <YStack
              marginTop="$6"
              width="100%"
              maxWidth={1000}
              backgroundColor="$white"
              borderRadius="$4"
              shadowColor="$black2"
              shadowOffset={{ width: 0, height: 4 }}
              shadowOpacity={0.1}
              shadowRadius={12}>
              <Image source={PROGRAM_GENERATION} width="100%" height={500} borderRadius="$4" opacity={0.9} resizeMode="cover" />
            </YStack>
          </YStack>
        </YStack>
      </Theme>
    </ScrollView>
  )
}

export default HomePage
