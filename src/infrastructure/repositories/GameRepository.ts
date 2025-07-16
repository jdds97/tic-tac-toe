import { GameEntity } from '@/domain/entities/Game';
import { connectToDatabase } from '@/db/mongoDb';
import GameModel from '@/db/models/Game';

export interface IGameRepository {
  findById(id: string): Promise<GameEntity | null>;
  findActiveGame(): Promise<GameEntity | null>;
  save(game: GameEntity): Promise<GameEntity>;
  create(game: GameEntity): Promise<GameEntity>;
}

export class GameRepository implements IGameRepository {
  async findById(id: string): Promise<GameEntity | null> {
    await connectToDatabase();
    const gameDoc = await GameModel.findById(id);
    
    if (!gameDoc) return null;
    
    return new GameEntity(
      gameDoc._id.toString(),
      gameDoc.board,
      gameDoc.currentPlayer,
      gameDoc.state,
      gameDoc.winner
    );
  }

  async findActiveGame(): Promise<GameEntity | null> {
    await connectToDatabase();
    const gameDoc = await GameModel.findActiveGame();
    
    if (!gameDoc) return null;
    
    return new GameEntity(
      gameDoc._id.toString(),
      gameDoc.board,
      gameDoc.currentPlayer,
      gameDoc.state,
      gameDoc.winner
    );
  }

  async save(game: GameEntity): Promise<GameEntity> {
    await connectToDatabase();
    const gameDoc = await GameModel.findById(game.id);
    
    if (!gameDoc) {
      throw new Error('Game not found');
    }

    gameDoc.board = game.board;
    gameDoc.currentPlayer = game.currentPlayer;
    gameDoc.state = game.state;
    gameDoc.winner = game.winner;
    
    await gameDoc.save();
    
    return new GameEntity(
      gameDoc._id.toString(),
      gameDoc.board,
      gameDoc.currentPlayer,
      gameDoc.state,
      gameDoc.winner
    );
  }

  async create(game: GameEntity): Promise<GameEntity> {
    await connectToDatabase();
    const gameDoc = await GameModel.create({
      board: game.board,
      currentPlayer: game.currentPlayer,
      state: game.state,
      winner: game.winner
    });
    
    return new GameEntity(
      gameDoc._id.toString(),
      gameDoc.board,
      gameDoc.currentPlayer,
      gameDoc.state,
      gameDoc.winner
    );
  }
}