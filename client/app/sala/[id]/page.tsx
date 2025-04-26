'use client'
import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSocket } from '@/hooks/useSocket'
import { io, Socket } from 'socket.io-client'
import { Jugador } from '../../../lib/schemas'
import { getAnfitrion } from '@/lib/api'
import Cancha from '@/components/Cancha'

let socket: Socket


export default function SalaPage() {
  const router = useRouter()
  const { id } = useParams()
  const socketRef = useSocket('http://localhost:3001')
  const [jugadores, setJugadores] = useState<Jugador[]>([])
  const [yo, setYo] = useState<Jugador | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [listo, setListo] = useState(false)
  const salaCreadaRef = useRef(false)

  useEffect(() => {
    const handleJugadorUnido = ({ jugadores }: { jugadores: Jugador[] }) => {
      console.log('Jugador unido:', jugadores)
      setJugadores(jugadores)
    }

    const handleJuegoListo = () => {
      setListo(true)
    }

    const handleErrorSala = (mensaje: string) => {
      setError(mensaje)
    }

    const fetchAnfitrion = async () => {
      try {
        const { anfitrion } = await getAnfitrion(id as string)


        // Obtenemos datos del jugador desde localStorage
        const stored = localStorage.getItem('jugador')
        if (!stored) return router.push('/')

        const jugador: Jugador = JSON.parse(stored)
        setYo(jugador)

        const socket = socketRef.current
        if (!socket) return


        // Emitir evento 'salaCreada' solo si no se ha creado antes
        if (!salaCreadaRef.current) {
          console.log('Sala creada:', id)
          socket.emit('salaCreada', { codigoSala: id, jugador: anfitrion })
          salaCreadaRef.current = true
        }

        // Emitir evento 'unirseSala' solo si no es el anfitrión
        if (jugador.nickname !== anfitrion.nickname) {
          console.log('Unirse a la sala, no es el anfitrion:', id)
          socket.emit('unirseSala', { codigoSala: id, jugador })
        }


        // Configurar listeners del socket
        

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
  }, [id, router, socketRef])
  // if (error) {
  //   return (
  //     <main className="p-6 text-center">
  //       <h1 className="text-2xl text-red-600">Error: {error}</h1>
  //     </main>
  //   )
  // }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#3c096c] px-4">
      <h1 className="text-white text-3xl font-bold mb-6">Sala: {id}</h1>

      <h2 className="text-xl text-white mb-4">
        {listo ? '✅ Juego listo para comenzar' : '⏳ Esperando al otro jugador...'}
      </h2>

      <div className="flex justify-center gap-16">
        {/* Jugador 1 (Anfitrión) */}
        <div className="flex flex-col items-center">
          {jugadores[0] ? (
            <>
              <Cancha esMiCancha={yo?.nickname === jugadores[0].nickname} jugador={jugadores[0]} />
              <img
                src={jugadores[0].avatar}
                alt={jugadores[0].nickname}
                className="w-32 h-32 rounded-full border-4 border-purple-500"
              />
              <p className="text-white mt-2 text-lg font-bold">{jugadores[0].nickname}</p>
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
              <img
                src={jugadores[1].avatar}
                alt={jugadores[1].nickname}
                className="w-32 h-32 rounded-full border-4 border-purple-500"
              />
              <p className="text-white mt-2 text-lg font-bold">{jugadores[1].nickname}</p>
            </>
          ) : (
            <p className="text-gray-300">Esperando al jugador...</p>
          )}
        </div>
      </div>
    </main>
  )
}
