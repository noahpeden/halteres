import { useColorScheme, vars } from 'nativewind'
import { View } from 'react-native'

// Define the color palette
const colors = {
  black: {
    1: 'rgba(0, 0, 0, 0.87)',
    2: 'rgba(0, 0, 0, 0.62)',
    3: 'rgba(0, 0, 0, 0.54)',
    4: 'rgba(0, 0, 0, 0.38)',
    5: 'rgba(0, 0, 0, 0.15)',
    6: 'rgba(0, 0, 0, 0.05)'
  },
  blue: {
    DEFAULT: '#1772DC',
    1: '#82B3EC',
    2: '#E8F1FC'
  },
  green: {
    DEFAULT: '#3A863A',
    0: '#2E6B2E',
    1: '#95BE95',
    2: '#EBF3EB'
  },
  orange: {
    DEFAULT: '#FA6400',
    1: '#FCAB75',
    2: '#FFF0E6'
  },
  red: {
    DEFAULT: '#ED0D0D',
    1: '#F7C7C',
    2: '#FDE7E7'
  },
  yellow: {
    DEFAULT: '#FFDB80',
    1: '#FFECBA',
    2: '#FFFBF2'
  },
  white: 'rgba(255, 255, 255, 1)',
  offWhite: '#FBFBFB'
}

export const themes = {
  light: vars({
    // Base colors
    '--color-background': colors.white,
    '--color-background-secondary': colors.offWhite,
    '--color-foreground': colors.black[1],

    // Primary colors (Blue)
    '--color-primary': colors.blue.DEFAULT,
    '--color-primary-foreground': colors.white,
    '--color-primary-muted': colors.blue[1],
    '--color-primary-light': colors.blue[2],

    // Secondary colors (Orange)
    '--color-secondary': colors.orange.DEFAULT,
    '--color-secondary-foreground': colors.white,
    '--color-secondary-muted': colors.orange[1],
    '--color-secondary-light': colors.orange[2],

    // Status colors
    '--color-success': colors.green.DEFAULT,
    '--color-success-muted': colors.green[1],
    '--color-success-light': colors.green[2],

    '--color-error': colors.red.DEFAULT,
    '--color-error-muted': colors.red[1],
    '--color-error-light': colors.red[2],

    '--color-warning': colors.yellow.DEFAULT,
    '--color-warning-muted': colors.yellow[1],
    '--color-warning-light': colors.yellow[2],

    // Text colors
    '--color-text-primary': colors.black[1],
    '--color-text-secondary': colors.black[2],
    '--color-text-tertiary': colors.black[3],
    '--color-text-disabled': colors.black[4],

    // Border and surface colors
    '--color-border': colors.black[5],
    '--color-surface': colors.black[6]
  }),

  dark: vars({
    // Base colors
    '--color-background': colors.black[1],
    '--color-background-secondary': colors.black[2],
    '--color-foreground': colors.white,

    // Primary colors (Blue)
    '--color-primary': colors.blue[1],
    '--color-primary-foreground': colors.black[1],
    '--color-primary-muted': colors.blue.DEFAULT,
    '--color-primary-light': colors.blue[2],

    // Secondary colors (Orange)
    '--color-secondary': colors.orange[1],
    '--color-secondary-foreground': colors.black[1],
    '--color-secondary-muted': colors.orange.DEFAULT,
    '--color-secondary-light': colors.orange[2],

    // Status colors
    '--color-success': colors.green[1],
    '--color-success-muted': colors.green.DEFAULT,
    '--color-success-light': colors.green[2],

    '--color-error': colors.red[1],
    '--color-error-muted': colors.red.DEFAULT,
    '--color-error-light': colors.red[2],

    '--color-warning': colors.yellow[1],
    '--color-warning-muted': colors.yellow.DEFAULT,
    '--color-warning-light': colors.yellow[2],

    // Text colors
    '--color-text-primary': colors.white,
    '--color-text-secondary': 'rgba(255, 255, 255, 0.87)',
    '--color-text-tertiary': 'rgba(255, 255, 255, 0.6)',
    '--color-text-disabled': 'rgba(255, 255, 255, 0.38)',

    // Border and surface colors
    '--color-border': 'rgba(255, 255, 255, 0.15)',
    '--color-surface': 'rgba(255, 255, 255, 0.05)'
  })
}

export default function Theme({ children }) {
  const { colorScheme } = useColorScheme()
  return <View style={themes['light']}>{children}</View>
}
