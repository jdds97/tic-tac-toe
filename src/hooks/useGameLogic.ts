import { useState, useCallback } from 'react';
import { Board, GameState, Move } from '@/lib/types';
import { 
  iniciarJuego, 
  realizarMovimientoJugador, 
  realizarMovimientoIA, 
  reiniciarJuego 
} from '@/lib/actions';
import { turnoSeguro } from '@/lib/gameLogic';

export interface GameLogicState {
  gameId: string | null;
  tablero: Board;
  estadoJuego: GameState;
  ganador: string | null;
  turno: 'jugador' | 'ia';
}

export default function useGameLogic() {
  const [gameState, setGameState] = useState<GameLogicState>({
    gameId: null,
    tablero: [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ],
    estadoJuego: 'en_progreso',
    ganador: null,
    turno: 'jugador'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startGame = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await iniciarJuego();
      if (!res.success) {
        setError(res.message || 'Error al iniciar el juego');
        return;
      }
      
      setGameState({
        gameId: res.data!.gameId,
        tablero: res.data!.tablero,
        estadoJuego: 'en_progreso',
        ganador: null,
        turno: turnoSeguro(res.data!.turno)
      });
    } catch {
      setError('Error al iniciar el juego');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const restartGame = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await reiniciarJuego();
      if (!res.success) {
        setError(res.message || 'Error al reiniciar el juego');
        return;
      }
      
      setGameState({
        gameId: res.data!.gameId,
        tablero: res.data!.tablero,
        estadoJuego: 'en_progreso',
        ganador: null,
        turno: turnoSeguro(res.data!.turno)
      });
    } catch {
      setError('Error al reiniciar el juego');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const makePlayerMove = useCallback(async (move: Move) => {
    if (!gameState.gameId || gameState.estadoJuego !== 'en_progreso') return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await realizarMovimientoJugador(gameState.gameId, move);
      if (!res.success) {
        setError(res.message || 'Movimiento no válido');
        return;
      }
      
      setGameState(prev => ({
        ...prev,
        tablero: res.data!.tablero,
        estadoJuego: res.data!.estado as GameState,
        ganador: res.data!.ganador,
        turno: turnoSeguro(res.data!.turno)
      }));
    } catch {
      setError('Error al realizar movimiento');
    } finally {
      setIsLoading(false);
    }
  }, [gameState.gameId, gameState.estadoJuego]);

  const makeAIMove = useCallback(async () => {
    if (!gameState.gameId || gameState.estadoJuego !== 'en_progreso') return;
    
    setIsLoading(true);
    
    try {
      const res = await realizarMovimientoIA(gameState.gameId);
      if (!res.success) {
        setError(res.message || 'Error en el turno de la IA');
        return;
      }
      
      setGameState(prev => ({
        ...prev,
        tablero: res.data!.tablero,
        estadoJuego: res.data!.estado as GameState,
        ganador: res.data!.ganador,
        turno: turnoSeguro(res.data!.turno)
      }));
    } catch {
      setError('Error en el turno de la IA');
    } finally {
      setIsLoading(false);
    }
  }, [gameState.gameId, gameState.estadoJuego]);

  return {
    gameState,
    isLoading,
    error,
    startGame,
    restartGame,
    makePlayerMove,
    makeAIMove
  };
}