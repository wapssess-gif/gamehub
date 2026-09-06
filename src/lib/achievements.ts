import { prisma } from "@/lib/prisma";

export const ACHIEVEMENT_IDS = [
  // library size
  "first_game",
  "ten_games",
  "librarian",
  "fifty_games",
  "bookworm",
  "game_mogul",
  "bottomless_pocket",
  // collections
  "good_start",
  "curated_shelf",
  // completion
  "first_completed",
  "hooked",
  "ten_completed",
  "veteran",
  "story_master",
  "gaming_machine",
  "ninja",
  "epic_journey",
  // hours
  "first_steps",
  "amateur",
  "hundred_hours",
  "devoted_fan",
  "no_sleep",
  "life_on_screen",
  "productivity_maniac",
  // ratings & reviews
  "first_rating",
  "strict_judge",
  "first_approval",
  "total_smackdown",
  "first_review",
  "five_reviews",
  "film_critic",
  "community_voice",
  "masters_pen",
  // genres
  "new_horizon",
  "genre_explorer",
  "explorer",
  "jack_of_all_trades",
  "narrow_specialist",
  // meta
  "trophy_collector",
  "gamehub_legend",
] as const;

export type AchievementId = (typeof ACHIEVEMENT_IDS)[number];

type BaseStats = {
  games: number;
  completed: number;
  totalHours: number;
  ratings: number;
  reviews: number;
  distinctGenres: number;
  collectionItems: number;
  maxSingleGameHours: number;
  hasFastCompletion: boolean;
  hasEpicCompletion: boolean;
  hasLongReview: boolean;
  hasPerfectRating: boolean;
  hasWorstRating: boolean;
  maxCompletedInOneGenre: number;
};

type AchievementStats = BaseStats & { unlockedAchievements: number };

const LONG_REVIEW_CHARS = 500;

const CHECKS: Record<AchievementId, (s: AchievementStats) => boolean> = {
  first_game: (s) => s.games >= 1,
  ten_games: (s) => s.games >= 10,
  librarian: (s) => s.games >= 25,
  fifty_games: (s) => s.games >= 50,
  bookworm: (s) => s.games >= 100,
  game_mogul: (s) => s.games >= 250,
  bottomless_pocket: (s) => s.games >= 500,

  good_start: (s) => s.collectionItems >= 5,
  curated_shelf: (s) => s.collectionItems >= 25,

  first_completed: (s) => s.completed >= 1,
  hooked: (s) => s.completed >= 3,
  ten_completed: (s) => s.completed >= 10,
  veteran: (s) => s.completed >= 25,
  story_master: (s) => s.completed >= 50,
  gaming_machine: (s) => s.completed >= 100,
  ninja: (s) => s.hasFastCompletion,
  epic_journey: (s) => s.hasEpicCompletion,

  first_steps: (s) => s.totalHours >= 10,
  amateur: (s) => s.totalHours >= 50,
  hundred_hours: (s) => s.totalHours >= 100,
  devoted_fan: (s) => s.totalHours >= 250,
  no_sleep: (s) => s.totalHours >= 500,
  life_on_screen: (s) => s.totalHours >= 1000,
  productivity_maniac: (s) => s.maxSingleGameHours > 100,

  first_rating: (s) => s.ratings >= 1,
  strict_judge: (s) => s.ratings >= 10,
  first_approval: (s) => s.hasPerfectRating,
  total_smackdown: (s) => s.hasWorstRating,
  first_review: (s) => s.reviews >= 1,
  five_reviews: (s) => s.reviews >= 5,
  film_critic: (s) => s.reviews >= 10,
  community_voice: (s) => s.reviews >= 25,
  masters_pen: (s) => s.hasLongReview,

  new_horizon: (s) => s.distinctGenres >= 2,
  genre_explorer: (s) => s.distinctGenres >= 5,
  explorer: (s) => s.distinctGenres >= 10,
  jack_of_all_trades: (s) => s.distinctGenres >= 20,
  narrow_specialist: (s) => s.maxCompletedInOneGenre >= 5,

  trophy_collector: (s) => s.unlockedAchievements >= 25,
  gamehub_legend: (s) => s.unlockedAchievements >= ACHIEVEMENT_IDS.length - 1,
};

async function computeBaseStats(userId: string): Promise<BaseStats> {
  const [entries, reviews, collectionItems] = await Promise.all([
    prisma.userGame.findMany({
      where: { userId },
      select: { status: true, hoursPlayed: true, rating: true, game: { select: { genres: true } } },
    }),
    prisma.review.findMany({ where: { userId }, select: { body: true } }),
    prisma.collectionItem.count({ where: { collection: { userId } } }),
  ]);

  const genres = new Set<string>();
  const completedByGenre = new Map<string, number>();
  let totalHours = 0;
  let completed = 0;
  let ratings = 0;
  let maxSingleGameHours = 0;
  let hasFastCompletion = false;
  let hasEpicCompletion = false;
  let hasPerfectRating = false;
  let hasWorstRating = false;

  for (const e of entries) {
    const h = e.hoursPlayed ? Number(e.hoursPlayed) : 0;
    totalHours += h;
    if (h > maxSingleGameHours) maxSingleGameHours = h;

    if (e.rating != null) {
      ratings += 1;
      if (e.rating >= 10) hasPerfectRating = true;
      if (e.rating <= 1) hasWorstRating = true;
    }

    for (const g of e.game.genres) genres.add(g);

    if (e.status === "COMPLETED") {
      completed += 1;
      if (h > 0 && h < 5) hasFastCompletion = true;
      if (h > 50) hasEpicCompletion = true;
      for (const g of e.game.genres) {
        completedByGenre.set(g, (completedByGenre.get(g) ?? 0) + 1);
      }
    }
  }

  return {
    games: entries.length,
    completed,
    totalHours,
    ratings,
    reviews: reviews.length,
    distinctGenres: genres.size,
    collectionItems,
    maxSingleGameHours,
    hasFastCompletion,
    hasEpicCompletion,
    hasLongReview: reviews.some((r) => r.body.trim().length > LONG_REVIEW_CHARS),
    hasPerfectRating,
    hasWorstRating,
    maxCompletedInOneGenre: Math.max(0, ...completedByGenre.values()),
  };
}

/**
 * Unlocks any newly-earned achievements for the user and records an activity
 * event per unlock. Best-effort: never throws. Returns the new achievement ids.
 *
 * Runs to a fixed point (bounded) so the meta achievements — which count how
 * many achievements the user has — can unlock in the same call that earns the
 * ones they depend on.
 */
export async function checkAndUnlockAchievements(userId: string): Promise<AchievementId[]> {
  try {
    const base = await computeBaseStats(userId);
    const existing = await prisma.userAchievement.findMany({
      where: { userId },
      select: { achievementId: true },
    });
    const have = new Set<string>(existing.map((a) => a.achievementId));
    const allNew: AchievementId[] = [];

    for (let pass = 0; pass < 5; pass++) {
      const stats: AchievementStats = { ...base, unlockedAchievements: have.size };
      const earned = ACHIEVEMENT_IDS.filter((id) => !have.has(id) && CHECKS[id](stats));
      if (earned.length === 0) break;

      await prisma.userAchievement.createMany({
        data: earned.map((achievementId) => ({ userId, achievementId })),
        skipDuplicates: true,
      });
      for (const achievementId of earned) {
        await prisma.activityEvent.create({
          data: { userId, type: "ACHIEVEMENT_UNLOCKED", payload: { achievementId } },
        });
        have.add(achievementId);
        allNew.push(achievementId);
      }
    }

    return allNew;
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
