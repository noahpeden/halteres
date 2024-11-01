import React, { createContext, useState, useContext } from 'react'

const EntityContext = createContext({
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
