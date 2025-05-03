import mongoose, { Types } from 'mongoose';

// Tipos básicos
export type CellValue = null | 'X' | 'O'; // Célula del tablero
export type Board = CellValue[][]; // Tablero de juego: matriz 3x3
export type Player = 'jugador' | 'ia'; // Tipo para un jugador
export type GameState = 'en_progreso' | 'victoria_jugador' | 'victoria_ia' | 'empate'; // Estados posibles del juego

// Tipos de resultados y operaciones
export type ConnectionResult = {
  success: boolean;
  message: string;
};

export type GameResult = {
  success: boolean;
  message?: string;
  data?: any;
};

export type GameStatsResult = {
  success: boolean;
  message?: string;
  data?: GameStats;
};

// Tipos para movimientos y props
export interface Move {
  fila: number;
  columna: number;
}

export interface GameBoardProps {
  tablero: Board;
  manejarClick: (fila: number, columna: number) => void;
  cargando?: boolean;
}

// Tipos de estadísticas
export interface PlayerStats {
  victorias: number;
  empates: number;
  derrotas: number;
}

export interface GameStats {
  jugador: PlayerStats;
  ia: PlayerStats;
}

// Interfaces para MongoDB
export interface GameDocument extends mongoose.Document<Types.ObjectId> {
  board: Board;
  currentPlayer: Player;
  state: GameState;
  winner: Player | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface GameModel extends mongoose.Model<GameDocument> {
  findActiveGame(): Promise<GameDocument | null>;
}

export interface StatsDocument extends mongoose.Document {
  playerWins: number;
  aiWins: number;
  draws: number;
  totalGames: number;
}

// Cache para la conexión Mongoose
export interface MongooseCache {
  conn: mongoose.Mongoose | null;
  promise: Promise<mongoose.Mongoose> | null;
}


// Hook para el estado del juego
export interface GameStateHook {
  tablero: Board;
  turnoJugador: boolean;
  estadoJuego: GameState;
  cargando: boolean;
  manejarClick: (fila: number, columna: number) => void;
  reiniciarJuego: () => void;
}

// Hook para las estadísticas del juego
export interface GameStatsHook {
  estadisticas: GameStats;
  cargando: boolean;
  cargarEstadisticas: () => Promise<void>;
}
