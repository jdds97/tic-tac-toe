import { FaSmile, FaFrown, FaMeh, FaRobot } from 'react-icons/fa';
import { GameStatusProps } from '@/lib/types';

export default function GameStatus({ estadoJuego, errorJuego, turno }: GameStatusProps) {
  if (errorJuego) {
    return (
      <div className="mt-4 text-xl text-red-600 font-bold flex items-center gap-2">
        <FaFrown className="text-3xl text-red-500 animate-shake" />
        Error: {errorJuego}
      </div>
    );
  }

  switch (estadoJuego) {
    case 'en_progreso':
      return (
        <div className="mt-4 text-2xl font-semibold flex flex-col items-center gap-1 text-gray-900 drop-shadow">
          {turno === 'jugador' ? (
            <div className="flex items-center gap-2">
              <FaSmile className="text-green-500 text-3xl animate-pop" />
              Tu turno (X)
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <FaRobot className="text-blue-500 text-3xl animate-pop" />
              Turno de la IA (O)
            </div>
          )}
        </div>
      );
    case 'victoria_jugador':
      return (
        <div className="mt-4 text-3xl font-bold text-green-700 flex items-center gap-2 animate-pop">
          <FaSmile className="text-4xl text-green-500 animate-bounce" />
          ¡Has ganado!
        </div>
      );
    case 'victoria_ia':
      return (
        <div className="mt-4 text-3xl font-bold text-red-700 flex items-center gap-2 animate-pop">
          <FaFrown className="text-4xl text-red-500 animate-bounce" />
          Has perdido
        </div>
      );
    case 'empate':
      return (
        <div className="mt-4 text-3xl font-bold text-yellow-600 flex items-center gap-2 animate-pop">
          <FaMeh className="text-4xl text-yellow-400 animate-bounce" />
          ¡Empate!
        </div>
      );
    default:
      return null;
  }
}