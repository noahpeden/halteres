import React, { useCallback } from 'react'
import { FlatList, ActivityIndicator, Alert, StyleSheet } from 'react-native'
import { useRouter, useFocusEffect } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import styled from 'styled-components/native'
import { colors } from 'src/theme/colors'
import { useAuth } from 'src/contexts/AuthContext'
import { useEntities, Entity } from 'src/hooks/useEntities'

const Dashboard = () => {
  const { session } = useAuth()
  const router = useRouter()
  const { entities, loading, error, deleteEntity, fetchEntities } = useEntities(session?.user?.id)
  useFocusEffect(
    useCallback(() => {
      fetchEntities()
    }, [fetchEntities])
  )
  if (loading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color={colors.smartBlue.default} />
      </LoadingContainer>
    )
  }

  if (error) {
    return (
      <ErrorContainer>
        <ErrorText>Error: {error}</ErrorText>
      </ErrorContainer>
    )
  }

  const handleDeleteEntity = (id: string) => {
    Alert.alert('Delete Entity', 'Are you sure you want to delete this entity?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', onPress: () => deleteEntity(id), style: 'destructive' }
    ])
  }

  const renderEntityItem = ({ item }: { item: Entity }) => (
    <EntityItem>
      <EntityInfo>
        <EntityName>{item.name}</EntityName>
        <EntityType>{item.type}</EntityType>
      </EntityInfo>
      <ButtonGroup>
        <ActionButton onPress={() => router.push(`/entity/${item.id}`)}>
          <Ionicons name="eye" size={24} color={colors.smartBlue.default} />
        </ActionButton>
        <ActionButton onPress={() => router.push(`/edit-entity/${item.id}`)}>
          <Ionicons name="pencil" size={24} color={colors.thrivingGreen.default} />
        </ActionButton>
        <ActionButton onPress={() => handleDeleteEntity(item.id)}>
          <Ionicons name="trash" size={24} color={colors.errorRed} />
        </ActionButton>
      </ButtonGroup>
    </EntityItem>
  )

  return (
    <Container>
      <Header>
        <HeaderText>Your Entities</HeaderText>
        <AddButton onPress={() => router.push('/add-entity')}>
          <Ionicons name="add" size={24} color={colors.white} />
        </AddButton>
      </Header>
      <FlatList data={entities} renderItem={renderEntityItem} keyExtractor={(item) => item.id} contentContainerStyle={styles.listContent} />
    </Container>
  )
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 20
  }
})

// Styled Components
const Container = styled.View`
  flex: 1;
  background-color: ${colors.gallery};
`

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: ${colors.smartBlue.default};
`

const HeaderText = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${colors.white};
`

const AddButton = styled.TouchableOpacity`
  background-color: ${colors.thrivingGreen.default};
  padding: 10px;
  border-radius: 25px;
`

const EntityItem = styled.View`
  background-color: ${colors.white};
  margin: 10px 20px;
  padding: 15px;
  border-radius: 10px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const EntityInfo = styled.View`
  flex: 1;
`

const EntityName = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${colors.black[1]};
`

const EntityType = styled.Text`
  font-size: 14px;
  color: ${colors.practicalGray.default};
`

const ButtonGroup = styled.View`
  flex-direction: row;
`

const ActionButton = styled.TouchableOpacity`
  padding: 8px;
  margin-left: 8px;
`

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`

const ErrorContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`

const ErrorText = styled.Text`
  color: ${colors.errorRed};
  font-size: 16px;
  text-align: center;
`

export default Dashboard
