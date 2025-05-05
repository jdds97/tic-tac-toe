import mongoose, { Types } from 'mongoose';

// Tipos básicos para el juego
export type CellValue = null | 'X' | 'O'; // Una celda puede estar vacía, ser X o ser O
export type Board = CellValue[][]; // Tablero de 3x3
export type Player = 'jugador' | 'ia'; // Jugador humano o IA
export type GameState = 'en_progreso' | 'victoria_jugador' | 'victoria_ia' | 'empate'; // Estado global de la partida

// Tipos de resultados y operaciones
export type ConnectionResult = {
  success: boolean;
  message: string;
};

export type GameStatsResult = {
  success: boolean;
  message?: string;
  data?: GameStats;
};

// Tipo genérico para respuestas de server actions
export type ServerActionResponse<T = undefined> = {
  success: boolean;
  message?: string;
  data?: T;
};

// Movimiento en el tablero
export interface Move {
  fila: number;
  columna: number;
}

// Props del componente GameBoard
export interface GameBoardProps {
  tablero: Board;
  manejarClick: (fila: number, columna: number) => void;
  cargando?: boolean;
  turno?: Player;
}
// Props del componente GameStats
export interface GameStatsProps {
  estadisticas: GameStats;
  cargando: boolean;
  error?: string | null;
}

// Tipado explícito para las props de GameStatus
export interface GameStatusProps {
  estadoJuego: string;
  errorJuego: string | null;
  cargandoJuego: boolean;
  turno: 'jugador' | 'ia';
}
// Estadísticas individuales y globales
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
