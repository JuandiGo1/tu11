import mongoose from 'mongoose';

export const JugadorSchema = new mongoose.Schema({
  nickname: { type: String, required: true },
  avatar: { type: String },
  equipo: [
    {
      nombre: String,
      valor: Number,
      posicion: String,
      imagen: String,
    }
  ],
  presupuestoRestante: { type: Number, default: null }, // Presupuesto restante del jugador (null si no hay límite)
  esCreador: { type: Boolean, default: false }
});


