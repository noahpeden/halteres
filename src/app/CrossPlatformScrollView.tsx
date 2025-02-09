import React from 'react'
import { ScrollView, Platform } from 'react-native'

interface CrossPlatformScrollViewProps {
  children: React.ReactNode
  style?: any
  contentContainerStyle?: any
  [key: string]: any
}

const CrossPlatformScrollView = ({ children, style, contentContainerStyle, ...props }: CrossPlatformScrollViewProps) => {
  return (
    <ScrollView
      className="flex-1 md:overflow-auto"
      style={[Platform.OS === 'web' ? { height: '100%' } : {}, style]}
      contentContainerStyle={[{ flexGrow: 1 }, contentContainerStyle]}
      {...props}>
      {children}
    </ScrollView>
  )
}

export default CrossPlatformScrollView
