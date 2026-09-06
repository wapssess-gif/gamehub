"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { recordActivity } from "@/lib/activity";
import { checkAndUnlockAchievements } from "@/lib/achievements";
import { getLocale } from "@/i18n/getLocale";
import { getDictionary } from "@/i18n/dictionaries";

const MAX_BODY = 5000;

export async function upsertReview(gameId: string, rating: number, body: string) {
  const userId = await requireUserId();
  const t = getDictionary(await getLocale()).reviews;

  const trimmed = body.trim().slice(0, MAX_BODY);
  const r = Math.round(rating);
  if (!trimmed) throw new Error(t.errorEmptyBody);
  if (!Number.isFinite(r) || r < 1 || r > 10) throw new Error(t.errorBadRating);

  const game = await prisma.game.findUnique({
    where: { id: gameId },
    select: { id: true, externalId: true, title: true, coverUrl: true },
  });
  if (!game) throw new Error(t.errorGameNotFound);

  const existing = await prisma.review.findUnique({
    where: { userId_gameId: { userId, gameId } },
    select: { id: true },
  });

  await prisma.review.upsert({
    where: { userId_gameId: { userId, gameId } },
    update: { rating: r, body: trimmed },
    create: { userId, gameId, rating: r, body: trimmed },
  });

  if (!existing) {
    await recordActivity(userId, "REVIEWED", game, { rating: r });
  }

  await checkAndUnlockAchievements(userId);

  revalidatePath(`/games/${game.id}`);
  revalidatePath(`/games/${game.externalId}`);
  revalidatePath("/feed");
  revalidatePath("/profile");
}

export async function deleteReview(gameId: string) {
  const userId = await requireUserId();
  await prisma.review.deleteMany({ where: { userId, gameId } });

  const game = await prisma.game.findUnique({
    where: { id: gameId },
    select: { externalId: true },
  });
  revalidatePath(`/games/${gameId}`);
  if (game) revalidatePath(`/games/${game.externalId}`);
}
