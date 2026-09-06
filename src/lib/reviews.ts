import { prisma } from "@/lib/prisma";

export type ReviewView = {
  id: string;
  authorId: string;
  rating: number;
  body: string;
  createdAt: string;
  updatedAt: string;
  author: { username: string; displayName: string | null; avatarUrl: string | null };
};

/** Visible reviews for a game, newest first. */
export async function getGameReviews(gameId: string): Promise<ReviewView[]> {
  const rows = await prisma.review.findMany({
    where: { gameId, isHidden: false },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { username: true, displayName: true, avatarUrl: true } } },
  });
  return rows.map((r) => ({
    id: r.id,
    authorId: r.userId,
    rating: r.rating,
    body: r.body,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
    author: r.user,
  }));
}
