import { Sala } from '../lib/schemas'

export async function crearSala( sala: Sala) {
    const res = await fetch('http://localhost:3001/crear', {
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
  