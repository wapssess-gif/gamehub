import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getRelationship, type Relationship } from "@/lib/social";
import { UserCard } from "@/components/UserCard";
import { FollowButton } from "@/components/FollowButton";
import { FriendButton } from "@/components/FriendButton";
import { getLocale } from "@/i18n/getLocale";
import { getDictionary } from "@/i18n/dictionaries";

const USER_FIELDS = {
  id: true,
  username: true,
  displayName: true,
  avatarUrl: true,
} as const;

type ListedUser = {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
};

export default async function FriendsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const meId = session.user.id;

  const t = getDictionary(await getLocale());
  const s = t.social;

  const [incoming, outgoing, friendRows, followingRows, followerRows] = await Promise.all([
    prisma.friendship.findMany({
      where: { addresseeId: meId, status: "PENDING" },
      include: { requester: { select: USER_FIELDS } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.friendship.findMany({
      where: { requesterId: meId, status: "PENDING" },
      include: { addressee: { select: USER_FIELDS } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.friendship.findMany({
      where: { status: "ACCEPTED", OR: [{ requesterId: meId }, { addresseeId: meId }] },
      include: {
        requester: { select: USER_FIELDS },
        addressee: { select: USER_FIELDS },
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.follow.findMany({
      where: { followerId: meId },
      include: { following: { select: USER_FIELDS } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.follow.findMany({
      where: { followingId: meId },
      include: { follower: { select: USER_FIELDS } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const friends: ListedUser[] = friendRows.map((f) =>
    f.requesterId === meId ? f.addressee : f.requester,
  );
  const following = followingRows.map((f) => f.following);
  const followers = followerRows.map((f) => f.follower);

  // One relationship lookup per distinct listed user, shared across sections.
  const distinctIds = [
    ...new Set([
      ...outgoing.map((f) => f.addressee.id),
      ...friends.map((u) => u.id),
      ...following.map((u) => u.id),
      ...followers.map((u) => u.id),
    ]),
  ];
  const relEntries = await Promise.all(
    distinctIds.map(async (id) => [id, await getRelationship(meId, id)] as const),
  );
  const rels = new Map<string, Relationship>(relEntries);

  const totalConnections =
    incoming.length + outgoing.length + friends.length + following.length + followers.length;

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-semibold">{s.connectionsTitle}</h1>

      {totalConnections === 0 && (
        <p className="text-black/60 dark:text-white/60">
          {s.connectionsEmpty}{" "}
          <Link href="/users" className="underline">
            {s.findPeople}
          </Link>
        </p>
      )}

      {incoming.length > 0 && (
        <Section title={`${s.incomingRequests} (${incoming.length})`}>
          {incoming.map((f) => (
            <UserCard key={f.id} user={f.requester}>
              <FriendButton
                targetUserId={f.requester.id}
                friendship={{ id: f.id, status: "PENDING", iAmRequester: false }}
                t={s}
              />
            </UserCard>
          ))}
        </Section>
      )}

      {outgoing.length > 0 && (
        <Section title={`${s.outgoingRequests} (${outgoing.length})`}>
          {outgoing.map((f) => (
            <UserCard key={f.id} user={f.addressee}>
              <FriendButton
                targetUserId={f.addressee.id}
                friendship={{ id: f.id, status: "PENDING", iAmRequester: true }}
                t={s}
              />
            </UserCard>
          ))}
        </Section>
      )}

      {friends.length > 0 && (
        <Section title={`${s.friends} (${friends.length})`}>
          {friends.map((u) => (
            <UserCard key={u.id} user={u}>
              <FriendButton
                targetUserId={u.id}
                friendship={rels.get(u.id)?.friendship ?? null}
                t={s}
              />
            </UserCard>
          ))}
        </Section>
      )}

      {following.length > 0 && (
        <Section title={`${s.following} (${following.length})`}>
          {following.map((u) => (
            <UserCard key={u.id} user={u}>
              <FollowButton
                targetUserId={u.id}
                following={rels.get(u.id)?.following ?? true}
                t={s}
              />
            </UserCard>
          ))}
        </Section>
      )}

      {followers.length > 0 && (
        <Section title={`${s.followers} (${followers.length})`}>
          {followers.map((u) => (
            <UserCard key={u.id} user={u}>
              <FollowButton
                targetUserId={u.id}
                following={rels.get(u.id)?.following ?? false}
                t={s}
              />
            </UserCard>
          ))}
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-sm font-semibold uppercase text-black/60 dark:text-white/60">
        {title}
      </h2>
      <ul className="flex flex-col gap-2">{children}</ul>
    </section>
  );
}
