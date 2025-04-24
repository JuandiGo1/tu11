export async function crearSala(nombre: string, avatar: string) {
    const res = await fetch('http://localhost:3001/crear', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre, avatar }),
    })
  
    if (!res.ok) throw new Error('Error al crear sala')
  
    const data = await res.json()
    return data.idSala 
  }
  