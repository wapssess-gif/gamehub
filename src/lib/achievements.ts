import { prisma } from "@/lib/prisma";

export const ACHIEVEMENT_IDS = [
  "first_game",
  "ten_games",
  "fifty_games",
  "first_completed",
  "ten_completed",
  "hundred_hours",
  "first_rating",
  "first_review",
  "five_reviews",
  "genre_explorer",
] as const;

export type AchievementId = (typeof ACHIEVEMENT_IDS)[number];

type AchievementStats = {
  games: number;
  completed: number;
  totalHours: number;
  ratings: number;
  reviews: number;
  distinctGenres: number;
};

const CHECKS: Record<AchievementId, (s: AchievementStats) => boolean> = {
  first_game: (s) => s.games >= 1,
  ten_games: (s) => s.games >= 10,
  fifty_games: (s) => s.games >= 50,
  first_completed: (s) => s.completed >= 1,
  ten_completed: (s) => s.completed >= 10,
  hundred_hours: (s) => s.totalHours >= 100,
  first_rating: (s) => s.ratings >= 1,
  first_review: (s) => s.reviews >= 1,
  five_reviews: (s) => s.reviews >= 5,
  genre_explorer: (s) => s.distinctGenres >= 5,
};

async function computeStats(userId: string): Promise<AchievementStats> {
  const [entries, reviews] = await Promise.all([
    prisma.userGame.findMany({
      where: { userId },
      select: { status: true, hoursPlayed: true, rating: true, game: { select: { genres: true } } },
    }),
    prisma.review.count({ where: { userId } }),
  ]);

  const genres = new Set<string>();
  let totalHours = 0;
  let completed = 0;
  let ratings = 0;
  for (const e of entries) {
    if (e.status === "COMPLETED") completed += 1;
    if (e.rating != null) ratings += 1;
    if (e.hoursPlayed) totalHours += Number(e.hoursPlayed);
    for (const g of e.game.genres) genres.add(g);
  }

  return { games: entries.length, completed, totalHours, ratings, reviews, distinctGenres: genres.size };
}

/**
 * Unlocks any newly-earned achievements for the user and records an activity
 * event per unlock. Best-effort: never throws. Returns the new achievement ids.
 */
export async function checkAndUnlockAchievements(userId: string): Promise<AchievementId[]> {
  try {
    const [stats, already] = await Promise.all([
      computeStats(userId),
      prisma.userAchievement.findMany({ where: { userId }, select: { achievementId: true } }),
    ]);
    const have = new Set(already.map((a) => a.achievementId));
    const newlyEarned = ACHIEVEMENT_IDS.filter((id) => !have.has(id) && CHECKS[id](stats));
    if (newlyEarned.length === 0) return [];

    await prisma.userAchievement.createMany({
      data: newlyEarned.map((achievementId) => ({ userId, achievementId })),
      skipDuplicates: true,
    });
    for (const achievementId of newlyEarned) {
      await prisma.activityEvent.create({
        data: { userId, type: "ACHIEVEMENT_UNLOCKED", payload: { achievementId } },
      });
    }
    return newlyEarned;
  } catch (error) {
    console.warn("checkAndUnlockAchievements failed", userId, error);
    return [];
  }
}

export type AchievementState = {
  id: AchievementId;
  unlocked: boolean;
  unlockedAt: string | null;
};

export async function getUserAchievements(userId: string): Promise<AchievementState[]> {
  const rows = await prisma.userAchievement.findMany({ where: { userId } });
  const unlocked = new Map(rows.map((r) => [r.achievementId, r.unlockedAt]));
  return ACHIEVEMENT_IDS.map((id) => ({
    id,
    unlocked: unlocked.has(id),
    unlockedAt: unlocked.get(id)?.toISOString() ?? null,
  }));
}
