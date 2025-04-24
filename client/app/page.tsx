'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const [nickname, setNickname] = useState('')
  const [avatar, setAvatar] = useState('/avatars/klop.jpg') // Avatar por defecto
  const router = useRouter()

  const avatars = [
    { value: '/avatars/klop.jpg', label: 'Klop' },
    { value: '/avatars/leo.jpg', label: 'Messi' },
    { value: '/avatars/ney.jpg', label: 'Ney' },
    { value: '/avatars/vini.jpg', label: 'Vini' },
  ]

  const handleStart = () => {
    if (!nickname.trim()) return alert('Ingresa tu nickname')

    // Guardamos datos en localStorage
    localStorage.setItem('jugador', JSON.stringify({ nickname, avatar }))
    router.push('/sala')
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#3c096c] px-4">
      <h1 className="text-white text-2xl font-bold mb-6">Elige un personaje y un apodo</h1>

      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md space-y-6">
        {/* Avatar Selector */}
        <div className="flex flex-col items-center">
          <img
            src={avatar}
            alt="Avatar seleccionado"
            className="w-32 h-32 rounded-full border-4 border-purple-500 mb-4"
          />
          <div className="flex gap-4">
            {avatars.map((a) => (
              <button
                key={a.value}
                onClick={() => setAvatar(a.value)}
                className={`p-2 rounded-full border-2 ${
                  avatar === a.value ? 'border-purple-500' : 'border-gray-300'
                }`}
              >
                <img src={a.value} alt={a.label} className="w-16 h-16 rounded-full" />
              </button>
            ))}
          </div>
        </div>

        {/* Nickname Input */}
        <input
          type="text"
          placeholder="MiNickName6805"
          className="w-full border border-gray-300 rounded-lg p-3 text-center"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />

        {/* Continue Button */}
        <button
          onClick={handleStart}
          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition"
        >
          Continuar
        </button>
      </div>
    </main>
  )
}
