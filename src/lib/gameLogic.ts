import { Board, CellValue, GameState, Move } from './types';

/**
 * Verifica si hay un ganador o empate en el tablero
 * @param {Board} tablero - El tablero actual
 * @param {Move} ultimoMovimiento - El último movimiento realizado
 * @returns {CellValue | 'empate' | null} - 'X', 'O', 'empate' o null si el juego continúa
 */
export const verificarGanador = (tablero: Board, ultimoMovimiento: Move): CellValue | 'empate' | null => {
  const { fila, columna } = ultimoMovimiento;
  const valor = tablero[fila][columna];
  if (!valor) return null;

  // Verificar fila
  if (tablero[fila].every(cell => cell === valor)) {
    return valor;
  }
  // Verificar columna
  if ([0, 1, 2].every(i => tablero[i][columna] === valor)) {
    return valor;
  }
  // Verificar diagonal principal
  if (fila === columna && [0, 1, 2].every(i => tablero[i][i] === valor)) {
    return valor;
  }
  // Verificar diagonal secundaria
  if (fila + columna === 2 && [0, 1, 2].every(i => tablero[i][2 - i] === valor)) {
    return valor;
  }
  if (tableroLleno(tablero)) {
    return 'empate';
  }
  return null;
};

export function tableroLleno(tablero: Board): boolean {
  return tablero.every(fila => fila.every(celda => celda !== null));
}

export function tableroVacio(board: Board): boolean {
  return board.every(fila => fila.every(celda => celda === null));
}

export function verificarEstadoJuego(tablero: Board): GameState {
  const ganador = verificarGanador(tablero, { fila: 0, columna: 0 }); // Se requiere un último movimiento
  
  if (ganador === 'X') return 'victoria_jugador';
  if (ganador === 'O') return 'victoria_ia';
  if (tableroLleno(tablero)) return 'empate';
  
  return 'en_progreso';
}