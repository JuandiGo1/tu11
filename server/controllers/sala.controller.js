import Sala from '../models/Sala.js';
import { nanoid } from 'nanoid'; 
import { agregarJugadorASala } from '../utils/salasUtils.js';

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
    const { sala, error, status } = await agregarJugadorASala(codigo, { nickname, avatar });

    if (error) return res.status(status).json({ error });

    res.status(200).json(sala);
  } catch (err) {
    console.error('Error al unirse a sala:', err);
    res.status(500).json({ error: 'Error al unirse a la sala' });
  }
};

// Obtener datos de sala
export const obtenerSala = async (req, res) => {
  const { codigo } = req.params;
  try {
    const sala = await Sala.findOne({ codigo });

    if (!sala) return { error: 'Sala no encontrada', status: 404 };

    res.status(200).json(sala)
  } catch (err) {
    console.error('Error al obtener sala:', err);
    res.status(500).json({ error: 'Error al buscar la sala' });
  }
};

export const salirDeSala = async (req, res) => {
  try {
    const { codigo, nickname } = req.body;

    // Buscar la sala por código
    const sala = await Sala.findOne({ codigo });

    if (!sala) {
      return res.status(404).json({ error: 'Sala no encontrada' });
    }

    // Filtrar al jugador que desea salir
    sala.jugadores = sala.jugadores.filter(jugador => jugador.nickname !== nickname);

    // Si no quedan jugadores, eliminar la sala
    if (sala.jugadores.length === 0) {
      await Sala.deleteOne({ codigo });
      return res.status(200).json({ message: 'Sala eliminada porque no quedan jugadores' });
    }

    // Guardar los cambios en la sala
    await sala.save();

    res.status(200).json({ message: 'Jugador salió de la sala', sala });
  } catch (err) {
    console.error('Error al salir de la sala:', err);
    res.status(500).json({ error: 'Error al salir de la sala' });
  }
};
