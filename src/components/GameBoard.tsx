import React from 'react';
import { GameBoardProps } from '@/lib/types';

// Componente principal del tablero de juego 3x3
// Aquí se renderiza la cuadrícula y se gestiona la interacción del usuario
export default function GameBoard({ 
  tablero, 
  manejarClick, 
  cargando = false,
  turno = 'jugador',
}: GameBoardProps) {
  
  // Renderiza una celda individual del tablero
  const renderCelda = (i: number, j: number, celda: string | null) => (
    <button
      key={`${i}-${j}`}
      className={`w-20 h-20 cursor-pointer sm:w-24 sm:h-24 flex items-center justify-center text-4xl font-extrabold rounded-2xl shadow-md bg-gradient-to-br from-gray-50 to-gray-200 text-gray-800 transition-all duration-200
        ${cargando ? 'opacity-60 pointer-events-none' : 'hover:scale-105 hover:from-blue-100 hover:to-purple-100'}
      `}
      onClick={() => manejarClick(i, j)}
      disabled={cargando || celda !== null}
      aria-label={`Celda ${i + 1},${j + 1}${celda ? ', ocupada por ' + celda : ''}`}
      aria-disabled={cargando || celda !== null}
      tabIndex={celda === null && !cargando ? 0 : -1}
      role="button"
    >
      {/* Mostramos el símbolo si la celda está ocupada */}
      {celda === 'X' && <span className="animate-pop">X</span>}
      {celda === 'O' && <span className="animate-pop">O</span>}
    </button>
  );

  return (
    <div className="relative w-full flex flex-col items-center">
      <div
        className="rounded-3xl shadow-2xl bg-white/90 border border-gray-100 p-6 backdrop-blur-md flex flex-col items-center transition-all duration-300 min-w-[260px] max-w-[340px] mx-auto"
        role="region"
        aria-label="Tablero de tres en raya"
      >
        {/* Renderizado de la cuadrícula 3x3 */}
        <div className="grid grid-cols-3 gap-3">
          {tablero.map((fila, i) =>
            fila.map((celda, j) => renderCelda(i, j, celda))
          )}
        </div>
        {/* Overlay que bloquea el tablero y avisa cuando la IA está pensando */}
        {cargando && turno === 'ia' && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10 rounded-3xl" aria-live="polite">
            <span className="text-lg text-blue-700 font-semibold animate-pulse">La IA está pensando...</span>
          </div>
        )}
      </div>
    </div>
  );
}