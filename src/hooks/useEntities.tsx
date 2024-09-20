// src/hooks/useEntities.ts

import { useState, useEffect, useCallback } from 'react'
import { supabase } from 'src/utils/supabase/client'

export type EntityType = 'CLIENT' | 'CLASS'

export interface Entity {
  id: string
  user_id: string
  name: string
  type: EntityType
  details: string
  created_at: string
  updated_at: string
}

export interface NewEntity {
  user_id: string
  name: string
  type: EntityType
  details: string
}

export const useEntities = (userId: string) => {
  const [entities, setEntities] = useState<Entity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchEntities()
  }, [userId])

  const fetchEntities = useCallback(async () => {
    if (!userId) return

    try {
      setLoading(true)
      const { data, error } = await supabase.from('entities').select('*').eq('user_id', userId).order('created_at', { ascending: false })

      if (error) throw error

      setEntities(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [userId])

  const addEntity = async (newEntity: NewEntity) => {
    try {
      const { data, error } = await supabase.from('entities').insert([newEntity]).single()

      if (error) throw error

      setEntities((prevEntities) => [data, ...prevEntities])
    } catch (e) {
      setError(e.message)
      throw e
    }
  }

  const updateEntity = async (id: string, updates: Partial<Entity>) => {
    try {
      const { data, error } = await supabase.from('entities').update(updates).eq('id', id).single()

      if (error) throw error

      setEntities((prevEntities) => prevEntities.map((entity) => (entity.id === id ? { ...entity, ...data } : entity)))
    } catch (e) {
      setError(e.message)
    }
  }

  const deleteEntity = async (id: string) => {
    try {
      const { error } = await supabase.from('entities').delete().eq('id', id)

      if (error) throw error

      setEntities((prevEntities) => prevEntities.filter((entity) => entity.id !== id))
    } catch (e) {
      setError(e.message)
    }
  }

  return { entities, loading, error, addEntity, updateEntity, deleteEntity, fetchEntities }
}
