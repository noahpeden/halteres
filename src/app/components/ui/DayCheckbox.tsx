import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Check } from 'lucide-react-native'
import { classed } from '@tw-classed/react'

// Define styled components using `classed` and custom colors
const CheckboxContainer = classed(View, 'w-5 h-5 mr-2 rounded border items-center justify-center')
const StyledText = classed(Text, 'text-text-primary')

export default function DayCheckbox({ day, isSelected, onPress }) {
  return (
    <TouchableOpacity className="flex-row items-center mb-2" onPress={onPress}>
      <CheckboxContainer className={`${isSelected ? 'bg-primary' : 'bg-surface'} border-border`}>
        {isSelected && <Check color="orange" size={16} />}
      </CheckboxContainer>
      <StyledText>{day.charAt(0).toUpperCase() + day.slice(1)}</StyledText>
    </TouchableOpacity>
  )
}
