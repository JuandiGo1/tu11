import Sala from '../models/Sala.js';
import { nanoid } from 'nanoid'; // para generar códigos únicos

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
    const sala = await Sala.findOne({ codigo });

    if (!sala) return res.status(404).json({ error: 'Sala no encontrada' });
    if (sala.jugadores.length >= 2) return res.status(400).json({ error: 'La sala ya está llena' });

    sala.jugadores.push({ nickname, avatar, equipo: [] });
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
    const { codigo } = req.params;
    const sala = await Sala.findOne({ codigo });

    if (!sala) return res.status(404).json({ error: 'Sala no encontrada' });

    res.status(200).json(sala);
  } catch (err) {
    console.error('Error al obtener sala:', err);
    res.status(500).json({ error: 'Error al obtener la sala' });
  }
};
