import React from 'react';
import { GameBoardProps } from '@/lib/types';

export default function GameBoard({ 
  tablero, 
  manejarClick, 
  cargando = false,

}: GameBoardProps) {
  return (
    <div 
      className={`grid grid-cols-3 border-2 border-gray-800 ${cargando ? 'opacity-70' : ''}`}
    >
      {tablero.map((fila, i) => (
        fila.map((celda, j) => (
          <div 
            key={`${i}-${j}`}
            className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-3xl font-bold border border-gray-400 cursor-pointer hover:bg-gray-100"
            onClick={() => manejarClick(i, j)}
          >
            {celda === 'X' && <span className="text-green-600">X</span>}
            {celda === 'O' && <span className="text-blue-600">O</span>}
          </div>
        ))
      ))}
    </div>
  );
}