'use client'
import { useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSocket } from '@/hooks/useSocket'
import { Jugador } from '../../../lib/schemas'
import { getAnfitrion } from '@/lib/api'
import { useSala } from '@/context/SalaContext'
import Cancha from '@/components/Cancha'

export default function SalaPage() {
  const router = useRouter()
  const { id } = useParams()
  const socketRef = useSocket('http://localhost:3001')
  const { jugadores, setJugadores, yo, setYo, setListo } = useSala()
  const salaCreadaRef = useRef(false)

  useEffect(() => {
    const handleJugadorUnido = ({ jugadores }: { jugadores: Jugador[] }) => {
      setJugadores(jugadores)
    }

    const handleJuegoListo = () => setListo(true)
    const handleErrorSala = (mensaje: string) => {
      console.error('Error sala:', mensaje)
    }

    const fetchAnfitrion = async () => {
      try {
        const { anfitrion } = await getAnfitrion(id as string)
        const stored = localStorage.getItem('jugador')
        if (!stored) return router.push('/')

        const jugador: Jugador = JSON.parse(stored)
        setYo(jugador)

        const socket = socketRef.current
        if (!socket) return

        if (!salaCreadaRef.current) {
          socket.emit('salaCreada', { codigoSala: id, jugador: anfitrion })
          salaCreadaRef.current = true
        }

        if (jugador.nickname !== anfitrion.nickname) {
          socket.emit('unirseSala', { codigoSala: id, jugador })
        }

        socket.on('jugadorUnido', handleJugadorUnido)
        socket.on('juegoListo', handleJuegoListo)
        socket.on('errorSala', handleErrorSala)
      } catch (error) {
        console.error('Error al obtener el anfitrión:', error)
      }
    }

    fetchAnfitrion()

    return () => {
      const socket = socketRef.current
      if (socket) {
        socket.off('jugadorUnido', handleJugadorUnido)
        socket.off('juegoListo', handleJuegoListo)
        socket.off('errorSala', handleErrorSala)
      }
    }
  }, [id, router, socketRef, setJugadores, setYo, setListo])

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#3c096c]">
       <div className="flex justify-center gap-16">
        {/* Jugador 1 (Anfitrión) */}
        <div className="flex flex-col items-center">
          {jugadores[0] ? (
            <>
              <Cancha esMiCancha={yo?.nickname === jugadores[0].nickname} jugador={jugadores[0]} />
            </>
          ) : (
            <p className="text-gray-300">Esperando al anfitrión...</p>
          )}
        </div>

        {/* Jugador 2 (Invitado) */}
        <div className="flex flex-col items-center">
          {jugadores[1] ? (
            <>
              <Cancha esMiCancha={yo?.nickname === jugadores[1].nickname} jugador={jugadores[1]} />
            </>
          ) : (
            <p className="text-gray-300">Esperando al jugador...</p>
          )}
        </div>
      </div>
    </main>
  )
}
