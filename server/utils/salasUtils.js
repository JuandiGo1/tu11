import Sala from '../models/Sala.js';

export const agregarJugadorASala = async (codigo, jugador) => {
  // Verificar si la sala existe y si el jugador ya está en la sala
  const sala = await Sala.findOne({ codigo });

  if (!sala) {
    return { error: 'Sala no encontrada', status: 404 };
  }

  if (sala.jugadores.some(j => j.nickname === jugador.nickname)) {
    return { error: 'El jugador ya está en la sala', status: 400 };
  }

  if (sala.jugadores.length >= 2) {
    return { error: 'La sala ya está llena', status: 400, salaLlena: true };
  }

  // Agregar el jugador a la sala
  const jugadorConDatos = {
    nickname: jugador.nickname,
    avatar: jugador.avatar,
    equipo: [],
    presupuestoRestante: sala.reglas.presupuesto,
    esCreador: sala.jugadores.length === 0 // El primero en entrar es el creador
  };

  
  const salaActualizada = await Sala.findOneAndUpdate(
    { codigo },
    {
      $push: { jugadores: jugadorConDatos },
      $set: { estado: sala.jugadores.length + 1 === 2 ? 'en_juego' : 'esperando' }
    },
    { new: true } // Devuelve la sala actualizada
  );

  return { sala: salaActualizada };
};