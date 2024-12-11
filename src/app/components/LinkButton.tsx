import React from 'react'
import { Link } from 'expo-router'
import { openURL } from 'expo-linking'
import { TouchableOpacity, Text } from 'react-native'
interface Props {
  href: string
  text: string
}

export default function LinkButton({ href, text }: Props) {
  const buttonClasses = 'bg-transparent border border-highlight rounded-md py-2 px-3'
  const textClasses = 'text-highlight font-semibold'

  if (href.startsWith('/')) {
    return (
      <Link href={href} testID="link-button">
        <TouchableOpacity className={buttonClasses}>
          <Text className={textClasses} testID="link-button-text">
            {text}
          </Text>
        </TouchableOpacity>
      </Link>
    )
  } else {
    return (
      <TouchableOpacity className={buttonClasses} testID="link-button" onPress={() => openURL(href)}>
        <Text className={textClasses} testID="link-button-text">
          {text}
        </Text>
      </TouchableOpacity>
    )
  }
}
