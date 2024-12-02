import React from 'react'
import { TouchableOpacity, Text } from 'react-native'

interface FloatingActionButtonProps {
  onPress: () => void
  style?: object
  text?: string
}
const FloatingActionButton = ({ onPress, style = {}, text = '+' }: FloatingActionButtonProps) => {
  return (
    <TouchableOpacity
      className="absolute bottom-40 right-6 bg-primary rounded-full px-4 py-2 shadow-lg"
      style={{ aspectRatio: 1, ...style }}
      onPress={onPress}>
      <Text className="text-white text-xl font-bold">{text}</Text>
    </TouchableOpacity>
  )
}

export default FloatingActionButton
