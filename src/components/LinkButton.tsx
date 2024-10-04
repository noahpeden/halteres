import React from 'react'
import { Link } from 'expo-router'
import { openURL } from 'expo-linking'
import { Button, Text, styled } from 'tamagui'

interface Props {
  href: string
  text: string
}

const StyledButton = styled(Button, {
  backgroundColor: 'transparent',
  borderColor: '$highlight',
  borderWidth: 1,
  borderRadius: '$2',
  paddingVertical: '$2',
  paddingHorizontal: '$3'
})

const StyledText = styled(Text, {
  color: '$highlight',
  fontWeight: '600'
})

export default function LinkButton({ href, text }: Props) {
  if (href.startsWith('/')) {
    return (
      <StyledButton asChild>
        <Link href={href} testID="link-button">
          <StyledText testID="link-button-text">{text}</StyledText>
        </Link>
      </StyledButton>
    )
  } else {
    return (
      <StyledButton testID="link-button" onPress={() => openURL(href)}>
        <StyledText testID="link-button-text">{text}</StyledText>
      </StyledButton>
    )
  }
}
