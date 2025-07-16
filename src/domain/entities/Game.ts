import { Board, GameState, Move, Player } from '@/lib/types';

export class GameEntity {
  constructor(
    public readonly id: string,
    public readonly board: Board,
    public readonly currentPlayer: Player,
    public readonly state: GameState,
    public readonly winner: Player | null = null
  ) {}

  static createNew(id: string): GameEntity {
    const emptyBoard: Board = [
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ];
    
    return new GameEntity(id, emptyBoard, 'jugador', 'en_progreso');
  }

  makeMove(move: Move, player: Player): GameEntity {
    if (!this.canMakeMove(move)) {
      throw new Error('Movimiento no válido');
    }

    const newBoard = this.board.map(row => [...row]);
    newBoard[move.fila][move.columna] = player === 'jugador' ? 'X' : 'O';

    return new GameEntity(
      this.id,
      newBoard,
      this.currentPlayer,
      this.state,
      this.winner
    );
  }

  private canMakeMove(move: Move): boolean {
    if (this.state !== 'en_progreso') return false;
    if (move.fila < 0 || move.fila > 2 || move.columna < 0 || move.columna > 2) return false;
    return this.board[move.fila][move.columna] === null;
  }

  withState(state: GameState, winner: Player | null = null): GameEntity {
    return new GameEntity(this.id, this.board, this.currentPlayer, state, winner);
  }

  withNextPlayer(): GameEntity {
    const nextPlayer = this.currentPlayer === 'jugador' ? 'ia' : 'jugador';
    return new GameEntity(this.id, this.board, nextPlayer, this.state, this.winner);
  }

  isFinished(): boolean {
    return this.state !== 'en_progreso';
  }

  isEmpty(): boolean {
    return this.board.every(row => row.every(cell => cell === null));
  }

  isFull(): boolean {
    return this.board.every(row => row.every(cell => cell !== null));
  }
}