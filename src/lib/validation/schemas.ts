import { z } from 'zod';

export const CellValueSchema = z.union([z.null(), z.literal('X'), z.literal('O')]);

export const BoardSchema = z.array(z.array(CellValueSchema).length(3)).length(3);

export const PlayerSchema = z.enum(['jugador', 'ia']);

export const GameStateSchema = z.enum(['en_progreso', 'victoria_jugador', 'victoria_ia', 'empate']);

export const MoveSchema = z.object({
  fila: z.number().int().min(0).max(2),
  columna: z.number().int().min(0).max(2)
});

export const GameIdSchema = z.string().min(1);

export const GameResponseSchema = z.object({
  gameId: z.string(),
  tablero: BoardSchema,
  turno: PlayerSchema
});

export const MoveResponseSchema = z.object({
  tablero: BoardSchema,
  turno: PlayerSchema,
  estado: GameStateSchema,
  ganador: z.union([PlayerSchema, z.null()])
});

export const PlayerStatsSchema = z.object({
  victorias: z.number().int().min(0),
  empates: z.number().int().min(0),
  derrotas: z.number().int().min(0)
});

export const GameStatsSchema = z.object({
  jugador: PlayerStatsSchema,
  ia: PlayerStatsSchema
});

export function validateMove(move: unknown): { fila: number; columna: number } {
  const result = MoveSchema.safeParse(move);
  if (!result.success) {
    throw new Error(`Movimiento inválido: ${result.error.message}`);
  }
  return result.data;
}

export function validateGameId(gameId: unknown): string {
  const result = GameIdSchema.safeParse(gameId);
  if (!result.success) {
    throw new Error(`ID de juego inválido: ${result.error.message}`);
  }
  return result.data;
}