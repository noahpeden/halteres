import React, { createContext, useState, useContext } from 'react'
export const seedEntityData = {
  programName: 'CrossFit Strength Focus',
  programSchedule: {
    length: '60 minutes',
    startDate: '',
    endDate: '',
    schedule: 'Monday, Wednesday, Friday',
    totalWorkouts: 0 // New field for storing calculated workouts
  },
  gymDetails: {
    type: 'CrossFit Box',
    unavailableEquipment: ['GHD Machine', 'Reverse Hyper'],
    excludedMovements: ['Muscle Ups', 'Handstand Walks']
  },
  workoutFormat: {
    format: ['Warm-up', 'Strength', 'Conditioning', 'Cool-down'],
    focus: 'Strength and Conditioning',
    quirks: 'Include one Olympic lifting component per session',
    priorityWorkout: 'Strength before conditioning'
  }
}

export type EntityData = {
  programName: string
  programSchedule: {
    length: string
    startDate: string
    endDate: string
    schedule: string
    totalWorkouts: number // Add totalWorkouts to the type
  }
  gymDetails: {
    type: string
    unavailableEquipment: string[]
    excludedMovements: string[]
  }
  workoutFormat: {
    format: string[]
    focus: string
    quirks: string
    priorityWorkout: string
  }
}

// Add default value for totalWorkouts in the provider

const EntityContext = createContext<{
  entityData: EntityData
  setEntityData: React.Dispatch<React.SetStateAction<EntityData>>
}>({
  entityData: seedEntityData,
  setEntityData: () => {}
})

export const EntityProvider = ({ children }) => {
  const [entityData, setEntityData] = useState(seedEntityData)

  return <EntityContext.Provider value={{ entityData, setEntityData }}>{children}</EntityContext.Provider>
}

export const useEntityContext = () => useContext(EntityContext)
