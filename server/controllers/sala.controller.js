import Sala from '../models/Sala.js';
import { nanoid } from 'nanoid'; 

// Crear una sala
export const crearSala = async (req, res) => {
  try {
    const { nickname, avatar, reglas } = req.body;

    const codigo = nanoid(6).toUpperCase();

    const nuevaSala = await Sala.create({
      codigo,
      reglas,
      jugadores: [{
        nickname,
        avatar,
        equipo: [],
        esCreador: true
      }],
      turnoActual: 0
    });

    res.status(201).json(nuevaSala);
  } catch (err) {
    console.error('Error creando sala:', err);
    res.status(500).json({ error: 'Error al crear la sala' });
  }
};

// Unirse a una sala
export const unirseASala = async (req, res) => {
  try {
    const { codigo, nickname, avatar } = req.body;
    const { sala, salaLlena, error, status } = await obtenerSala(codigo);

    if (error) return res.status(status).json({ error });
    if (salaLlena) return res.status(400).json({ error: 'La sala ya está llena' });
    
    sala.jugadores.push({ nickname, avatar, equipo: [], presupuestoRestante: sala.reglas.presupuesto });
    sala.estado = 'en_juego'; // Cambiamos el estado a 'en_juego' al unirse un nuevo jugador
    await sala.save();

    res.status(200).json(sala);
  } catch (err) {
    console.error('Error al unirse a sala:', err);
    res.status(500).json({ error: 'Error al unirse a la sala' });
  }
};

// Obtener datos de sala
export const obtenerSala = async (req, res) => {
  try {
    const sala = await Sala.findOne({ codigo });

    if (!sala) return { error: 'Sala no encontrada', status: 404 };

    const salaLlena = sala.jugadores.length >= 2;
    return { sala, salaLlena };
  } catch (err) {
    console.error('Error al obtener sala:', err);
    return { error: 'Error al obtener la sala', status: 500 };
  }
};
