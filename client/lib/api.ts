import { Jugador, Sala } from '../lib/schemas'

export async function crearSala(sala: Sala) {
  const res = await fetch('http://localhost:3001/api/salas/crear', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sala),
  })

  if (!res.ok) throw new Error('Error al crear sala')

  const data = await res.json()
  return data.codigo
}


export async function verificarSala(codigoSala: string): Promise<{ estaLlena: boolean }> {
  if (!codigoSala.trim()) throw new Error('Ingresa el código de la sala')

  const res = await fetch(`http://localhost:3001/api/salas/${codigoSala}`)
  if (!res.ok) throw new Error('Error al verificar la sala')

  const data = await res.json()
  if (data.jugadores.length >= 2) {
    return { estaLlena: true } // Sala llena
  }

  return {estaLlena: false} 
}

export async function getAnfitrion(codigoSala: string): Promise<{ anfitrion: Jugador }> {
  if (!codigoSala.trim()) throw new Error('Falta el código de la sala')

  const res = await fetch(`http://localhost:3001/api/salas/${codigoSala}`)
  if (!res.ok) throw new Error('Error al verificar la sala')

  const data = await res.json()
  
  const anfitrion = {nickname: data.jugadores[0].nickname, avatar: data.jugadores[0].avatar}
  if (!anfitrion) throw new Error('No se encontró el anfitrión')

  return {anfitrion} 
}

export async function salirSala(codigoSala: string, nickname: string) {
  const res = await fetch(`http://localhost:3001/api/salas/salir`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ codigo: codigoSala, nickname: nickname }),
  })

  if (!res.ok) throw new Error('Error al salir de la sala')

  return await res.json()
}