'use client';

import { useEffect } from 'react';
import { FaRedo, FaSmile, FaFrown, FaMeh, FaRobot } from 'react-icons/fa';
import GameBoard from '@/components/GameBoard';
import GameStats from '@/components/GameStats';
import useGameState from '@/hooks/useGameState';
import useGameStats from '@/hooks/useGameStats';
import { GameStatusProps } from '@/lib/types';

function GameStatus({ estadoJuego, errorJuego, turno }: GameStatusProps) {
  if (errorJuego) {
    return (
      <div className="mt-4 text-xl text-red-600 font-bold flex items-center gap-2">
        <FaFrown className="text-3xl text-red-500 animate-shake" />Error: {errorJuego}
      </div>
    );
  }
  switch (estadoJuego) {
    case 'en_progreso':
      return (
        <div className="mt-4 text-2xl font-semibold flex flex-col items-center gap-1 text-gray-900 drop-shadow">
          {turno === 'jugador' ? (
            <div className="flex items-center gap-2">
              <FaSmile className="text-green-500 text-3xl animate-pop" />Tu turno (X)
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <FaRobot className="text-blue-500 text-3xl animate-pop" />Turno de la IA (O)
              </div>
            </>
          )}
        </div>
      );
    case 'victoria_jugador':
      return (
        <div className="mt-4 text-3xl font-bold text-green-700 flex items-center gap-2 animate-pop">
          <FaSmile className="text-4xl text-green-500 animate-bounce" />¡Has ganado!
        </div>
      );
    case 'victoria_ia':
      return (
        <div className="mt-4 text-3xl font-bold text-red-700 flex items-center gap-2 animate-pop">
          <FaFrown className="text-4xl text-red-500 animate-bounce" />Has perdido
        </div>
      );
    case 'empate':
      return (
        <div className="mt-4 text-3xl font-bold text-yellow-600 flex items-center gap-2 animate-pop">
          <FaMeh className="text-4xl text-yellow-400 animate-bounce" />¡Empate!
        </div>
      );
    default:
      return null;
  }
}

export default function Home() {
  const {
    tablero,
    estadoJuego,
    cargando: cargandoJuego,
    error: errorJuego,
    manejarClick,
    reiniciarJuego,
    turno
  } = useGameState();
  const { estadisticas, cargando: cargandoStats, error: errorStats, cargarEstadisticas } = useGameStats();

  useEffect(() => {
    if (
      estadoJuego === 'victoria_jugador' ||
      estadoJuego === 'victoria_ia' ||
      estadoJuego === 'empate'
    ) {
      cargarEstadisticas();
    }
  }, [estadoJuego, cargarEstadisticas]);

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-start p-4 sm:p-8 bg-gradient-to-br from-blue-200 via-purple-100 to-pink-100 animate-bg">
      <h1 className="text-5xl font-extrabold mb-8 text-center text-gray-900 drop-shadow-lg tracking-tight">Tres en Raya</h1>
      <GameStatus
        estadoJuego={estadoJuego}
        errorJuego={errorJuego}
        cargandoJuego={cargandoJuego}
        turno={turno}
      />
      <div className="flex flex-col md:flex-row w-full max-w-4xl gap-10 items-start justify-center mt-8">
        <div className="flex-1 flex flex-col items-center md:items-end w-full max-w-md">
          <GameBoard
            tablero={tablero}
            manejarClick={manejarClick}
            cargando={cargandoJuego}
            turno={turno}
          />
          <div className="flex justify-center w-full mt-8">
            <button
              className="py-3 px-8 max-w-xs w-full cursor-pointer bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xl font-bold rounded-full shadow-lg hover:scale-105 hover:from-blue-600 hover:to-purple-600 transition-all flex items-center justify-center gap-3 disabled:opacity-60 btn-pulse btn-press btn-tooltip"
              data-tooltip="Reinicia la partida"
              onClick={reiniciarJuego}
              disabled={cargandoJuego}
              tabIndex={0}
              aria-label="Reiniciar Juego"
              type="button"
            >
              {cargandoJuego ? (
                <span className="spinner" aria-label="Cargando" />
              ) : (
                <FaRedo className="text-2xl animate-spin-slow drop-shadow" />
              )}
              <span className="font-bold tracking-wide text-xl">Reiniciar Juego</span>
            </button>
          </div>
        </div>
        <div className="flex-1 flex justify-center md:justify-start w-full max-w-sm mt-10 md:mt-0">
          <GameStats
            estadisticas={estadisticas}
            cargando={cargandoStats}
            error={errorStats}
          />
        </div>
      </div>
    </main>
  );
}
