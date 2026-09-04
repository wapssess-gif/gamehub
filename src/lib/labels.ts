import type { GameStatus } from "@prisma/client";

export const STATUS_ORDER: GameStatus[] = [
  "PLAYING",
  "WANT_TO_PLAY",
  "ON_HOLD",
  "COMPLETED",
  "DROPPED",
];
