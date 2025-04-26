'use client'

import { SalaProvider, useSala } from '@/context/SalaContext'
import { useParams } from 'next/navigation'

function Nav() {
    const { jugadores, yo, listo } = useSala()
    const { id } = useParams()

    return (
        <nav className="w-full bg-[#211c25] text-white py-4 px-6 flex justify-between items-center">
            <div className="flex items-center space-x-4">
                {jugadores[0] ? (
                    <div className='flex items-center justify-start'>
                    <img
                        src={jugadores[0].avatar}
                        alt={jugadores[0].nickname}
                        className="w-15 h-15 rounded-full border-4 border-purple-500"
                    />
                    <p className="text-white mt-2 text-lg font-bold">{jugadores[0].nickname}</p>
                </div>
                ) : (
                    <p className="text-gray-300">Esperando al anfitrión...</p>
                )}
            </div>
            <div className="text-center">
                <p className="text-xl font-bold">Código: {id}</p>
                <p className="text-sm">
                    {listo ? '✅ Juego listo' : '⏳ Esperando al otro jugador...'}
                </p>
            </div>
            <div className="flex items-center space-x-4">
                {jugadores[1] ? (
                    <div className='flex items-center justify-start'>
                        <img
                            src={jugadores[1].avatar}
                            alt={jugadores[1].nickname}
                            className="w-15 h-15 rounded-full border-4 border-purple-500"
                        />
                        <p className="text-white mt-2 text-lg font-bold">{jugadores[1].nickname}</p>
                    </div>

                ) : (
                    <p className="text-gray-300">Esperando al jugador...</p>
                )}
            </div>
        </nav>
    )
}

export default function SalaLayout({ children }: { children: React.ReactNode }) {
    return (
        <SalaProvider>
            <div className="flex flex-col min-h-screen bg-[#211c25]">
                <Nav />
                <main className="flex-1">{children}</main>
            </div>
        </SalaProvider>
    )
}
