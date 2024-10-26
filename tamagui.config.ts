import { createMedia } from '@tamagui/react-native-media-driver'
import { createFont, createTamagui, createTokens } from 'tamagui'

// Define the font using Tamagui's `createFont` function
const nunitoFont = createFont({
  family: 'Nunito Sans, sans-serif',
  size: {
    1: 12,
    2: 14,
    3: 16,
    4: 18,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40
  },
  lineHeight: {
    1: 16,
    2: 20,
    3: 24,
    4: 28,
    5: 32,
    6: 36
  },
  weight: {
    1: '300',
    2: '400',
    3: '600',
    4: '700'
  },
  letterSpacing: {
    1: 0,
    2: -0.5,
    3: -1
  },
  face: {
    300: { normal: 'NunitoSans-Light', italic: 'NunitoSans-LightItalic' },
    400: { normal: 'NunitoSans-Regular', italic: 'NunitoSans-Italic' },
    600: { normal: 'NunitoSans-SemiBold' },
    700: { normal: 'NunitoSans-Bold' }
  }
})

const poppinsFont = createFont({
  family: 'Poppins, sans-serif',
  size: {
    1: 12,
    2: 14,
    3: 16,
    4: 18,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40
  },
  lineHeight: {
    1: 16,
    2: 20,
    3: 24,
    4: 28,
    5: 32,
    6: 36
  },
  weight: {
    1: '300',
    2: '400',
    3: '600',
    4: '700'
  },
  letterSpacing: {
    1: 0,
    2: -0.5,
    3: -1
  },
  face: {
    300: { normal: 'Poppins-Light', italic: 'Poppins-LightItalic' },
    400: { normal: 'Poppins-Regular', italic: 'Poppins-Italic' },
    600: { normal: 'Poppins-SemiBold' },
    700: { normal: 'Poppins-Bold' }
  }
})

// Define tokens for sizes, spacing, radius, and color
export const tokens = createTokens({
  size: {
    0: 0,
    1: 5,
    2: 10,
    3: 15,
    4: 20,
    5: 25,
    6: 30,
    true: 20 // Setting default token for "true"
  },
  space: {
    0: 0,
    1: 5,
    2: 10,
    3: 15,
    4: 20,
    5: 25,
    6: 30,
    true: 20, // Setting default token for "true"
    '-1': -5,
    '-2': -10
  },
  radius: {
    0: 0,
    1: 3,
    2: 6,
    3: 12
  },
  zIndex: {
    0: 0,
    1: 100,
    2: 200,
    3: 300
  },
  color: {
    white: '#ffffff',
    black: '#000000',
    gallery: '#f9fbff',
    pampas: '#f5f4f0',
    websiteBlue: '#deebfd',
    errorRed: '#e74444',
    successGreen: '#188038',
    smartBlue: '#1771dc',
    helpfulOrange: '#ea7f49',
    thrivingGreen: '#3c8f73',
    neverPreachyPeach: '#ffcc7b',
    practicalGray: '#6f879a',
    black1: '#121212',
    grayscale1: '#9e9e9e'
  }
})

const config = createTamagui({
  fonts: {
    heading: poppinsFont,
    body: nunitoFont
  },
  tokens,

  themes: {
    light: {
      bg: '#f2f2f2',
      color: tokens.color.black
    },
    dark: {
      bg: '#111111',
      color: tokens.color.white
    }
  },

  media: createMedia({
    sm: { maxWidth: 860 },
    gtSm: { minWidth: 861 },
    short: { maxHeight: 820 },
    hoverNone: { hover: 'none' },
    pointerCoarse: { pointer: 'coarse' }
  }),

  shorthands: {
    px: 'paddingHorizontal',
    f: 'flex',
    m: 'margin',
    w: 'width'
  } as const,

  defaultProps: {
    Text: {
      color: 'green'
    }
  }
})

type AppConfig = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config
