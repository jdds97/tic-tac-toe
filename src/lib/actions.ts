'use server'
import { revalidatePath } from 'next/cache';
import { Board, Move } from './types';
import { verificarGanador,tableroLleno,tableroVacio } from './gameLogic';
import { connectToDatabase } from '@/db/mongoDb';
import Game from '@/db/models/Game';

/**
 * Crea un nuevo juego o devuelve el juego activo actual
 */
export async function iniciarJuego(): Promise<{gameId: string, tablero: Board, turno: string}> {
  try {
    await connectToDatabase();
    // Buscar juego activo en progreso
    let juego = await Game.findActiveGame();
    if (
      juego &&
      juego.state === 'en_progreso' &&
      !tableroLleno(juego.board)
    ) {
      // Si hay un juego en progreso y el tablero no está lleno, devolverlo
      return {
        gameId: juego._id.toString(),
        tablero: juego.board,
        turno: juego.currentPlayer
      };
    }
    // Si no hay juego jugable, crear uno nuevo
    const board: Board = [
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ];
    juego = await Game.create({
      board,
      currentPlayer: 'jugador',
      state: 'en_progreso',
      winner: null
    });
    return {
      gameId: juego._id.toString(),
      tablero: juego.board,
      turno: juego.currentPlayer
    };
  } catch (error) {
    console.error('Error al iniciar juego:', error);
    throw error;
  }
}

/**
 * Reinicia el juego: si el tablero está vacío, reutiliza el juego existente; si no, crea uno nuevo
 */
export async function reiniciarJuego(): Promise<{gameId: string, tablero: Board, turno: string}> {
  try {
    await connectToDatabase();
    let juego = await Game.findActiveGame();
    if (
      juego &&
      juego.state === 'en_progreso' &&
      tableroVacio(juego.board)
    ) {
      // Si hay un juego en progreso y el tablero está vacío, reutilizarlo
      return {
        gameId: juego._id.toString(),
        tablero: juego.board,
        turno: juego.currentPlayer
      };
    }
    // Si no, crear uno nuevo
    const board: Board = [
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ];
    juego = await Game.create({
      board,
      currentPlayer: 'jugador',
      state: 'en_progreso',
      winner: null
    });
    return {
      gameId: juego._id.toString(),
      tablero: juego.board,
      turno: juego.currentPlayer
    };
  } catch (error) {
    console.error('Error al reiniciar juego:', error);
    throw error;
  }
}

/**
 * Procesa el movimiento del jugador
 */
export async function realizarMovimientoJugador(
  gameId: string,
  movimiento: Move
): Promise<{
  tablero: Board,
  turno: string,
  estado: string,
  ganador: string | null
}> {
  try {
    await connectToDatabase();
    const juego = await Game.findById(gameId);
    if (!juego || juego.state !== 'en_progreso') {
      throw new Error('Juego no encontrado o ya finalizado');
    }
    // Validar el movimiento
    if (juego.currentPlayer !== 'jugador' || movimiento == null) {
      throw new Error('Movimiento no válido');
    }
    // Marcar la posición en el tablero con "X"
    if (juego.board[movimiento.fila][movimiento.columna] !== null) {
      throw new Error('La casilla ya está ocupada');
    }
    juego.board[movimiento.fila][movimiento.columna] = 'X';

    // Verificar si el jugador ganó
    if (verificarGanador(juego.board, movimiento)) {
      juego.state = 'victoria_jugador';
      juego.winner = 'jugador';
      await juego.save();
      await actualizarEstadisticas('jugador');
      revalidatePath('/');
      return {
        tablero: juego.board,
        turno: 'jugador',
        estado: 'victoria_jugador',
        ganador: 'jugador'
      };
    }
    // Verificar si hay empate
    if (tableroLleno(juego.board)) {
      juego.state = 'empate';
      juego.winner = null;
      await juego.save();
      await actualizarEstadisticas('empate');
      revalidatePath('/');
      return {
        tablero: juego.board,
        turno: 'jugador',
        estado: 'empate',
        ganador: null
      };
    }
    // Cambiar turno a la IA (si quieres que la IA juegue aquí, añade la lógica)
    juego.currentPlayer = 'ia';
    await juego.save();
    revalidatePath('/');
    return {
      tablero: juego.board,
      turno: 'ia',
      estado: 'en_progreso',
      ganador: null
    };
  } catch (error) {
    console.error('Error al realizar movimiento:', error);
    throw error;
  }
}