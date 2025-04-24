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

  if (error) {
    return (
      <main className="p-6 text-center">
        <h1 className="text-2xl text-red-600">Error: {error}</h1>
      </main>
    )
  }

  return (
    <main className="p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">Sala: {id}</h1>

      <h2 className="text-xl mb-4">{listo ? '✅ Juego listo para comenzar' : '⏳ Esperando al otro jugador...'}</h2>

      <div className="flex justify-center gap-8">
        {jugadores.map((j, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <img src={j.avatar} alt={j.nickname} className="w-20 h-20 rounded-full border-4 border-blue-500" />
            <p className="mt-2">{j.nickname}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
