"use server";

import { revalidatePath } from "next/cache";
import type { GameStatus } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getRawgGame } from "@/lib/rawg";
import { recordActivity, type ActivityGame } from "@/lib/activity";
import { checkAndUnlockAchievements } from "@/lib/achievements";
import { getLocale } from "@/i18n/getLocale";
import { getDictionary } from "@/i18n/dictionaries";

const GAME_ACTIVITY_SELECT = {
  id: true,
  externalId: true,
  title: true,
  coverUrl: true,
} as const;

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    const t = getDictionary(await getLocale()).auth.errors;
    throw new Error(t.notAuthorized);
  }
  return session.user.id;
}

export async function addGameToLibrary(externalId: string) {
  const userId = await requireUserId();
  const rawgGame = await getRawgGame(externalId);

  const gameData = {
    title: rawgGame.name,
    coverUrl: rawgGame.background_image,
    genres: rawgGame.genres?.map((g) => g.name) ?? [],
    platforms: rawgGame.platforms?.map((p) => p.platform.name) ?? [],
    releaseDate: rawgGame.released ? new Date(rawgGame.released) : null,
    summary: rawgGame.description_raw ?? null,
    cachedAt: new Date(),
  };

  const game = await prisma.game.upsert({
    where: { externalSource_externalId: { externalSource: "RAWG", externalId } },
    update: gameData,
    create: { externalSource: "RAWG", externalId, ...gameData },
  });

  const existing = await prisma.userGame.findUnique({
    where: { userId_gameId: { userId, gameId: game.id } },
    select: { id: true },
  });

  if (!existing) {
    await prisma.userGame.create({
      data: { userId, gameId: game.id, status: "WANT_TO_PLAY" },
    });
    await recordActivity(userId, "ADDED_GAME", {
      id: game.id,
      externalId: game.externalId,
      title: game.title,
      coverUrl: game.coverUrl,
    });
  }

  await checkAndUnlockAchievements(userId);

  revalidatePath("/library");
  revalidatePath("/games");
  revalidatePath("/feed");
  revalidatePath("/profile");
  revalidatePath(`/games/${externalId}`);
  revalidatePath(`/games/${game.id}`);
}

export type LibraryUpdate = {
  progressPercent?: number | null;
  hoursPlayed?: number | null;
  rating?: number | null;
  notes?: string | null;
};

export async function updateLibraryEntry(entryId: string, data: LibraryUpdate) {
  const userId = await requireUserId();

  const before = await prisma.userGame.findUnique({
    where: { id: entryId, userId },
    select: { rating: true, game: { select: GAME_ACTIVITY_SELECT } },
  });
  if (!before) {
    const t = getDictionary(await getLocale()).auth.errors;
    throw new Error(t.entryNotFound);
  }

  const updated = await prisma.userGame.update({
    where: { id: entryId, userId },
    data,
    select: { gameId: true, game: { select: { externalId: true } } },
  });

  if (
    typeof data.rating === "number" &&
    data.rating !== before.rating &&
    before.game
  ) {
    await recordActivity(userId, "RATED", before.game as ActivityGame, { rating: data.rating });
  }

  await checkAndUnlockAchievements(userId);

  revalidatePath("/library");
  revalidatePath("/games");
  revalidatePath("/feed");
  revalidatePath("/profile");
  revalidatePath(`/games/${updated.gameId}`);
  revalidatePath(`/games/${updated.game.externalId}`);
}

export async function changeLibraryStatus(entryId: string, status: GameStatus) {
  const userId = await requireUserId();
  const entry = await prisma.userGame.findUnique({
    where: { id: entryId, userId },
    select: { status: true, startedAt: true, finishedAt: true, game: { select: GAME_ACTIVITY_SELECT } },
  });
  if (!entry) {
    const t = getDictionary(await getLocale()).auth.errors;
    throw new Error(t.entryNotFound);
  }

  const now = new Date();
  const updated = await prisma.userGame.update({
    where: { id: entryId, userId },
    data: {
      status,
      startedAt: status === "PLAYING" && !entry.startedAt ? now : entry.startedAt,
      finishedAt: status === "COMPLETED" ? now : entry.finishedAt,
    },
    select: { gameId: true, game: { select: { externalId: true } } },
  });

  if (entry.game && status !== entry.status) {
    if (status === "COMPLETED") {
      await recordActivity(userId, "COMPLETED", entry.game as ActivityGame);
    } else if (status === "PLAYING") {
      await recordActivity(userId, "STARTED_PLAYING", entry.game as ActivityGame);
    }
  }

  await checkAndUnlockAchievements(userId);

  revalidatePath("/library");
  revalidatePath("/games");
  revalidatePath("/feed");
  revalidatePath("/profile");
  revalidatePath(`/games/${updated.gameId}`);
  revalidatePath(`/games/${updated.game.externalId}`);
}

export async function removeLibraryEntry(entryId: string) {
  const userId = await requireUserId();
  const deleted = await prisma.userGame.delete({
    where: { id: entryId, userId },
    select: { gameId: true, game: { select: { externalId: true } } },
  });
  revalidatePath("/library");
  revalidatePath("/games");
  if (deleted) {
    revalidatePath(`/games/${deleted.gameId}`);
    revalidatePath(`/games/${deleted.game.externalId}`);
  }
}
