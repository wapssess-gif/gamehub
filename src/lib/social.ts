import type { FriendshipStatus, ProfilePrivacy } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type FriendshipView = {
  id: string;
  status: FriendshipStatus;
  iAmRequester: boolean;
};

export type Relationship = {
  isSelf: boolean;
  /** viewer follows the target */
  following: boolean;
  /** the target follows the viewer */
  followsYou: boolean;
  friendship: FriendshipView | null;
};

/** Follow / friendship state between the viewer and another user. */
export async function getRelationship(
  viewerId: string,
  targetId: string,
): Promise<Relationship> {
  if (viewerId === targetId) {
    return { isSelf: true, following: false, followsYou: false, friendship: null };
  }

  const [followOut, followIn, friendship] = await Promise.all([
    prisma.follow.findUnique({
      where: { followerId_followingId: { followerId: viewerId, followingId: targetId } },
    }),
    prisma.follow.findUnique({
      where: { followerId_followingId: { followerId: targetId, followingId: viewerId } },
    }),
    prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId: viewerId, addresseeId: targetId },
          { requesterId: targetId, addresseeId: viewerId },
        ],
      },
    }),
  ]);

  return {
    isSelf: false,
    following: Boolean(followOut),
    followsYou: Boolean(followIn),
    friendship: friendship
      ? {
          id: friendship.id,
          status: friendship.status,
          iAmRequester: friendship.requesterId === viewerId,
        }
      : null,
  };
}

export async function getConnectionCounts(userId: string) {
  const [followers, following, friends] = await Promise.all([
    prisma.follow.count({ where: { followingId: userId } }),
    prisma.follow.count({ where: { followerId: userId } }),
    prisma.friendship.count({
      where: { status: "ACCEPTED", OR: [{ requesterId: userId }, { addresseeId: userId }] },
    }),
  ]);
  return { followers, following, friends };
}

/** Ids of users who are accepted friends of `userId` (either direction). */
export async function getFriendUserIds(userId: string): Promise<string[]> {
  const rows = await prisma.friendship.findMany({
    where: { status: "ACCEPTED", OR: [{ requesterId: userId }, { addresseeId: userId }] },
    select: { requesterId: true, addresseeId: true },
  });
  return rows.map((r) => (r.requesterId === userId ? r.addresseeId : r.requesterId));
}

/** Whether the viewer may see the target's library and stats. */
export function libraryVisible(privacy: ProfilePrivacy, rel: Relationship): boolean {
  return rel.isSelf || privacy === "PUBLIC" || rel.friendship?.status === "ACCEPTED";
}
