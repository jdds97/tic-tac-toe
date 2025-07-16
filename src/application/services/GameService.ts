import { GameEntity } from '@/domain/entities/Game';
import { GameRules } from '@/domain/rules/GameRules';
import { IGameRepository } from '@/infrastructure/repositories/GameRepository';
import { IStatsRepository } from '@/infrastructure/repositories/StatsRepository';
import { Move, Player } from '@/lib/types';

export class GameService {
  constructor(
    private gameRepository: IGameRepository,
    private statsRepository: IStatsRepository
  ) {}

  async startGame(): Promise<GameEntity> {
    const existingGame = await this.gameRepository.findActiveGame();
    
    if (existingGame && existingGame.state === 'en_progreso' && !existingGame.isFull()) {
      return existingGame;
    }
    
    const newGame = GameEntity.createNew(this.generateGameId());
    return await this.gameRepository.create(newGame);
  }

  async restartGame(): Promise<GameEntity> {
    const existingGame = await this.gameRepository.findActiveGame();
    
    if (existingGame && existingGame.state === 'en_progreso' && existingGame.isEmpty()) {
      return existingGame;
    }
    
    const newGame = GameEntity.createNew(this.generateGameId());
    return await this.gameRepository.create(newGame);
  }

  async makePlayerMove(gameId: string, move: Move): Promise<GameEntity> {
    const game = await this.gameRepository.findById(gameId);
    
    if (!game) {
      throw new Error('Juego no encontrado');
    }
    
    if (game.state !== 'en_progreso') {
      throw new Error('El juego ya ha terminado');
    }
    
    if (game.currentPlayer !== 'jugador') {
      throw new Error('No es el turno del jugador');
    }
    
    const gameWithMove = game.makeMove(move, 'jugador');
    const winner = GameRules.checkWinner(gameWithMove.board, move);
    
    let updatedGame = gameWithMove;
    
    if (winner) {
      const gameState = winner === 'jugador' ? 'victoria_jugador' : 
                       winner === 'ia' ? 'victoria_ia' : 'empate';
      updatedGame = gameWithMove.withState(gameState, winner === 'empate' ? null : winner);
      await this.updateStats(winner);
    } else {
      updatedGame = gameWithMove.withNextPlayer();
    }
    
    return await this.gameRepository.save(updatedGame);
  }

  async makeAIMove(gameId: string): Promise<GameEntity> {
    const game = await this.gameRepository.findById(gameId);
    
    if (!game) {
      throw new Error('Juego no encontrado');
    }
    
    if (game.state !== 'en_progreso') {
      throw new Error('El juego ya ha terminado');
    }
    
    if (game.currentPlayer !== 'ia') {
      throw new Error('No es el turno de la IA');
    }
    
    const aiMove = GameRules.getBestMove(game.board);
    
    if (!aiMove) {
      throw new Error('No hay movimientos disponibles para la IA');
    }
    
    const gameWithMove = game.makeMove(aiMove, 'ia');
    const winner = GameRules.checkWinner(gameWithMove.board, aiMove);
    
    let updatedGame = gameWithMove;
    
    if (winner) {
      const gameState = winner === 'jugador' ? 'victoria_jugador' : 
                       winner === 'ia' ? 'victoria_ia' : 'empate';
      updatedGame = gameWithMove.withState(gameState, winner === 'empate' ? null : winner);
      await this.updateStats(winner);
    } else {
      updatedGame = gameWithMove.withNextPlayer();
    }
    
    return await this.gameRepository.save(updatedGame);
  }

  private async updateStats(winner: Player | 'empate'): Promise<void> {
    const currentStats = await this.statsRepository.find();
    const updatedStats = currentStats.addResult(winner);
    await this.statsRepository.save(updatedStats);
  }

  private generateGameId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}