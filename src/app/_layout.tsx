import { Slot } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native'
import { AuthProvider } from 'src/contexts/AuthContext'
import { useFonts, NunitoSans_300Light, NunitoSans_400Regular, NunitoSans_600SemiBold, NunitoSans_700Bold } from '@expo-google-fonts/nunito-sans'
import { Poppins_300Light, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins'
import Spinner from 'src/components/Spinner'
import { useColorScheme } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { TamaguiProvider } from 'tamagui'
import tamaguiConfig from 'tamagui.config' // Ensure this points to your Tamagui config file
import '@tamagui/core/reset.css'

export default function AppLayout() {
  const colorScheme = useColorScheme() // Detect system color scheme (light/dark mode)

  // Load custom fonts
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
    <TamaguiProvider config={tamaguiConfig}>
      <NavThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <SafeAreaView style={{ flex: 1 }}>
          <AuthProvider>
            <Slot screenOptions={{ headerShown: false }} />
          </AuthProvider>
        </SafeAreaView>
      </NavThemeProvider>
    </TamaguiProvider>
  )
}
