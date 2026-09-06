import type { ActivityType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getFriendUserIds } from "@/lib/social";

export type ActivityGame = {
  id: string;
  externalId: string;
  title: string;
  coverUrl: string | null;
};

export type ActivityPayload = ActivityGame & {
  /** present for RATED events */
  rating?: number;
};

export type FeedActor = {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
};

export type FeedItem = {
  id: string;
  type: ActivityType;
  createdAt: string;
  actor: FeedActor;
  game: ActivityGame;
  rating: number | null;
};

/**
 * Records a feed event. Best-effort: a failure here must never break the
 * library action that triggered it.
 */
export async function recordActivity(
  userId: string,
  type: ActivityType,
  game: ActivityGame,
  extra?: { rating?: number },
): Promise<void> {
  const payload: ActivityPayload = { ...game, ...(extra?.rating != null ? { rating: extra.rating } : {}) };
  try {
    await prisma.activityEvent.create({
      data: { userId, type, payload: payload as unknown as Prisma.InputJsonValue },
    });
  } catch (error) {
    console.warn("recordActivity failed", { userId, type }, error);
  }
}

/**
 * Feed of recent events from people the viewer follows or is friends with.
 * A PRIVATE actor's events show only to their accepted friends (same rule as
 * library visibility).
 */
export async function getFeed(viewerId: string, limit = 30): Promise<FeedItem[]> {
  const [followRows, friendIds] = await Promise.all([
    prisma.follow.findMany({
      where: { followerId: viewerId },
      select: { followingId: true },
    }),
    getFriendUserIds(viewerId),
  ]);

  const candidateIds = [...new Set([...followRows.map((f) => f.followingId), ...friendIds])];
  if (candidateIds.length === 0) return [];

  const friendSet = new Set(friendIds);
  const actors = await prisma.user.findMany({
    where: { id: { in: candidateIds } },
    select: { id: true, username: true, displayName: true, avatarUrl: true, privacy: true },
  });

  const visibleActors = new Map<string, FeedActor>();
  for (const a of actors) {
    if (a.privacy === "PUBLIC" || friendSet.has(a.id)) {
      visibleActors.set(a.id, {
        id: a.id,
        username: a.username,
        displayName: a.displayName,
        avatarUrl: a.avatarUrl,
      });
    }
  }
  if (visibleActors.size === 0) return [];

  const events = await prisma.activityEvent.findMany({
    where: { userId: { in: [...visibleActors.keys()] } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return events.flatMap((e) => {
    const actor = visibleActors.get(e.userId);
    const p = e.payload as unknown as ActivityPayload | null;
    if (!actor || !p?.id || !p.title) return [];
    return [
      {
        id: e.id,
        type: e.type,
        createdAt: e.createdAt.toISOString(),
        actor,
        game: { id: p.id, externalId: p.externalId, title: p.title, coverUrl: p.coverUrl ?? null },
        rating: typeof p.rating === "number" ? p.rating : null,
      },
    ];
  });
}
