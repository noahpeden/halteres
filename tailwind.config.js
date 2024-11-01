/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/app/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        'background-secondary': 'var(--color-background-secondary)',
        foreground: 'var(--color-foreground)',

        primary: 'var(--color-primary)',
        'primary-foreground': 'var(--color-primary-foreground)',
        'primary-muted': 'var(--color-primary-muted)',
        'primary-light': 'var(--color-primary-light)',

        secondary: 'var(--color-secondary)',
        'secondary-foreground': 'var(--color-secondary-foreground)',
        'secondary-muted': 'var(--color-secondary-muted)',
        'secondary-light': 'var(--color-secondary-light)',

        success: 'var(--color-success)',
        'success-muted': 'var(--color-success-muted)',
        'success-light': 'var(--color-success-light)',

        error: 'var(--color-error)',
        'error-muted': 'var(--color-error-muted)',
        'error-light': 'var(--color-error-light)',

        warning: 'var(--color-warning)',
        'warning-muted': 'var(--color-warning-muted)',
        'warning-light': 'var(--color-warning-light)',

        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-tertiary': 'var(--color-text-tertiary)',
        'text-disabled': 'var(--color-text-disabled)',

        border: 'var(--color-border)',
        surface: 'var(--color-surface)'
      }
    }
  },
  plugins: []
}
