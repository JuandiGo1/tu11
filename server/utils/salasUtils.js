import Sala from '../models/Sala.js';

export const agregarJugadorASala = async (codigo, jugador) => {
  const sala = await Sala.findOne({ codigo });

  if (!sala) {
    return { error: 'Sala no encontrada', status: 404 };
  }

  if (sala.jugadores.length >= 2) {
    return { error: 'La sala ya está llena', status: 400, salaLlena: true };
  }

  const jugadorConDatos = {
    nickname: jugador.nickname,
    avatar: jugador.avatar,
    equipo: [],
    presupuestoRestante: sala.reglas.presupuesto,
    esCreador: sala.jugadores.length === 0 // El primero en entrar es el creador
  };

  sala.jugadores.push(jugadorConDatos);
  sala.estado = 'en_juego';
  await sala.save();

  return { sala };
};
