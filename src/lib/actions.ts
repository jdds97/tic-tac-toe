'use server';
import { revalidatePath } from 'next/cache';
import { Board, GameStats, Move, ServerActionResponse } from './types';
import { verificarGanador, obtenerMovimientoIA } from './gameLogic';
import { crearTableroVacio, tableroLleno, tableroVacio } from './utils';
import { connectToDatabase } from '@/db/mongoDb';
import Game from '@/db/models/Game';
import Stats from '@/db/models/Stats';

// --- FUNCIONES AUXILIARES PRIVADAS ---

/**
 * Auxiliar para obtener y validar el juego y el turno actual
 */
async function procesarTurno(gameId: string, turnoEsperado: 'jugador' | 'ia') {
  await connectToDatabase();
  const juego = await Game.findById(gameId);
  if (!juego || juego.state !== 'en_progreso') {
    throw new Error('Juego no encontrado o ya finalizado');
  }
  if (juego.currentPlayer !== turnoEsperado) {
    throw new Error(`No es el turno de ${turnoEsperado}`);
  }
  return juego;
}

/**
 * Lógica común para procesar el final de un turno (jugador o IA)
 */
async function procesarFinDeTurno(juego: any, movimiento: Move, jugador: 'jugador' | 'ia') {
  const resultado = verificarGanador(juego.board, movimiento);
  if (resultado === 'X' || resultado === 'O') {
    const estado = resultado === 'X' ? 'victoria_jugador' : 'victoria_ia';
    juego.state = estado;
    juego.winner = resultado === 'X' ? 'jugador' : 'ia';
    await juego.save();
    await actualizarEstadisticas(juego.winner);
    revalidatePath('/');
    return {
      tablero: juego.board,
      turno: jugador,
      estado,
      ganador: juego.winner
    };
  }
  if (resultado === 'empate') {
    juego.state = 'empate';
    juego.winner = null;
    await juego.save();
    await actualizarEstadisticas('empate');
    revalidatePath('/');
    return {
      tablero: juego.board,
      turno: null,
      estado: 'empate',
      ganador: null
    };
  }
  // Si el juego sigue, cambiar el turno
  juego.currentPlayer = jugador === 'jugador' ? 'ia' : 'jugador';
  await juego.save();
  revalidatePath('/');
  return {
    tablero: juego.board,
    turno: juego.currentPlayer,
    estado: 'en_progreso',
    ganador: null
  };
}

/**
 * Lógica genérica para iniciar o reiniciar un juego
 * @param reiniciar Si es true, fuerza la creación de un nuevo juego
 */
async function gestionarJuego(reiniciar = false): Promise<ServerActionResponse<{ gameId: string, tablero: Board, turno: string }>> {
  try {
    await connectToDatabase();
    let juego = await Game.findActiveGame();
    if (!reiniciar && juego && juego.state === 'en_progreso' && !tableroLleno(juego.board)) {
      return {
        success: true,
        data: {
          gameId: juego._id.toString(),
          tablero: juego.board,
          turno: juego.currentPlayer
        }
      };
    }
    if (reiniciar && juego && juego.state === 'en_progreso' && tableroVacio(juego.board)) {
      return {
        success: true,
        data: {
          gameId: juego._id.toString(),
          tablero: juego.board,
          turno: juego.currentPlayer
        }
      };
    }
    const board = crearTableroVacio();
    juego = await Game.create({
      board,
      currentPlayer: 'jugador',
      state: 'en_progreso',
      winner: null
    });
    return {
      success: true,
      data: {
        gameId: juego._id.toString(),
        tablero: juego.board,
        turno: juego.currentPlayer
      }
    };
  } catch (error) {
    return {
      success: false,
      message: `Error al gestionar el juego: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

// --- ACCIONES PRINCIPALES EXPORTADAS ---

/**
 * Inicia un nuevo juego o devuelve el juego activo
 */
export async function iniciarJuego(): Promise<ServerActionResponse<{ gameId: string, tablero: Board, turno: string }>> {
  return gestionarJuego(false);
}

/**
 * Reinicia el juego (fuerza nuevo tablero si es necesario)
 */
export async function reiniciarJuego(): Promise<ServerActionResponse<{ gameId: string, tablero: Board, turno: string }>> {
  return gestionarJuego(true);
}

/**
 * Procesa el movimiento del jugador
 */
export async function realizarMovimientoJugador(
  gameId: string,
  movimiento: Move
): Promise<ServerActionResponse<{ tablero: Board, turno: string, estado: string, ganador: string | null }>> {
  try {
    const juego = await procesarTurno(gameId, 'jugador');
    if (movimiento == null) {
      return { success: false, message: 'Movimiento no válido' };
    }
    if (juego.board[movimiento.fila][movimiento.columna] !== null) {
      return { success: false, message: 'La casilla ya está ocupada' };
    }
    juego.board[movimiento.fila][movimiento.columna] = 'X';
    const resultado = await procesarFinDeTurno(juego, movimiento, 'jugador');
    return {
      success: true,
      data: resultado
    };
  } catch (error) {
    return {
      success: false,
      message: `Error al realizar movimiento: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Procesa el movimiento de la IA
 */
export async function realizarMovimientoIA(gameId: string): Promise<ServerActionResponse<{ tablero: Board, turno: string, estado: string, ganador: string | null }>> {
  try {
    const juego = await procesarTurno(gameId, 'ia');
    const movimiento = obtenerMovimientoIA(juego.board);
    if (!movimiento) {
      return { success: false, message: 'No hay movimientos posibles para la IA' };
    }
    juego.board[movimiento.fila][movimiento.columna] = 'O';
    const resultado = await procesarFinDeTurno(juego, movimiento, 'ia');
    return {
      success: true,
      data: resultado
    };
  } catch (error) {
    return {
      success: false,
      message: `Error en el movimiento de la IA: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Obtiene las estadísticas globales de partidas
 */
export async function obtenerEstadisticas(): Promise<ServerActionResponse<GameStats>> {
  try {
    await connectToDatabase();
    let stats = await Stats.findOne();
    if (!stats) {
      stats = await Stats.create({});
    }
    // Calcular el formato esperado por GameStats
    const jugador = {
      victorias: stats.playerWins,
      empates: stats.draws,
      derrotas: stats.aiWins
    };
    const ia = {
      victorias: stats.aiWins,
      empates: stats.draws,
      derrotas: stats.playerWins
    };
    return {
      success: true,
      data: { jugador, ia }
    };
  } catch (error) {
    return {
      success: false,
      message: `Error al obtener estadísticas: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Actualiza las estadísticas globales según el resultado
 */
export async function actualizarEstadisticas(
  resultado: 'jugador' | 'ia' | 'empate'): Promise<ServerActionResponse<void>> {
  try {
    await connectToDatabase();
    let stats = await Stats.findOne();
    if (!stats) {
      stats = await Stats.create({});
    }
    if (resultado === 'jugador') {
      stats.playerWins += 1;
    } else if (resultado === 'ia') {
      stats.aiWins += 1;
    } else if (resultado === 'empate') {
      stats.draws += 1;
    }
    stats.totalGames += 1;
    await stats.save();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: `Error al actualizar estadísticas: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}
