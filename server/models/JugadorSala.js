import mongoose from 'mongoose';

const FutbolistaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  posicion: { type: String, required: true }, 
  valor: { type: Number, required: true } // Valor del futbolista
});


const JugadorSchema = new mongoose.Schema({
  nickname: { type: String, required: true },
  avatar: { type: String },
  equipo: { type: [FutbolistaSchema], default: []}, // Array de futbolistas},
  presupuestoRestante: { type: Number, default: null }, // Presupuesto restante del jugador (null si no hay límite)
  esCreador: { type: Boolean, default: false }
});



export default JugadorSchema;