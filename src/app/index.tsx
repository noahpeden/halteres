import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { Link, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from 'src/contexts/AuthContext' // Adjust the import path as needed
import styled from 'styled-components/native'
import * as Animatable from 'react-native-animatable'

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

  const Feature = ({ icon, title, description }) => (
    <FeatureContainer>
      {icon}
      <FeatureTitle>{title}</FeatureTitle>
      <FeatureDescription>{description}</FeatureDescription>
    </FeatureContainer>
  )

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <HeroSection>
        <HeroTitle>Elevate Your Fitness Programming with HalteresAI</HeroTitle>
        <HeroSubtitle>AI-Powered, Personalized Workouts for CrossFit Gyms, Coaches, and Health Professionals</HeroSubtitle>
        <Animatable.View animation="pulse" easing="ease-out" iterationCount="infinite">
          <StyledButton onPress={handleGetStarted}>
            <ButtonText>Get Started!</ButtonText>
          </StyledButton>
        </Animatable.View>
      </HeroSection>

      {/* The HalteresAI Advantage Section */}
      <Section>
        <SectionTitle>The HalteresAI Advantage</SectionTitle>
        <FeaturesGrid>
          <Feature
            icon={<Ionicons name="bulb-outline" size={48} color="#3b82f6" />}
            title="Unparalleled Personalization"
            description="Our AI adapts to your gym's unique equipment, class schedule, and member profiles for truly tailored programming."
          />
          <Feature
            icon={<Ionicons name="cash-outline" size={48} color="#3b82f6" />}
            title="Exceptional Value"
            description="High-quality, customized programming that fits your budget, maximizing your return on investment."
          />
          <Feature
            icon={<Ionicons name="time-outline" size={48} color="#3b82f6" />}
            title="Time-Saving Efficiency"
            description="Spend less time planning and more time coaching. Let our AI handle the programming details."
          />
        </FeaturesGrid>
      </Section>

      {/* How It Works Section */}
      <Section>
        <SectionTitle>Tailored for Fitness Professionals</SectionTitle>
        <HowItWorksContainer>
          <HowItWorksItem>
            <HowItWorksTitle>1. Comprehensive Setup</HowItWorksTitle>
            <HowItWorksDescription>
              Input your facility's details, equipment inventory, and class schedule. HalteresAI considers everything from your bikes to your highest
              rig.
            </HowItWorksDescription>
            <StyledImage source={require('../assets/images/configure-gym.gif')} resizeMode="cover" />
          </HowItWorksItem>
          <HowItWorksItem>
            <HowItWorksTitle>2. AI-Powered Workout Creation</HowItWorksTitle>
            <HowItWorksDescription>
              Our advanced algorithms create varied, challenging workouts that align with proven methodologies while considering your facility's
              unique factors.
            </HowItWorksDescription>
            <StyledImage source={require('../assets/images/generating-programming.gif')} resizeMode="cover" />
          </HowItWorksItem>
          <HowItWorksItem>
            <HowItWorksTitle>3. Intuitive Customization</HowItWorksTitle>
            <HowItWorksDescription>
              Fine-tune generated workouts with our user-friendly interface. Adjust for specific goals, competitions, or individual needs with ease.
            </HowItWorksDescription>
            <StyledImage source={require('../assets/images/customize-program.png')} resizeMode="cover" />
          </HowItWorksItem>
        </HowItWorksContainer>
      </Section>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6'
  }
})

// Styled Components
const HeroSection = styled.View`
  background-color: #2563eb;
  padding: 20px;
  align-items: center;
`

const HeroTitle = styled.Text`
  font-size: 32px;
  font-weight: bold;
  color: white;
  text-align: center;
  margin-bottom: 10px;
`

const HeroSubtitle = styled.Text`
  font-size: 18px;
  color: white;
  text-align: center;
  margin-bottom: 20px;
`

const StyledButton = styled.TouchableOpacity`
  background-color: white;
  padding: 10px 20px;
  border-radius: 25px;
`

const ButtonText = styled.Text`
  color: #2563eb;
  font-size: 16px;
  font-weight: bold;
`

const Section = styled.View`
  padding: 20px;
`

const SectionTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
`

const FeaturesGrid = styled.View`
  flex-direction: column;
`

const FeatureContainer = styled.View`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  align-items: center;
  margin-bottom: 20px;
`

const FeatureTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 5px;
`

const FeatureDescription = styled.Text`
  text-align: center;
  color: #4b5563;
`

const HowItWorksContainer = styled.View`
  flex-direction: column;
`

const HowItWorksItem = styled.View`
  margin-bottom: 20px;
`

const HowItWorksTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
`

const HowItWorksDescription = styled.Text`
  margin-bottom: 10px;
`

const StyledImage = styled.Image`
  width: 100%;
  height: 200px;
  border-radius: 10px;
`

export default HomePage
