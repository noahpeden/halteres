import 'expo-dev-client'
import { ThemeProvider as NavProvider } from '@react-navigation/native'
import { Slot } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import styled, { ThemeProvider, DefaultTheme } from 'styled-components/native'
import { appTheme, navTheme } from '../config/theme'
import Navbar from '../components/Navbar'
import { useFonts, NunitoSans_300Light, NunitoSans_400Regular, NunitoSans_600SemiBold, NunitoSans_700Bold } from '@expo-google-fonts/nunito-sans'
import { Poppins_300Light, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins'
import Spinner from 'src/components/Spinner'

export default function AppLayout() {
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
    <ThemeProvider theme={appTheme as DefaultTheme}>
      <StatusBar style="light" />
      <S.AppWrapper>
        <NavProvider value={navTheme}>
          <Navbar />
          <S.MainContent>
            <Slot screenOptions={{ headerShown: false }} />
          </S.MainContent>
        </NavProvider>
      </S.AppWrapper>
    </ThemeProvider>
  )
}

const S = {
  AppWrapper: styled.SafeAreaView`
    flex: 1;
    flex-direction: column;
    background-color: ${appTheme.background};
  `,
  MainContent: styled.View`
    margin-top: 12px;
    padding: 32px;
    padding-top: 64px;
    background-color: #ffffff;
    flex: 1;
  `
}
