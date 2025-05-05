import { Board } from './types';

/**
 * Valida que el tablero sea una matriz 3x3 con valores válidos (null, 'X', 'O')
 */
export function esTableroValido(tablero: any): tablero is Board {
  if (!Array.isArray(tablero) || tablero.length !== 3) return false;
  for (const fila of tablero) {
    if (!Array.isArray(fila) || fila.length !== 3) return false;
    for (const celda of fila) {
      if (celda !== null && celda !== 'X' && celda !== 'O') return false;
    }
  }
  return true;
}

/**
 * Valida que un movimiento sea válido en el contexto de un tablero
 */
export function esMovimientoValido(tablero: Board, movimiento: any): boolean {
  if (!movimiento || typeof movimiento.fila !== 'number' || typeof movimiento.columna !== 'number') return false;
  if (movimiento.fila < 0 || movimiento.fila > 2 || movimiento.columna < 0 || movimiento.columna > 2) return false;
  if (tablero[movimiento.fila][movimiento.columna] !== null) return false;
  return true;
}

/**
 * Devuelve true si el tablero está lleno
 */
export function tableroLleno(tablero: Board): boolean {
  return tablero.every(fila => fila.every(celda => celda !== null));
}

/**
 * Devuelve true si el tablero está vacío
 */
export function tableroVacio(tablero: Board): boolean {
  return tablero.every(fila => fila.every(celda => celda === null));
}

/**
 * Crea un tablero vacío (3x3)
 */
export function crearTableroVacio(): Board {
  return [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];
}
