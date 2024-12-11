import React, { createContext, useContext, useState } from 'react'
import { Modal, View, Text, TouchableOpacity, Pressable } from 'react-native'
import { cssInterop } from 'nativewind'

const StyledView = cssInterop(View, {
  className: 'style'
})

const StyledText = cssInterop(Text, {
  className: 'style'
})

const StyledPressable = cssInterop(Pressable, {
  className: 'style'
})

const StyledTouchableOpacity = cssInterop(TouchableOpacity, {
  className: 'style'
})

// Create context for the dialog state
const AlertDialogContext = createContext({
  open: false,
  setOpen: (open: boolean) => {}
})

export function AlertDialog({ children }) {
  const [open, setOpen] = useState(false)
  return <AlertDialogContext.Provider value={{ open, setOpen }}>{children}</AlertDialogContext.Provider>
}

export function AlertDialogTrigger({ children, asChild }) {
  const { setOpen } = useContext(AlertDialogContext)

  if (asChild) {
    return React.cloneElement(children, {
      onPress: () => setOpen(true)
    })
  }

  return <StyledTouchableOpacity onPress={() => setOpen(true)}>{children}</StyledTouchableOpacity>
}

export function AlertDialogContent({ children }) {
  const { open, setOpen } = useContext(AlertDialogContext)

  if (!open) return null

  return (
    <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
      <StyledPressable className="flex-1 justify-center items-center bg-black/50" onPress={() => setOpen(false)}>
        <StyledView className="w-[90%] max-w-md bg-background p-6 rounded-lg" onStartShouldSetResponder={() => true}>
          {children}
        </StyledView>
      </StyledPressable>
    </Modal>
  )
}

export function AlertDialogHeader({ children }) {
  return <StyledView className="mb-4">{children}</StyledView>
}

export function AlertDialogTitle({ children }) {
  return <StyledText className="text-xl font-bold text-text-primary mb-2">{children}</StyledText>
}

export function AlertDialogDescription({ children }) {
  return <StyledText className="text-text-secondary text-base">{children}</StyledText>
}

export function AlertDialogFooter({ children }) {
  return <StyledView className="flex-row justify-end gap-3 mt-6">{children}</StyledView>
}

export function AlertDialogAction({ children, onPress, className = '' }) {
  const { setOpen } = useContext(AlertDialogContext)

  return (
    <StyledTouchableOpacity
      className={`px-4 py-2 rounded-md bg-primary ${className}`}
      onPress={() => {
        onPress?.()
        setOpen(false)
      }}>
      <StyledText className="text-primary-foreground font-semibold">{children}</StyledText>
    </StyledTouchableOpacity>
  )
}

export function AlertDialogCancel({ children }) {
  const { setOpen } = useContext(AlertDialogContext)

  return (
    <StyledTouchableOpacity className="px-4 py-2 rounded-md bg-surface" onPress={() => setOpen(false)}>
      <StyledText className="text-text-primary font-semibold">{children}</StyledText>
    </StyledTouchableOpacity>
  )
}
