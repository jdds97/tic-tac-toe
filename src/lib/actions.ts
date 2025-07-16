'use server';
import { revalidatePath } from 'next/cache';
import { Board, GameStats, Move, ServerActionResponse } from './types';
import { GameService } from '@/application/services/GameService';
import { StatsService } from '@/application/services/StatsService';
import { GameRepository } from '@/infrastructure/repositories/GameRepository';
import { StatsRepository } from '@/infrastructure/repositories/StatsRepository';
import { validateMove, validateGameId } from './validation/schemas';

function createGameService(): GameService {
  const gameRepository = new GameRepository();
  const statsRepository = new StatsRepository();
  return new GameService(gameRepository, statsRepository);
}

function createStatsService(): StatsService {
  const statsRepository = new StatsRepository();
  return new StatsService(statsRepository);
}

export async function iniciarJuego(): Promise<ServerActionResponse<{ gameId: string, tablero: Board, turno: string }>> {
  try {
    const gameService = createGameService();
    const game = await gameService.startGame();
    
    return {
      success: true,
      data: {
        gameId: game.id,
        tablero: game.board,
        turno: game.currentPlayer
      }
    };
  } catch (error) {
    return {
      success: false,
      message: `Error al iniciar el juego: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

export async function reiniciarJuego(): Promise<ServerActionResponse<{ gameId: string, tablero: Board, turno: string }>> {
  try {
    const gameService = createGameService();
    const game = await gameService.restartGame();
    
    revalidatePath('/');
    
    return {
      success: true,
      data: {
        gameId: game.id,
        tablero: game.board,
        turno: game.currentPlayer
      }
    };
  } catch (error) {
    return {
      success: false,
      message: `Error al reiniciar el juego: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

export async function realizarMovimientoJugador(
  gameId: string,
  movimiento: Move
): Promise<ServerActionResponse<{ tablero: Board, turno: string, estado: string, ganador: string | null }>> {
  try {
    const validatedGameId = validateGameId(gameId);
    const validatedMove = validateMove(movimiento);
    
    const gameService = createGameService();
    const game = await gameService.makePlayerMove(validatedGameId, validatedMove);
    
    revalidatePath('/');
    
    return {
      success: true,
      data: {
        tablero: game.board,
        turno: game.currentPlayer,
        estado: game.state,
        ganador: game.winner
      }
    };
  } catch (error) {
    return {
      success: false,
      message: `Error al realizar movimiento: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

export async function realizarMovimientoIA(
  gameId: string
): Promise<ServerActionResponse<{ tablero: Board, turno: string, estado: string, ganador: string | null }>> {
  try {
    const validatedGameId = validateGameId(gameId);
    
    const gameService = createGameService();
    const game = await gameService.makeAIMove(validatedGameId);
    
    revalidatePath('/');
    
    return {
      success: true,
      data: {
        tablero: game.board,
        turno: game.currentPlayer,
        estado: game.state,
        ganador: game.winner
      }
    };
  } catch (error) {
    return {
      success: false,
      message: `Error en el movimiento de la IA: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

export async function obtenerEstadisticas(): Promise<ServerActionResponse<GameStats>> {
  try {
    const statsService = createStatsService();
    const stats = await statsService.getStats();
    
    return {
      success: true,
      data: stats
    };
  } catch (error) {
    return {
      success: false,
      message: `Error al obtener estadísticas: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}