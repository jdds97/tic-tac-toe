import {
  esJugadaGanadora,
  verificarGanador,
  verificarEstadoJuego,
  obtenerMovimientoIA
} from '@/lib/gameLogic';
import {
  esTableroValido,
  esMovimientoValido,
  tableroLleno,
  tableroVacio,
  crearTableroVacio
} from '@/lib/utils';
import { Board } from '@/lib/types';

describe('Lógica de Tres en Raya', () => {
  describe('esJugadaGanadora', () => {
    it('detecta victoria en fila', () => {
      const tablero: Board = [
        ['X', 'X', 'X'],
        [null, 'O', null],
        ['O', null, null],
      ];
      expect(esJugadaGanadora(tablero, { fila: 0, columna: 2 }, 'X')).toBe(true);
    });
    it('detecta victoria en columna', () => {
      const tablero: Board = [
        ['O', 'X', null],
        ['O', 'X', null],
        [null, 'X', null],
      ];
      expect(esJugadaGanadora(tablero, { fila: 2, columna: 1 }, 'X')).toBe(true);
    });
    it('detecta victoria en diagonal', () => {
      const tablero: Board = [
        ['O', null, 'X'],
        [null, 'X', null],
        ['X', null, null],
      ];
      expect(esJugadaGanadora(tablero, { fila: 1, columna: 1 }, 'X')).toBe(true);
    });
    it('detecta que no hay victoria', () => {
      const tablero: Board = [
        ['O', 'X', 'O'],
        ['X', 'O', 'X'],
        ['X', 'O', 'X'],
      ];
      expect(esJugadaGanadora(tablero, { fila: 2, columna: 2 }, 'X')).toBe(false);
    });
  });

  describe('verificarGanador', () => {
    it('devuelve el símbolo ganador', () => {
      const tablero: Board = [
        ['X', 'X', 'X'],
        [null, 'O', null],
        ['O', null, null],
      ];
      expect(verificarGanador(tablero, { fila: 0, columna: 2 })).toBe('X');
    });
    it('devuelve empate si el tablero está lleno y no hay ganador', () => {
      const tablero: Board = [
        ['O', 'X', 'O'],
        ['X', 'O', 'X'],
        ['X', 'O', 'X'],
      ];
      expect(verificarGanador(tablero, { fila: 2, columna: 2 })).toBe('empate');
    });
    it('devuelve null si no hay ganador ni empate', () => {
      const tablero: Board = [
        ['O', 'X', null],
        ['X', 'O', null],
        ['X', null, null],
      ];
      expect(verificarGanador(tablero, { fila: 1, columna: 1 })).toBe(null);
    });
  });

  describe('verificarEstadoJuego', () => {
    it('devuelve victoria_jugador si gana X', () => {
      const tablero: Board = [
        ['X', 'X', 'X'],
        [null, 'O', null],
        ['O', null, null],
      ];
      expect(verificarEstadoJuego(tablero)).toBe('victoria_jugador');
    });
    it('devuelve victoria_ia si gana O', () => {
      const tablero: Board = [
        ['O', 'O', 'O'],
        ['X', 'X', null],
        [null, null, null],
      ];
      expect(verificarEstadoJuego(tablero)).toBe('victoria_ia');
    });
    it('devuelve empate si el tablero está lleno', () => {
      const tablero: Board = [
        ['O', 'X', 'O'],
        ['X', 'O', 'X'],
        ['X', 'O', 'X'],
      ];
      expect(verificarEstadoJuego(tablero)).toBe('empate');
    });
    it('devuelve en_progreso si el juego sigue', () => {
      const tablero: Board = [
        ['O', 'X', null],
        ['X', 'O', null],
        ['X', null, null],
      ];
      expect(verificarEstadoJuego(tablero)).toBe('en_progreso');
    });
  });

  describe('obtenerMovimientoIA', () => {
    it('elige movimiento ganador si es posible', () => {
      const tablero: Board = [
        ['O', 'O', null],
        ['X', 'X', null],
        [null, null, null],
      ];
      const move = obtenerMovimientoIA(tablero);
      expect(move).toEqual({ fila: 0, columna: 2 });
    });
    it('bloquea al jugador si va a ganar', () => {
      const tablero: Board = [
        ['X', 'X', null],
        ['O', null, null],
        [null, null, null],
      ];
      const move = obtenerMovimientoIA(tablero);
      expect(move).toEqual({ fila: 0, columna: 2 });
    });
    it('toma el centro si está libre', () => {
      const tablero: Board = [
        ['X', null, null],
        [null, null, null],
        [null, null, null],
      ];
      const move = obtenerMovimientoIA(tablero);
      expect(move).toEqual({ fila: 1, columna: 1 });
    });
    it('elige una esquina si el centro está ocupado', () => {
      const tablero: Board = [
        [null, null, null],
        [null, 'X', null],
        [null, null, null],
      ];
      const move = obtenerMovimientoIA(tablero);
      expect([
        { fila: 0, columna: 0 },
        { fila: 0, columna: 2 },
        { fila: 2, columna: 0 },
        { fila: 2, columna: 2 },
      ]).toContainEqual(move!);
    });
  });
});

describe('Utilidades de Tres en Raya', () => {
  it('valida tableros correctos e incorrectos', () => {
    expect(esTableroValido([
      [null, 'X', 'O'],
      ['X', null, 'O'],
      ['O', 'X', null],
    ])).toBe(true);
    expect(esTableroValido([
      [null, 'X'],
      ['X', null, 'O'],
      ['O', 'X', null],
    ])).toBe(false);
    expect(esTableroValido('no es un tablero')).toBe(false);
  });
  it('valida movimientos válidos e inválidos', () => {
    const tablero = crearTableroVacio();
    expect(esMovimientoValido(tablero, { fila: 0, columna: 0 })).toBe(true);
    tablero[0][0] = 'X';
    expect(esMovimientoValido(tablero, { fila: 0, columna: 0 })).toBe(false);
    expect(esMovimientoValido(tablero, { fila: 3, columna: 0 })).toBe(false);
    expect(esMovimientoValido(tablero, { fila: 0, columna: -1 })).toBe(false);
  });
  it('detecta tablero lleno y vacío', () => {
    const vacio = crearTableroVacio();
    expect(tableroVacio(vacio)).toBe(true);
    expect(tableroLleno(vacio)).toBe(false);
    const lleno: Board = [
      ['X', 'O', 'X'],
      ['O', 'X', 'O'],
      ['O', 'X', 'O'],
    ];
    expect(tableroLleno(lleno)).toBe(true);
    expect(tableroVacio(lleno)).toBe(false);
  });
});
