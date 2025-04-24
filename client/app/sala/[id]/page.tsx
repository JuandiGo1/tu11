'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { io, Socket } from 'socket.io-client'
import { Jugador } from '../../../lib/schemas'

let socket: Socket


export default function SalaPage() {
  const router = useRouter()
  const { id } = useParams()
  const [jugadores, setJugadores] = useState<Jugador[]>([])
  const [yo, setYo] = useState<Jugador | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [listo, setListo] = useState(false)

  useEffect(() => {
    // Obtenemos datos del jugador desde localStorage
    const stored = localStorage.getItem('jugador')
    if (!stored) return router.push('/')

    const jugador: Jugador = JSON.parse(stored)
    setYo(jugador)

    socket = io('http://localhost:3001') // tu backend

    // Conectarse a la sala con nombre y avatar
    socket.emit('unirseSala', { codigoSala: id, jugador })

    socket.on('jugadorUnido', ({ jugadores }) => {
      setJugadores(jugadores)
    })

    socket.on('juegoListo', () => {
      setListo(true)
    })

    socket.on('errorSala', (mensaje: string) => {
      setError(mensaje)
    })

    return () => {
      socket.disconnect()
    }
  }, [id, router])

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
