import mongoose from 'mongoose';

const GameSchema = new mongoose.Schema({
  winner: {
    type: String,
    enum: ['player', 'ai', 'draw'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Evitar la redefinición del modelo en desarrollo con hot reload
export default mongoose.models.Game || mongoose.model('Game', GameSchema);