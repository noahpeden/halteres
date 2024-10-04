import { Slot } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native'
import { AuthProvider } from 'src/contexts/AuthContext'
import { useFonts, NunitoSans_300Light, NunitoSans_400Regular, NunitoSans_600SemiBold, NunitoSans_700Bold } from '@expo-google-fonts/nunito-sans'
import { Poppins_300Light, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins'
import Spinner from 'src/components/Spinner'
import { useColorScheme } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { createTamagui, TamaguiProvider, YStack } from 'tamagui'
import defaultConfig from '@tamagui/config/v3'
import '@tamagui/core/reset.css'

const config = createTamagui(defaultConfig)

export default function AppLayout() {
  const colorScheme = useColorScheme()

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

  return (
    <TamaguiProvider config={config}>
      {/* <NavThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}> */}
      <StatusBar style="light" />
      <SafeAreaView style={{ flex: 1 }}>
        <AuthProvider>
          <Slot screenOptions={{ headerShown: false }} />
        </AuthProvider>
      </SafeAreaView>
      {/* </NavThemeProvider> */}
    </TamaguiProvider>
  )
}
