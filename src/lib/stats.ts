import { prisma } from "@/lib/prisma";

export type UserStats = {
  totalGames: number;
  byStatus: Record<string, number>;
  totalHours: number;
  averageRating: number | null;
  topGenres: { genre: string; count: number }[];
};

export async function getUserStats(userId: string): Promise<UserStats> {
  const entries = await prisma.userGame.findMany({
    where: { userId },
    include: { game: true },
  });

  const byStatus: Record<string, number> = {};
  const genreCounts = new Map<string, number>();
  let totalHours = 0;
  let ratingSum = 0;
  let ratingCount = 0;

  for (const entry of entries) {
    byStatus[entry.status] = (byStatus[entry.status] ?? 0) + 1;
    totalHours += entry.hoursPlayed ? Number(entry.hoursPlayed) : 0;
    if (entry.rating != null) {
      ratingSum += entry.rating;
      ratingCount += 1;
    }
    for (const genre of entry.game.genres) {
      genreCounts.set(genre, (genreCounts.get(genre) ?? 0) + 1);
    }
  }

  const topGenres = [...genreCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([genre, count]) => ({ genre, count }));

  return {
    totalGames: entries.length,
    byStatus,
    totalHours,
    averageRating: ratingCount ? ratingSum / ratingCount : null,
    topGenres,
  };
}
