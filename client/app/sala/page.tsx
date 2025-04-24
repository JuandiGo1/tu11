'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SalaHome() {
  const [jugador, setJugador] = useState<{ nombre: string, avatar: string } | null>(null)
  const [codigoSala, setCodigoSala] = useState('')
  const router = useRouter()

  useEffect(() => {
    const data = localStorage.getItem('jugador')
    if (data) setJugador(JSON.parse(data))
    else router.push('/') // si no hay datos, redirigir a inicio
  }, [])

  const crearSala = () => {
    const idSala = crypto.randomUUID().slice(0, 6) // o puedes pedirle al backend
    router.push(`/sala/${idSala}`)
  }

  const unirseSala = () => {
    if (!codigoSala.trim()) return alert('Ingresa el código de la sala')
    router.push(`/sala/${codigoSala}`)
  }

  if (!jugador) return null

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#3c096c] px-4">
      <div className="text-center flex flex-col mb-6 justify-center items-center">
        <img
          src={jugador.avatar}
          alt="Avatar del jugador"
          className="w-32 h-32 rounded-full border-4 border-purple-500 mb-4"
        />
        <h2 className="text-white text-3xl font-bold">¡Hola, {jugador.nombre}!</h2>
        <p className="text-gray-300 mt-2">¿Qué deseas hacer?</p>
      </div>

      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md space-y-4">
        <button
          onClick={crearSala}
          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition"
        >
          Crear nueva sala
        </button>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Código de sala"
            className="flex-1 border border-gray-300 rounded-lg p-3"
            value={codigoSala}
            onChange={(e) => setCodigoSala(e.target.value)}
          />
          <button
            onClick={unirseSala}
            className="bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition"
          >
            Unirse
          </button>
        </div>
      </div>
    </main>
  )
}
