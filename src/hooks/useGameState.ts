import { useState, useEffect } from 'react';
import { Board, GameState, Move } from '@/lib/types';
import { iniciarJuego, realizarMovimientoJugador, realizarMovimientoIA, reiniciarJuego } from '@/lib/actions';
import { turnoSeguro } from '@/lib/gameLogic';

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
  const [turno, setTurno] = useState<'jugador' | 'ia'>('jugador');

  // Inicializar el juego al montar el hook
  useEffect(() => {
    const init = async () => {
      setCargando(true);
      setError(null);
      try {
        const res = await iniciarJuego();
        if (!res.success) {
          setError(res.message || 'Error al iniciar el juego');
          setCargando(false);
          return;
        }
        setGameId(res.data!.gameId);
        setTablero(res.data!.tablero);
        setEstadoJuego('en_progreso');
        setGanador(null);
        setTurno(turnoSeguro(res.data!.turno));
      } catch (e) {
        setError('Error al iniciar el juego');
      } finally {
        setCargando(false);
      }
    };
    init();
  }, []);

  // Reinicio automático tras victoria o empate
  useEffect(() => {
    if (estadoJuego === 'victoria_jugador' || estadoJuego === 'victoria_ia' || estadoJuego === 'empate') {
      const timeout = setTimeout(() => {
        reiniciar();
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [estadoJuego]);

  // Manejar el click del jugador
  const manejarClick = async (fila: number, columna: number) => {
    // No permitir jugadas si el juego terminó
    if (!gameId || cargando || estadoJuego !== 'en_progreso') return;
    setCargando(true);
    setError(null);
    try {
      let movimiento : Move = { fila, columna };
      const res = await realizarMovimientoJugador(gameId, movimiento);
      if (!res.success) {
        setError(res.message || 'Movimiento no válido o error en el servidor');
        setCargando(false);
        return;
      }
      setTablero(res.data!.tablero);
      await new Promise(resolve => setTimeout(resolve, 500));
      setEstadoJuego(res.data!.estado as GameState);
      setGanador(res.data!.ganador);
      setTurno(turnoSeguro(res.data!.turno));
      // Solo llamar a la IA si el juego sigue en progreso
      if (res.data!.turno === 'ia' && res.data!.estado === 'en_progreso') {
        setCargando(true); // Mostrar overlay de la IA
        await new Promise(resolve => setTimeout(resolve, 1200));
        const resIA = await realizarMovimientoIA(gameId);
        if (!resIA.success) {
          setError(resIA.message || 'Error en el turno de la IA');
          setCargando(false);
          return;
        }
        setTablero(resIA.data!.tablero);
        setEstadoJuego(resIA.data!.estado as GameState);
        setGanador(resIA.data!.ganador);
        setTurno(turnoSeguro(resIA.data!.turno));
        setCargando(false); // Ocultar overlay de la IA
        return;
      }
      setCargando(false); // Si no es turno de la IA, se oculta cargando aquí
    } catch (e) {
      setError('Movimiento no válido o error en el servidor');
      setCargando(false);
    }
  };

  // Reiniciar el juego usando reiniciarJuego creando siempre un nuevo juego si es necesario
  const reiniciar = async () => {
    setCargando(true);
    setError(null);
    try {
      const res = await reiniciarJuego();
      if (!res.success) {
        setError(res.message || 'Error al reiniciar el juego');
        setCargando(false);
        return;
      }
      setGameId(res.data!.gameId);
      setTablero(res.data!.tablero);
      setEstadoJuego('en_progreso');
      setGanador(null);
      setTurno(turnoSeguro(res.data!.turno));
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
    turno,
  };
}