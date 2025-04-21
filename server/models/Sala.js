import { model, Schema } from 'mongoose';
import JugadorSchema from './JugadorSala.js';

const SalaSchema = new Schema({
  codigo: { type: String, required: true, unique: true },
  reglas: {
    formacionFija: { type: Boolean, default: false }, // Si es true, se usará la formación definida en "formacionDefinida"
    formacionDefinida: { type: String, enum: ['4-4-2', '4-3-3', '3-5-2', '5-3-2', '4-2-3-1'], default: null }, 
    permitirJugadoresRepetidos: { type: Boolean, default: false }, // Permitir jugadores repetidos en los equipos
    ligasPermitidas: { type: [String], default: [] }, // Lista de ligas permitidas (vacío significa todas las ligas)
    presupuesto: { type: Number, default: null }, // Si es null, no hay límite de presupuesto
  },
  jugadores: [JugadorSchema], // Lista de jugadores en la sala
  estado: { type: String, enum: ['esperando', 'en_juego', 'finalizada'], default: 'esperando' }, // Estado de la sala
  turnoActual: { type: Number, default: 0 }, // 0: primer jugador, 1: segundo jugador
  creadaEn: { type: Date, default: Date.now },
});

export default model('Sala', SalaSchema);
