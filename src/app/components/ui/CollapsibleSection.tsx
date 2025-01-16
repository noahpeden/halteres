import React, { useState } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { ChevronDown, ChevronUp } from 'lucide-react-native'

export default function CollapsibleSection({ title, children, defaultExpanded = false, className = '' }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <View className={`mb-4 border-b  border-gray-200  ${className}`}>
      <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)} className="flex-row justify-between items-center mb-6">
        <Text className="text-xl font-bold">{title}</Text>
        {isExpanded ? <ChevronUp size={24} className="text-gray-500" /> : <ChevronDown size={24} className="text-gray-500" />}
      </TouchableOpacity>

      {isExpanded && children}
    </View>
  )
}
