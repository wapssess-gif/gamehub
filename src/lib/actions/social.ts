"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";

async function assertUserExists(userId: string) {
  const found = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
  if (!found) throw new Error("User not found");
}

function revalidateSocial() {
  revalidatePath("/friends");
  revalidatePath("/users");
  revalidatePath("/u/[username]", "page");
  revalidatePath("/", "layout"); // navbar friend-request badge
}

export async function followUser(targetUserId: string) {
  const userId = await requireUserId();
  if (targetUserId === userId) throw new Error("Cannot follow yourself");
  await assertUserExists(targetUserId);

  await prisma.follow.upsert({
    where: { followerId_followingId: { followerId: userId, followingId: targetUserId } },
    update: {},
    create: { followerId: userId, followingId: targetUserId },
  });
  revalidateSocial();
}

export async function unfollowUser(targetUserId: string) {
  const userId = await requireUserId();
  await prisma.follow.deleteMany({ where: { followerId: userId, followingId: targetUserId } });
  revalidateSocial();
}

/**
 * Sends (or resolves) a friend request. Keeps a single Friendship row per pair:
 * a fresh pair creates PENDING; a mirror-pending request is accepted; a declined
 * row is reopened as a new request from the caller.
 */
export async function sendFriendRequest(targetUserId: string) {
  const userId = await requireUserId();
  if (targetUserId === userId) throw new Error("Cannot befriend yourself");
  await assertUserExists(targetUserId);

  const existing = await prisma.friendship.findFirst({
    where: {
      OR: [
        { requesterId: userId, addresseeId: targetUserId },
        { requesterId: targetUserId, addresseeId: userId },
      ],
    },
  });

  if (!existing) {
    await prisma.friendship.create({
      data: { requesterId: userId, addresseeId: targetUserId, status: "PENDING" },
    });
  } else if (existing.status === "PENDING" && existing.addresseeId === userId) {
    // the other user already asked us — treat this as acceptance
    await prisma.friendship.update({ where: { id: existing.id }, data: { status: "ACCEPTED" } });
  } else if (existing.status === "DECLINED") {
    await prisma.friendship.update({
      where: { id: existing.id },
      data: { requesterId: userId, addresseeId: targetUserId, status: "PENDING" },
    });
  }
  // ACCEPTED, or our own PENDING request already standing — no-op

  revalidateSocial();
}

export async function respondToFriendRequest(friendshipId: string, accept: boolean) {
  const userId = await requireUserId();
  const fr = await prisma.friendship.findUnique({ where: { id: friendshipId } });
  if (!fr || fr.addresseeId !== userId || fr.status !== "PENDING") {
    throw new Error("No such friend request");
  }
  await prisma.friendship.update({
    where: { id: friendshipId },
    data: { status: accept ? "ACCEPTED" : "DECLINED" },
  });
  revalidateSocial();
}

/** Cancels a pending request (requester only) or removes an accepted friend (either party). */
export async function removeFriendship(friendshipId: string) {
  const userId = await requireUserId();
  const fr = await prisma.friendship.findUnique({ where: { id: friendshipId } });
  if (!fr) return;

  const isParticipant = fr.requesterId === userId || fr.addresseeId === userId;
  if (!isParticipant) throw new Error("Not your friendship");
  if (fr.status === "PENDING" && fr.requesterId !== userId) {
    throw new Error("Only the requester can cancel a pending request");
  }

  await prisma.friendship.delete({ where: { id: friendshipId } });
  revalidateSocial();
}
