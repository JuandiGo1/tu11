'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { crearSala, verificarSala } from '@/lib/api'
import { Regla, Jugador } from '@/lib/schemas'

export default function SalaHome() {
  const [jugador, setJugador] = useState<Jugador>()
  const [codigoSala, setCodigoSala] = useState('')
  const [reglas, setReglas] = useState<Regla>({
    formacionFija: false,
    formacionDefinida: null,
    permitirJugadoresRepetidos: true,
    ligasPermitidas: [],
    presupuesto: null,
  })
  const router = useRouter()

  useEffect(() => {
    const data = localStorage.getItem('jugador')
    if (data) setJugador(JSON.parse(data))
    else router.push('/') // si no hay datos, redirigir a inicio
  }, [])

  const crearNuevaSala = async () => {
    if (!jugador) return
    const salaCreada = await crearSala({
      nickname: jugador.nickname,
      avatar: jugador.avatar,
      reglas: [reglas] // reglas configuradas
    })
    router.push(`/sala/${salaCreada}`)
  }

  const unirseSala = async () => {
    if (!codigoSala.trim()) return alert('Ingresa el código de la sala')

      try {
          const sala = await verificarSala(codigoSala)
          if (!sala) {
            return alert('La sala no existe.')
          }

          if (sala.estaLlena) {
              return alert('La sala está llena, no puedes unirte.')
          }
  
          router.push(`/sala/${codigoSala}`)
      } catch (error) {
          console.error('Error al unirse a la sala:', error)
          alert('Hubo un problema al intentar unirse a la sala. Inténtalo de nuevo.')
      }
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
        <h2 className="text-white text-3xl font-bold">¡Hola, {jugador.nickname}!</h2>
        <p className="text-gray-300 mt-2">¿Qué deseas hacer?</p>
      </div>

      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md space-y-4">
        {/* Configuración de Reglas */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-700">Configura las reglas de la partida:</h3>

          <div className="flex items-center space-x-2">
            <label className="text-gray-700">Formación fija:</label>
            <input
              type="checkbox"
              checked={reglas.formacionFija}
              onChange={(e) => setReglas({ ...reglas, formacionFija: e.target.checked })}
            />
          </div>

          {reglas.formacionFija && (
            <div className="flex items-center space-x-2">
              <label className="text-gray-700">Formación:</label>
              <select
                className="border border-gray-300 rounded-lg p-2"
                value={reglas.formacionDefinida || ''}
                onChange={(e) =>
                  setReglas({
                    ...reglas,
                    formacionDefinida: e.target.value as Regla['formacionDefinida'],
                  })
                }
              >
                <option value="">Seleccionar</option>
                <option value="4-4-2">4-4-2</option>
                <option value="4-3-3">4-3-3</option>
                <option value="3-5-2">3-5-2</option>
                <option value="5-3-2">5-3-2</option>
                <option value="4-2-3-1">4-2-3-1</option>
              </select>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <label className="text-gray-700">Permitir jugadores repetidos:</label>
            <input
              type="checkbox"
              checked={reglas.permitirJugadoresRepetidos}
              onChange={(e) =>
                setReglas({ ...reglas, permitirJugadoresRepetidos: e.target.checked })
              }
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-gray-700">Presupuesto:</label>
            <input
              type="number"
              placeholder="Ej: 1000000"
              className="border border-gray-300 rounded-lg p-2"
              value={reglas.presupuesto || ''}
              onChange={(e) =>
                setReglas({ ...reglas, presupuesto: e.target.value ? parseInt(e.target.value) : null })
              }
            />
          </div>
        </div>

        <button
          onClick={crearNuevaSala}
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
