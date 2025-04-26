'use client'

export default function SalaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#3c096c]">
      {/* Navbar */}
      <nav className="w-full bg-purple-700 text-white py-4 px-6 flex justify-between items-center">
        {/* Jugador 1 (Anfitrión) */}
        <div className="flex items-center space-x-4">
          {/* Aquí puedes usar un contexto o props para pasar los datos de los jugadores */}
          <p className="text-gray-300">Esperando al anfitrión...</p>
        </div>

        {/* Código de la sala y estado */}
        <div className="text-center">
          <p className="text-xl font-bold">Código: [Código de la sala]</p>
          <p className="text-sm">⏳ Esperando al otro jugador...</p>
        </div>

        {/* Jugador 2 (Invitado) */}
        <div className="flex items-center space-x-4">
          <p className="text-gray-300">Esperando al jugador...</p>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="flex-1">{children}</main>
    </div>
  )
}