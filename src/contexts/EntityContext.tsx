import React, { createContext, useState, useContext } from 'react'

export const seedEntityData = {
  programName: 'CrossFit Strength Focus',
  sessionDetails: {
    length: '60 minutes',
    startEndDate: '2024-03-11 to 2024-04-11',
    schedule: 'Monday, Wednesday, Friday'
  },
  gymDetails: {
    type: 'CrossFit Box',
    unavailableEquipment: ['GHD Machine', 'Reverse Hyper'],
    excludedMovements: ['Muscle Ups', 'Handstand Walks']
  },
  workoutFormat: {
    format: ['EMOM', 'AMRAP', 'For Time'],
    focus: 'Strength and Conditioning',
    quirks: 'Include one Olympic lifting component per session',
    priorityWorkout: 'Strength before conditioning'
  }
}
export type EntityData = {
  programName: string
  sessionDetails: {
    length: string
    startEndDate: string
    schedule: string
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

const EntityContext = createContext<{
  entityData: EntityData
  setEntityData: React.Dispatch<React.SetStateAction<EntityData>>
}>({
  entityData: {
    programName: '',
    sessionDetails: {
      length: '',
      startEndDate: '',
      schedule: ''
    },
    gymDetails: {
      type: '',
      unavailableEquipment: [],
      excludedMovements: []
    },
    workoutFormat: {
      format: [],
      focus: '',
      quirks: '',
      priorityWorkout: ''
    }
  },
  setEntityData: () => {}
})

export const EntityProvider = ({ children }) => {
  const [entityData, setEntityData] = useState({
    programName: '',
    sessionDetails: {
      length: '',
      startEndDate: '',
      schedule: ''
    },
    gymDetails: {
      type: '',
      unavailableEquipment: [],
      excludedMovements: []
    },
    workoutFormat: {
      format: [],
      focus: '',
      quirks: '',
      priorityWorkout: ''
    }
  })

  return <EntityContext.Provider value={{ entityData, setEntityData }}>{children}</EntityContext.Provider>
}

export const useEntityContext = () => useContext(EntityContext)
