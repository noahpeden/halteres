// src/theme/ThemeProvider.tsx

import React from 'react'
import { ThemeProvider as StyledThemeProvider } from 'styled-components/native'
import { colors } from 'src/theme/colors'

const theme = {
  colors
  // Add other theme properties here (fonts, spacing, etc.)
}

export const HalteresThemeProvider = ({ children }) => <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>

export default HalteresThemeProvider
