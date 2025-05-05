import { useMemo } from 'react';
import { FaCrown, FaRobot, FaUser } from 'react-icons/fa';
import { GameStatsProps } from '@/lib/types';

function calcularRanking(estadisticas: GameStatsProps['estadisticas']) {
  return [
    {
      nombre: 'Jugador',
      ...estadisticas.jugador,
      icon: (
        <FaUser
          className="w-6 h-6 text-green-600 bg-green-200 rounded-full p-0.5 border border-green-400 min-w-[24px] min-h-[24px]"
          aria-label="Jugador"
          title="Jugador"
        />
      ),
      bg: 'bg-gradient-to-r from-green-100 to-green-50',
    },
    {
      nombre: 'IA',
      ...estadisticas.ia,
      icon: (
        <FaRobot
          className="w-6 h-6 text-purple-700 bg-purple-100 rounded-full p-0.5 border border-purple-400 min-w-[24px] min-h-[24px]"
          aria-label="IA"
          title="IA"
        />
      ),
      bg: 'bg-gradient-to-r from-purple-100 to-purple-50',
    },
  ].sort(
    (a, b) => b.victorias * 3 + b.empates - (a.victorias * 3 + a.empates)
  );
}
// Componente para mostrar las estadísticas del juego
// Este componente muestra el ranking de jugadores y la IA, así como sus victorias, empates y derrotas
export default function GameStats({ estadisticas, cargando, error }: GameStatsProps) {
  if (cargando) {
    return <div className="mt-8 text-center p-4 animate-pulse text-gray-700">Cargando estadísticas...</div>;
  }

  if (error) {
    return <div className="mt-8 text-center p-4 text-red-500">Error: {error}</div>;
  }

  // Memoriza el ranking para evitar cálculos innecesarios
  const ranking = useMemo(() => calcularRanking(estadisticas), [estadisticas]);

  return (
    <section className="mt-10 w-full flex justify-center" aria-label="Ranking de partidas">
      <div className="rounded-2xl shadow-2xl bg-white/95 w-full max-w-sm p-6 flex flex-col items-center">
        <h2 className="text-3xl font-extrabold text-center flex items-center justify-center gap-3 text-gray-800 tracking-tight mb-6">
          <FaCrown className="text-yellow-400 animate-bounce text-4xl drop-shadow" aria-label="Ranking" title="Ranking" />
          Ranking
        </h2>
        <table className="w-full text-lg">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500 uppercase text-base">
              <th className="text-left py-2 pl-2 font-semibold">Jugador</th>
              <th className="text-center font-semibold">V</th>
              <th className="text-center font-semibold">E</th>
              <th className="text-center font-semibold">D</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((fila, idx) => (
              <tr
                key={fila.nombre}
                className={`rounded-xl ${idx === 0 ? 'bg-gradient-to-r from-yellow-100 to-yellow-50 font-extrabold shadow-md border-2 border-yellow-300/60' : 'bg-gray-50 font-medium'} transition-all duration-300 my-2`}
              >
                <td className="flex items-center gap-3 py-3 pl-2 text-gray-800 text-xl">
                  {fila.icon}
                  <span className="truncate max-w-[120px] md:max-w-[180px]">{fila.nombre}</span>
                  {idx === 0 && <FaCrown className="text-yellow-400 ml-1 animate-bounce text-xl md:text-2xl" title="Top" aria-label="Top" />}
                </td>
                <td className="text-center text-green-700 text-lg px-2">{fila.victorias}</td>
                <td className="text-center text-yellow-600 text-lg px-2">{fila.empates}</td>
                <td className="text-center text-red-500 text-lg px-2">{fila.derrotas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}