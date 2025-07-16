import { StatsEntity } from '@/domain/entities/Stats';
import { connectToDatabase } from '@/db/mongoDb';
import StatsModel from '@/db/models/Stats';

export interface IStatsRepository {
  find(): Promise<StatsEntity>;
  save(stats: StatsEntity): Promise<StatsEntity>;
}

export class StatsRepository implements IStatsRepository {
  async find(): Promise<StatsEntity> {
    await connectToDatabase();
    let statsDoc = await StatsModel.findOne();
    
    if (!statsDoc) {
      statsDoc = await StatsModel.create({});
    }
    
    return new StatsEntity(
      statsDoc.playerWins,
      statsDoc.aiWins,
      statsDoc.draws,
      statsDoc.totalGames
    );
  }

  async save(stats: StatsEntity): Promise<StatsEntity> {
    await connectToDatabase();
    let statsDoc = await StatsModel.findOne();
    
    if (!statsDoc) {
      statsDoc = await StatsModel.create({});
    }
    
    statsDoc.playerWins = stats.playerWins;
    statsDoc.aiWins = stats.aiWins;
    statsDoc.draws = stats.draws;
    statsDoc.totalGames = stats.totalGames;
    
    await statsDoc.save();
    
    return new StatsEntity(
      statsDoc.playerWins,
      statsDoc.aiWins,
      statsDoc.draws,
      statsDoc.totalGames
    );
  }
}