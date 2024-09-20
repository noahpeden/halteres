// src/app/add-entity.tsx

import React, { useState } from 'react'
import { Alert, View } from 'react-native'
import { useRouter } from 'expo-router'
import styled from 'styled-components/native'
import { colors } from 'src/theme/colors'
import { useEntities } from 'src/hooks/useEntities'
import { useAuth } from 'src/contexts/AuthContext'

type EntityType = 'CLIENT' | 'CLASS'

const AddEntity = () => {
  const [name, setName] = useState('')
  const [type, setType] = useState<EntityType>('CLIENT')
  const { session } = useAuth()

  const { addEntity } = useEntities(session?.user?.id)
  const router = useRouter()

  const handleSubmit = async () => {
    if (name && type) {
      try {
        await addEntity({
          user_id: session?.user?.id,
          name,
          type,
          details: ''
        })
        Alert.alert('Success', 'Entity added successfully')
        router.back()
      } catch (error) {
        Alert.alert('Error', 'Failed to add entity. Please try again.')
        console.error(error)
      }
    } else {
      Alert.alert('Error', 'Please fill in all fields')
    }
  }

  return (
    <Container>
      <Title>Add New Entity</Title>
      <Input placeholder="Entity Name" value={name} onChangeText={setName} />
      <RadioGroup>
        <RadioButton onPress={() => setType('CLIENT')} isSelected={type === 'CLIENT'}>
          <RadioButtonInner isSelected={type === 'CLIENT'} />
        </RadioButton>
        <RadioLabel>Client</RadioLabel>
        <RadioButton onPress={() => setType('CLASS')} isSelected={type === 'CLASS'}>
          <RadioButtonInner isSelected={type === 'CLASS'} />
        </RadioButton>
        <RadioLabel>Class</RadioLabel>
      </RadioGroup>
      <SubmitButton onPress={handleSubmit}>
        <ButtonText>Add Entity</ButtonText>
      </SubmitButton>
    </Container>
  )
}

// Styled Components
const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: ${colors.gallery};
`

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${colors.smartBlue.default};
  margin-bottom: 20px;
  text-align: center;
`

const Input = styled.TextInput`
  background-color: ${colors.white};
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 15px;
  font-size: 16px;
`

const RadioGroup = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`

const RadioButton = styled.TouchableOpacity<{ isSelected: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  border-width: 2px;
  border-color: ${(props) => (props.isSelected ? colors.smartBlue.default : colors.practicalGray.default)};
  align-items: center;
  justify-content: center;
  margin-right: 8px;
`

const RadioButtonInner = styled.View<{ isSelected: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: ${(props) => (props.isSelected ? colors.smartBlue.default : 'transparent')};
`

const RadioLabel = styled.Text`
  font-size: 16px;
  color: ${colors.black[1]};
  margin-right: 20px;
`

const SubmitButton = styled.TouchableOpacity`
  background-color: ${colors.smartBlue.default};
  padding: 15px;
  border-radius: 10px;
  align-items: center;
`

const ButtonText = styled.Text`
  color: ${colors.white};
  font-weight: bold;
  font-size: 18px;
`

export default AddEntity
