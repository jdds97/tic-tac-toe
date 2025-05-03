'use client';

import GameBoard from '../components/GameBoard';
import useGameState from '../hooks/useGameState';

export default function Home() {
  const { 
    tablero, 
    estadoJuego, 
    cargando: cargandoJuego, 
    error: errorJuego,
    manejarClick, 
    reiniciarJuego 
  } = useGameState();

  // Renderizar mensaje de estado
  const renderizarEstado = () => {
    if (errorJuego) {
      return <div className="mt-4 text-xl text-red-600">Error: {errorJuego}</div>;
    }
    switch (estadoJuego) {
      case 'en_progreso':
        return (
          <div className="mt-4 text-xl">
            {cargandoJuego ? 'Cargando...' : 'Tu turno (X)'}
          </div>
        );
      case 'victoria_jugador':
        return <div className="mt-4 text-xl text-green-600">¡Has ganado!</div>;
      case 'victoria_ia':
        return <div className="mt-4 text-xl text-red-600">Has perdido</div>;
      case 'empate':
        return <div className="mt-4 text-xl text-yellow-600">¡Empate!</div>;
      default:
        return null;
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-8">
      <h1 className="text-4xl font-bold mb-8">Tres en Raya</h1>
      {renderizarEstado()}
      <div className="mt-6">
        <GameBoard 
          tablero={tablero} 
          manejarClick={manejarClick}
          cargando={cargandoJuego} 
        />
      </div>
      <button 
        className="mt-6 py-2 px-6 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-60"
        onClick={reiniciarJuego}
        disabled={cargandoJuego}
      >
        Reiniciar Juego
      </button>
    </main>
  );
}
