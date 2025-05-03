import { useState, useEffect } from 'react';
import { Board, GameState, Move } from '@/lib/types';
import { iniciarJuego, realizarMovimientoJugador, reiniciarJuego } from '@/lib/actions';

export default function useGameState() {
  const [gameId, setGameId] = useState<string | null>(null);
  const [tablero, setTablero] = useState<Board>([
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]);
  const [estadoJuego, setEstadoJuego] = useState<GameState>('en_progreso');
  const [ganador, setGanador] = useState<string | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Inicializar el juego al montar el hook
  useEffect(() => {
    const init = async () => {
      setCargando(true);
      setError(null);
      try {
        const res = await iniciarJuego();
        setGameId(res.gameId);
        setTablero(res.tablero);
        setEstadoJuego('en_progreso');
        setGanador(null);
      } catch (e) {
        setError('Error al iniciar el juego');
      } finally {
        setCargando(false);
      }
    };
    init();
  }, []);

  // Manejar el click del jugador
  const manejarClick = async (fila: number, columna: number) => {
    if (!gameId || cargando || estadoJuego !== 'en_progreso') return;
    setCargando(true);
    setError(null);
    try {
      let movimiento : Move = { fila, columna };
      const res = await realizarMovimientoJugador(gameId,movimiento);
      setTablero(res.tablero);
      setEstadoJuego(res.estado as GameState);
      setGanador(res.ganador);
    } catch (e) {
      setError('Movimiento no válido o error en el servidor');
    } finally {
      setCargando(false);
    }
  };

  // Reiniciar el juego usando reiniciarJuego (siempre crea uno nuevo)
  const reiniciar = async () => {
    setCargando(true);
    setError(null);
    try {
      const res = await reiniciarJuego();
      setGameId(res.gameId);
      setTablero(res.tablero);
      setEstadoJuego('en_progreso');
      setGanador(null);
    } catch (e) {
      setError('Error al reiniciar el juego');
    } finally {
      setCargando(false);
    }
  };

  return {
    gameId,
    tablero,
    estadoJuego,
    ganador,
    cargando,
    error,
    manejarClick,
    reiniciarJuego: reiniciar,
  };
}