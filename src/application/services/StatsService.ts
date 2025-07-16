import { IStatsRepository } from '@/infrastructure/repositories/StatsRepository';
import { GameStats } from '@/lib/types';

export class StatsService {
  constructor(private statsRepository: IStatsRepository) {}

  async getStats(): Promise<GameStats> {
    const stats = await this.statsRepository.find();
    return stats.toGameStats();
  }

  async updateStats(result: 'jugador' | 'ia' | 'empate'): Promise<void> {
    const currentStats = await this.statsRepository.find();
    const updatedStats = currentStats.addResult(result);
    await this.statsRepository.save(updatedStats);
  }
}