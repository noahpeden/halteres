import React, { useEffect, useState } from 'react'
import { View, Image, Text, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, Slot, useRouter } from 'expo-router'
import { useFonts } from '@expo-google-fonts/nunito-sans'
import { NunitoSans_300Light, NunitoSans_400Regular, NunitoSans_600SemiBold, NunitoSans_700Bold } from '@expo-google-fonts/nunito-sans'
import { Poppins_300Light, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins'

import { supabase } from 'src/utils/supabase/client'
import { AuthProvider } from 'src/contexts/AuthContext'
import { EntityProvider } from 'src/contexts/EntityContext'
import Spinner from 'src/app/components/ui/Spinner'
import Theme from 'src/app/components/ui/Theme'
import './global.css'
import LOGO_IMG from 'src/assets/images/logo.png'
import Button from 'src/app/components/ui/Button'
import CrossPlatformScrollView from './CrossPlatformScrollView'

export default function AppLayout() {
  const router = useRouter()
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.getUser().then((user) => {
      if (user) {
        setUser(user)
      }
    })

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const [fontsLoaded] = useFonts({
    NunitoSans_300Light,
    NunitoSans_400Regular,
    NunitoSans_600SemiBold,
    NunitoSans_700Bold,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold
  })

  if (!fontsLoaded) {
    return <Spinner />
  }

  const handleLogout = () => {
    supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AuthProvider>
        <Theme>
          <EntityProvider>
            <View className="flex-1 min-h-screen bg-background overflow-auto">
              <View className="flex-row px-4 py-2 justify-between items-center border-b border-[rgba(0,0,0,0)] w-[100%]">
                <Link href="/" className="flex-shrink-0">
                  <View className="flex-row items-center gap-2">
                    <Image source={LOGO_IMG} resizeMode="contain" className="w-[150px] h-[40px]" />
                    <Text className="text-lg font-semibold text-text-primary hidden md:block">Halteres.ai</Text>
                  </View>
                </Link>
                <View className="flex-row items-center gap-2">
                  {session ? (
                    <Button variant="login" onPress={() => router.push('/dashboard')}>
                      Dashboard
                    </Button>
                  ) : (
                    <Button variant="login" onPress={() => router.push('/login')}>
                      Login
                    </Button>
                  )}
                  <Button onPress={handleLogout}>Logout</Button>
                </View>
              </View>
              <CrossPlatformScrollView>
                <Slot screenOptions={{ headerShown: false }} />
              </CrossPlatformScrollView>
            </View>
          </EntityProvider>
        </Theme>
      </AuthProvider>
    </SafeAreaView>
  )
}
