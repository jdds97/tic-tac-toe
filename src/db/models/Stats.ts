import mongoose, { Schema } from 'mongoose';
import { StatsDocument } from '@/lib/types';

// Esquema para las estadísticas de juego
const statsSchema = new Schema({
  playerWins: {
    type: Number,
    required: true,
    default: 0
  },
  aiWins: {
    type: Number,
    required: true,
    default: 0
  },
  draws: {
    type: Number,
    required: true,
    default: 0
  },
  totalGames: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true
});

// Crear el modelo si no existe ya
const Stats = mongoose.models.Stats || 
  mongoose.model<StatsDocument>('Stats', statsSchema);

export default Stats;