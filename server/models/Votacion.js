import {model, Schema} from 'mongoose';

const VotacionSchema = new Schema({
  salaId: { type: Schema.Types.ObjectId, ref: 'Sala', required: true },
  votosA: { type: Number, default: 0 },
  votosB: { type: Number, default: 0 },
  abierta: { type: Boolean, default: true },
  creadaEn: { type: Date, default: Date.now },
  expiraEn: { type: Date, required: true },
});

export default model('Votacion', VotacionSchema);
