import React from 'react'
import { View, Text, Image, ScrollView, useWindowDimensions, Pressable } from 'react-native'

const Button = ({ children, variant = 'primary', size = 'medium', onPress, className = '' }) => {
  const baseStyles = 'flex items-center justify-center rounded-lg font-bold'
  const variants = {
    primary: 'bg-primary text-white',
    secondary: 'bg-primary-light text-primary',
    login: 'bg-secondary text-white'
  }
  const sizes = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
  }

  return (
    <Pressable onPress={onPress} className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {typeof children === 'string' ? (
        <Text className={`font-bold ${variant === 'secondary' ? 'text-primary' : 'text-white'}`}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  )
}

export default Button
