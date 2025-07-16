import { GameStats, PlayerStats } from '@/lib/types';

export class StatsEntity {
  constructor(
    public readonly playerWins: number = 0,
    public readonly aiWins: number = 0,
    public readonly draws: number = 0,
    public readonly totalGames: number = 0
  ) {}

  static createEmpty(): StatsEntity {
    return new StatsEntity(0, 0, 0, 0);
  }

  addResult(result: 'jugador' | 'ia' | 'empate'): StatsEntity {
    const newPlayerWins = result === 'jugador' ? this.playerWins + 1 : this.playerWins;
    const newAiWins = result === 'ia' ? this.aiWins + 1 : this.aiWins;
    const newDraws = result === 'empate' ? this.draws + 1 : this.draws;
    const newTotalGames = this.totalGames + 1;

    return new StatsEntity(newPlayerWins, newAiWins, newDraws, newTotalGames);
  }

  toGameStats(): GameStats {
    const jugador: PlayerStats = {
      victorias: this.playerWins,
      empates: this.draws,
      derrotas: this.aiWins
    };

    const ia: PlayerStats = {
      victorias: this.aiWins,
      empates: this.draws,
      derrotas: this.playerWins
    };

    return { jugador, ia };
  }
}