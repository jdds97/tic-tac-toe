import { useEffect, useCallback } from 'react';
import { Move } from '@/lib/types';
import useGameLogic from './useGameLogic';

export default function useGameFlow() {
  const { 
    gameState, 
    isLoading, 
    error, 
    startGame, 
    restartGame, 
    makePlayerMove, 
    makeAIMove 
  } = useGameLogic();

  useEffect(() => {
    startGame();
  }, [startGame]);

  useEffect(() => {
    if (gameState.estadoJuego === 'victoria_jugador' || 
        gameState.estadoJuego === 'victoria_ia' || 
        gameState.estadoJuego === 'empate') {
      const timeout = setTimeout(() => {
        restartGame();
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [gameState.estadoJuego, restartGame]);

  const handleCellClick = useCallback(async (fila: number, columna: number) => {
    if (isLoading || gameState.estadoJuego !== 'en_progreso' || gameState.turno !== 'jugador') {
      return;
    }

    const move: Move = { fila, columna };
    await makePlayerMove(move);
  }, [isLoading, gameState.estadoJuego, gameState.turno, makePlayerMove]);

  useEffect(() => {
    if (gameState.turno === 'ia' && gameState.estadoJuego === 'en_progreso' && !isLoading) {
      const timeout = setTimeout(() => {
        makeAIMove();
      }, 1200);
      return () => clearTimeout(timeout);
    }
  }, [gameState.turno, gameState.estadoJuego, isLoading, makeAIMove]);

  return {
    gameId: gameState.gameId,
    tablero: gameState.tablero,
    estadoJuego: gameState.estadoJuego,
    ganador: gameState.ganador,
    turno: gameState.turno,
    cargando: isLoading,
    error,
    manejarClick: handleCellClick,
    reiniciarJuego: restartGame
  };
}