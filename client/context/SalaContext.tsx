'use client'
import { createContext, useContext, useState } from 'react'
import { Jugador } from '@/lib/schemas'

interface SalaContextType {
  jugadores: Jugador[]
  setJugadores: (j: Jugador[]) => void
  yo: Jugador | null
  setYo: (j: Jugador | null) => void
  listo: boolean
  setListo: (l: boolean) => void
}

const SalaContext = createContext<SalaContextType | undefined>(undefined)

export function SalaProvider({ children }: { children: React.ReactNode }) {
  const [jugadores, setJugadores] = useState<Jugador[]>([])
  const [yo, setYo] = useState<Jugador | null>(null)
  const [listo, setListo] = useState(false)

  return (
    <SalaContext.Provider value={{ jugadores, setJugadores, yo, setYo, listo, setListo }}>
      {children}
    </SalaContext.Provider>
  )
}

export function useSala() {
  const context = useContext(SalaContext)
  if (!context) {
    throw new Error('useSala debe usarse dentro de un SalaProvider')
  }
  return context
}
