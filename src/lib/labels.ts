import type { GameStatus } from "@prisma/client";

export const STATUS_LABELS: Record<GameStatus, string> = {
  WANT_TO_PLAY: "Хочу играть",
  PLAYING: "Играю",
  COMPLETED: "Пройдено",
  DROPPED: "Брошено",
  ON_HOLD: "На паузе",
};

export const STATUS_ORDER: GameStatus[] = [
  "PLAYING",
  "WANT_TO_PLAY",
  "ON_HOLD",
  "COMPLETED",
  "DROPPED",
];
