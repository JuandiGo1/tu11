'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const [nombre, setNombre] = useState('')
  const [avatar, setAvatar] = useState('🐱') // emoji por ahora
  const router = useRouter()

  const handleStart = () => {
    if (!nombre.trim()) return alert('Ingresa tu nombre')

    // Guardamos datos en localStorage (luego puedes usar Context si prefieres)
    localStorage.setItem('jugador', JSON.stringify({ nombre, avatar }))
    router.push('/sala')
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-emerald-950 px-4">
      <h1 className="text-white text-4xl font-bold mb-6">Arma tu 11 ⚽</h1>

      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md space-y-4">
        <input
          type="text"
          placeholder="Tu nombre"
          className="w-full border border-gray-300 rounded-lg p-3"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <select
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3"
        >
          <option value="🐱">🐱 Gato</option>
          <option value="🐶">🐶 Perro</option>
          <option value="🦊">🦊 Zorro</option>
          <option value="🐵">🐵 Mono</option>
          <option value="🐸">🐸 Rana</option>
        </select>

        <button
          onClick={handleStart}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Continuar
        </button>
      </div>
    </main>
  )
}
