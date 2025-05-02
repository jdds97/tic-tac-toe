import mongoose from 'mongoose';
export interface GameBoardProps {
  gameId?: string;
  onGameComplete?: (result: string) => void;
}

export interface MongooseCache {
  conn: mongoose.Mongoose | null;
  promise: Promise<mongoose.Mongoose> | null;
}

export type ConnectionResult = {
  success: boolean;
  message: string;
};

export type GameResult = {
  success: boolean;
  message?: string;
  data?: any;
};

export type GameStatsData = {
  player: number;
  ai: number;
  draws: number;
  total: number;
};

export type GameStatsResult = {
  success: boolean;
  message?: string;
  data?: GameStatsData;
};