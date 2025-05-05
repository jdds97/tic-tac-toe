import { Board, CellValue, GameState, Move, Player } from './types';
import { esTableroValido, tableroLleno} from './utils';

// --- Funciones privadas ---
function esLineaGanadora(celdas: CellValue[], celda: CellValue): boolean {
  return celdas.every(cell => cell === celda);
}

// --- Lógica de juego principal ---
/**
 * Verifica si una jugada en una posición dada es ganadora para un símbolo
 */
export function esJugadaGanadora(tablero: Board, movimiento: Move, celda: CellValue): boolean {
  const { fila, columna } = movimiento;
  // Verificar fila
  if (esLineaGanadora(tablero[fila], celda)) return true;
  // Verificar columna
  if (esLineaGanadora([tablero[0][columna], tablero[1][columna], tablero[2][columna]], celda)) return true;
  // Verificar diagonal principal
  if (fila === columna && esLineaGanadora([tablero[0][0], tablero[1][1], tablero[2][2]], celda)) return true;
  // Verificar diagonal secundaria
  if (fila + columna === 2 && esLineaGanadora([tablero[0][2], tablero[1][1], tablero[2][0]], celda)) return true;
  return false;
}

/**
 * Busca el último movimiento realizado en el tablero
 */
export function obtenerUltimoMovimiento(tablero: Board, anterior: Board | null = null): Move | null {
  for (let fila = 0; fila < 3; fila++) {
    for (let columna = 0; columna < 3; columna++) {
      if (anterior && anterior[fila][columna] !== tablero[fila][columna]) {
        return { fila, columna };
      }
    }
  }
  // Si no se provee el tablero, buscar la última celda ocupada
  for (let fila = 2; fila >= 0; fila--) {
    for (let columna = 2; columna >= 0; columna--) {
      if (tablero[fila][columna] !== null) {
        return { fila, columna };
      }
    }
  }
  return null;
}

/**
 * Verifica si hay un ganador o empate en el tablero, dado el último movimiento
 */
export function verificarGanador(tablero: Board, ultimoMovimiento: Move | null): CellValue | 'empate' | null {
  if (!esTableroValido(tablero) || !ultimoMovimiento) return null;
  const { fila, columna } = ultimoMovimiento;
  const valor = tablero[fila][columna];
  if (!valor) return null;
  if (esJugadaGanadora(tablero, ultimoMovimiento, valor)) {
    return valor;
  }
  if (tableroLleno(tablero)) {
    return 'empate';
  }
  return null;
}

/**
 * Verifica el estado global del juego (victoria, empate, en progreso)
 * Recorre todo el tablero para detectar victoria de X o O, sin depender del último movimiento
 */
export function verificarEstadoJuego(tablero: Board): GameState {
  if (!esTableroValido(tablero)) return 'en_progreso';
  // Revisar filas y columnas
  for (let i = 0; i < 3; i++) {
    // Fila
    if (tablero[i][0] && tablero[i][0] === tablero[i][1] && tablero[i][1] === tablero[i][2]) {
      if (tablero[i][0] === 'X') return 'victoria_jugador';
      if (tablero[i][0] === 'O') return 'victoria_ia';
    }
    // Columna
    if (tablero[0][i] && tablero[0][i] === tablero[1][i] && tablero[1][i] === tablero[2][i]) {
      if (tablero[0][i] === 'X') return 'victoria_jugador';
      if (tablero[0][i] === 'O') return 'victoria_ia';
    }
  }
  // Diagonal principal
  if (tablero[0][0] && tablero[0][0] === tablero[1][1] && tablero[1][1] === tablero[2][2]) {
    if (tablero[0][0] === 'X') return 'victoria_jugador';
    if (tablero[0][0] === 'O') return 'victoria_ia';
  }
  // Diagonal secundaria
  if (tablero[0][2] && tablero[0][2] === tablero[1][1] && tablero[1][1] === tablero[2][0]) {
    if (tablero[0][2] === 'X') return 'victoria_jugador';
    if (tablero[0][2] === 'O') return 'victoria_ia';
  }
  // Empate
  if (tableroLleno(tablero)) return 'empate';
  return 'en_progreso';
}

/**
 * La IA hace su movimiento siguiendo prioridades ganadoras:
 * 1. Ganar si es posible
 * 2. Bloquea al jugador si va a ganar
 * 3. Toma el centro, una esquina o cualquier casilla vacía
 */
export function obtenerMovimientoIA(tablero: Board): Move | null {
  // 1. Busca el  movimiento ganador 
  for (let fila = 0; fila < 3; fila++) {
    for (let columna = 0; columna < 3; columna++) {
      if (tablero[fila][columna] === null) {
        tablero[fila][columna] = 'O';
        const esGanadora = esJugadaGanadora(tablero, { fila, columna }, 'O');
        tablero[fila][columna] = null;
        if (esGanadora) {
          return { fila, columna };
        }
      }
    }
  }
  // 2. Bloquea al jugador si va a ganar
  for (let fila = 0; fila < 3; fila++) {
    for (let columna = 0; columna < 3; columna++) {
      if (tablero[fila][columna] === null) {
        tablero[fila][columna] = 'X';
        const bloquea = esJugadaGanadora(tablero, { fila, columna }, 'X');
        tablero[fila][columna] = null;
        if (bloquea) {
          return { fila, columna };
        }
      }
    }
  }
  // 3. Tomar el centro si está libre
  if (tablero[1][1] === null) {
    return { fila: 1, columna: 1 };
  }
  // 4. Tomar una esquina si está libre
  const esquinas = [
    { fila: 0, columna: 0 },
    { fila: 0, columna: 2 },
    { fila: 2, columna: 0 },
    { fila: 2, columna: 2 }
  ];
  for (const esquina of esquinas) {
    if (tablero[esquina.fila][esquina.columna] === null) {
      return esquina;
    }
  }
  // 5. Tomar cualquier casilla vacía
  for (let fila = 0; fila < 3; fila++) {
    for (let columna = 0; columna < 3; columna++) {
      if (tablero[fila][columna] === null) {
        return { fila, columna };
      }
    }
  }
  return null;
}

/**
 * Asegura que el valor de turno es válido
 */
export function turnoSeguro(turno: any): Player {
  return turno === 'jugador' || turno === 'ia' ? turno : 'jugador';
}
