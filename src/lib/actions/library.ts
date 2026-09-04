"use server";

import { revalidatePath } from "next/cache";
import type { GameStatus } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getRawgGame } from "@/lib/rawg";
import { getLocale } from "@/i18n/getLocale";
import { getDictionary } from "@/i18n/dictionaries";

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

  await prisma.userGame.upsert({
    where: { userId_gameId: { userId, gameId: game.id } },
    update: {},
    create: { userId, gameId: game.id, status: "WANT_TO_PLAY" },
  });

  revalidatePath("/library");
  revalidatePath("/games");
}

export type LibraryUpdate = {
  progressPercent?: number | null;
  hoursPlayed?: number | null;
  rating?: number | null;
  notes?: string | null;
};

export async function updateLibraryEntry(entryId: string, data: LibraryUpdate) {
  const userId = await requireUserId();

  await prisma.userGame.update({
    where: { id: entryId, userId },
    data,
  });

  revalidatePath("/library");
}

export async function changeLibraryStatus(entryId: string, status: GameStatus) {
  const userId = await requireUserId();
  const entry = await prisma.userGame.findUnique({ where: { id: entryId, userId } });
  if (!entry) {
    const t = getDictionary(await getLocale()).auth.errors;
    throw new Error(t.entryNotFound);
  }

  const now = new Date();
  await prisma.userGame.update({
    where: { id: entryId, userId },
    data: {
      status,
      startedAt: status === "PLAYING" && !entry.startedAt ? now : entry.startedAt,
      finishedAt: status === "COMPLETED" ? now : entry.finishedAt,
    },
  });

  revalidatePath("/library");
}

export async function removeLibraryEntry(entryId: string) {
  const userId = await requireUserId();
  await prisma.userGame.delete({ where: { id: entryId, userId } });
  revalidatePath("/library");
  revalidatePath("/games");
}
