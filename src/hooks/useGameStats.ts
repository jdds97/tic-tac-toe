import { useState, useEffect, useCallback } from 'react';
import { GameStats, GameStatsResult } from '@/lib/types';
import { obtenerEstadisticas } from '@/lib/actions';

export default function useGameStats() {
  const [estadisticas, setEstadisticas] = useState<GameStats>({
    jugador: { victorias: 0, empates: 0, derrotas: 0 },
    ia: { victorias: 0, empates: 0, derrotas: 0 }
  });
  
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Usar useCallback para evitar recrear la función en cada renderizado
  const cargarEstadisticas = useCallback(async () => {
    setCargando(true);
    setError(null);
    
    try {
      const response: GameStatsResult = await obtenerEstadisticas();
      
      if (response.success && response.data) {
        setEstadisticas(response.data);
      } else {
        setError(response.message || 'Error al cargar estadísticas');
        console.error('Error:', response.message);
      }
    } catch (error) {
      setError(`Error inesperado: ${error instanceof Error ? error.message : String(error)}`);
      console.error('Error:', error);
    } finally {
      setCargando(false);
    }
  }, []);
  
  // Cargar estadísticas al inicio
  useEffect(() => {
    cargarEstadisticas();
  }, [cargarEstadisticas]);
  
  return {
    estadisticas,
    cargando,
    error,
    cargarEstadisticas
  };
}