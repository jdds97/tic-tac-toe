import mongoose, { Schema } from 'mongoose';
import { GameDocument, GameModel } from '@/lib/types';

// Esquema para el documento de juego
const gameSchema = new Schema({
  board: {
    type: [[Schema.Types.Mixed]],
    required: true,
    validate: {
      validator: function(board: any[][]) {
        // Validar que el tablero sea 3x3
        if (!Array.isArray(board) || board.length !== 3) return false;
        
        // Validar que cada fila tenga 3 elementos
        for (const row of board) {
          if (!Array.isArray(row) || row.length !== 3) return false;
          
          // Validar que cada celda sea null, 'X' o 'O'
          for (const cell of row) {
            if (cell !== null && cell !== 'X' && cell !== 'O') return false;
          }
        }
        
        return true;
      },
      message: 'El tablero debe ser una matriz 3x3 con valores null, "X" o "O"'
    }
  },
  currentPlayer: {
    type: String,
    enum: ['jugador', 'ia'],
    required: true
  },
  state: {
    type: String,
    enum: ['en_progreso', 'victoria_jugador', 'victoria_ia', 'empate'],
    required: true,
    default: 'en_progreso'
  },
  winner: {
    type: String,
    enum: ['jugador', 'ia', null],
    default: null
  }
}, {
  timestamps: true
});

// Método estático para encontrar juego activo
gameSchema.statics.findActiveGame = function() {
  return this.findOne({ state: 'en_progreso' }).sort({ createdAt: -1 });
};

// Crear el modelo si no existe ya para evitar duplicados
const Game = (mongoose.models.Game || 
  mongoose.model<GameDocument, GameModel>('Game', gameSchema)) as GameModel;

export default Game;