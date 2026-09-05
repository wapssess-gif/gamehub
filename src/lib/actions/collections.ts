"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";

export async function createCollection(name: string, description?: string) {
  const userId = await requireUserId();

  // Check if collection with this name already exists
  const existing = await prisma.collection.findUnique({
    where: { userId_name: { userId, name } },
  });

  if (existing) {
    throw new Error("Collection with this name already exists");
  }

  const collection = await prisma.collection.create({
    data: {
      userId,
      name,
      description,
    },
  });

  revalidatePath("/collections");
  return collection;
}

export async function updateCollection(
  id: string,
  name: string,
  description?: string,
  isPublic?: boolean
) {
  const userId = await requireUserId();

  // Verify ownership
  const collection = await prisma.collection.findUnique({
    where: { id },
  });

  if (!collection || collection.userId !== userId) {
    throw new Error("Unauthorized");
  }

  const updated = await prisma.collection.update({
    where: { id },
    data: { name, description, isPublic },
  });

  revalidatePath("/collections");
  return updated;
}

export async function deleteCollection(id: string) {
  const userId = await requireUserId();

  // Verify ownership
  const collection = await prisma.collection.findUnique({
    where: { id },
  });

  if (!collection || collection.userId !== userId) {
    throw new Error("Unauthorized");
  }

  await prisma.collection.delete({ where: { id } });

  revalidatePath("/collections");
}

export async function addGameToCollection(collectionId: string, gameId: string) {
  const userId = await requireUserId();

  // Verify collection ownership
  const collection = await prisma.collection.findUnique({
    where: { id: collectionId },
  });

  if (!collection || collection.userId !== userId) {
    throw new Error("Unauthorized");
  }

  // Check if game already in collection
  const existing = await prisma.collectionItem.findUnique({
    where: { collectionId_gameId: { collectionId, gameId } },
  });

  if (existing) {
    throw new Error("Game already in collection");
  }

  const item = await prisma.collectionItem.create({
    data: { collectionId, gameId },
  });

  revalidatePath("/collections");
  revalidatePath(`/collections/${collectionId}`);
  return item;
}

export async function removeGameFromCollection(
  collectionId: string,
  gameId: string
) {
  const userId = await requireUserId();

  // Verify collection ownership
  const collection = await prisma.collection.findUnique({
    where: { id: collectionId },
  });

  if (!collection || collection.userId !== userId) {
    throw new Error("Unauthorized");
  }

  await prisma.collectionItem.delete({
    where: { collectionId_gameId: { collectionId, gameId } },
  });

  revalidatePath("/collections");
  revalidatePath(`/collections/${collectionId}`);
}

export async function getUserCollections(userId: string) {
  return prisma.collection.findMany({
    where: { userId },
    include: { _count: { select: { items: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCollection(id: string) {
  return prisma.collection.findUnique({
    where: { id },
    include: { items: { include: { game: true } } },
  });
}
