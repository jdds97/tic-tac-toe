import { Board, GameState, Move, Player } from '@/lib/types';

export class GameRules {
  static checkWinner(board: Board, lastMove: Move): Player | 'empate' | null {
    const { fila, columna } = lastMove;
    const player = board[fila][columna];
    
    if (!player) return null;

    if (this.isWinningMove(board, lastMove, player)) {
      return player === 'X' ? 'jugador' : 'ia';
    }

    if (this.isBoardFull(board)) {
      return 'empate';
    }

    return null;
  }

  static getGameState(board: Board): GameState {
    for (let i = 0; i < 3; i++) {
      if (board[i][0] && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
        return board[i][0] === 'X' ? 'victoria_jugador' : 'victoria_ia';
      }
      
      if (board[0][i] && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
        return board[0][i] === 'X' ? 'victoria_jugador' : 'victoria_ia';
      }
    }

    if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
      return board[0][0] === 'X' ? 'victoria_jugador' : 'victoria_ia';
    }

    if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
      return board[0][2] === 'X' ? 'victoria_jugador' : 'victoria_ia';
    }

    if (this.isBoardFull(board)) {
      return 'empate';
    }

    return 'en_progreso';
  }

  static isWinningMove(board: Board, move: Move, symbol: 'X' | 'O'): boolean {
    const { fila, columna } = move;
    
    if (this.isLineWinner(board[fila], symbol)) return true;
    if (this.isLineWinner([board[0][columna], board[1][columna], board[2][columna]], symbol)) return true;
    if (fila === columna && this.isLineWinner([board[0][0], board[1][1], board[2][2]], symbol)) return true;
    if (fila + columna === 2 && this.isLineWinner([board[0][2], board[1][1], board[2][0]], symbol)) return true;
    
    return false;
  }

  static getBestMove(board: Board): Move | null {
    if (this.isBoardFull(board)) return null;

    const winningMove = this.findWinningMove(board, 'O');
    if (winningMove) return winningMove;

    const blockingMove = this.findWinningMove(board, 'X');
    if (blockingMove) return blockingMove;

    if (board[1][1] === null) {
      return { fila: 1, columna: 1 };
    }

    const corners = [
      { fila: 0, columna: 0 },
      { fila: 0, columna: 2 },
      { fila: 2, columna: 0 },
      { fila: 2, columna: 2 }
    ];

    for (const corner of corners) {
      if (board[corner.fila][corner.columna] === null) {
        return corner;
      }
    }

    for (let fila = 0; fila < 3; fila++) {
      for (let columna = 0; columna < 3; columna++) {
        if (board[fila][columna] === null) {
          return { fila, columna };
        }
      }
    }

    return null;
  }

  private static isLineWinner(line: (string | null)[], symbol: 'X' | 'O'): boolean {
    return line.every(cell => cell === symbol);
  }

  private static isBoardFull(board: Board): boolean {
    return board.every(row => row.every(cell => cell !== null));
  }

  private static findWinningMove(board: Board, symbol: 'X' | 'O'): Move | null {
    for (let fila = 0; fila < 3; fila++) {
      for (let columna = 0; columna < 3; columna++) {
        if (board[fila][columna] === null) {
          board[fila][columna] = symbol;
          const isWinning = this.isWinningMove(board, { fila, columna }, symbol);
          board[fila][columna] = null;
          
          if (isWinning) {
            return { fila, columna };
          }
        }
      }
    }
    return null;
  }
}