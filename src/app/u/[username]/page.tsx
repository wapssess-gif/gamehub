import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getUserStats, type UserStats } from "@/lib/stats";
import { getRelationship, getConnectionCounts, libraryVisible } from "@/lib/social";
import { Avatar } from "@/components/Avatar";
import { StatsSummary } from "@/components/StatsSummary";
import { ReadOnlyLibrary, type ReadOnlyEntry } from "@/components/ReadOnlyLibrary";
import { FollowButton } from "@/components/FollowButton";
import { FriendButton } from "@/components/FriendButton";
import { AchievementBadges } from "@/components/AchievementBadges";
import { getUserAchievements, type AchievementState } from "@/lib/achievements";
import { getLocale } from "@/i18n/getLocale";
import { getDictionary } from "@/i18n/dictionaries";

function findByUsername(username: string) {
  return prisma.user.findFirst({
    where: { username: { equals: username, mode: "insensitive" } },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const user = await findByUsername(username);
  if (!user) return { title: "GameHub" };
  return {
    title: `${user.displayName || user.username} (@${user.username}) | GameHub`,
    description: user.bio?.slice(0, 160) || undefined,
  };
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const meId = session.user.id;

  const locale = await getLocale();
  const t = getDictionary(locale);
  const s = t.social;

  const user = await findByUsername(username);
  if (!user) notFound();

  const [rel, counts] = await Promise.all([
    getRelationship(meId, user.id),
    getConnectionCounts(user.id),
  ]);

  const canSee = libraryVisible(user.privacy, rel);

  let entries: ReadOnlyEntry[] = [];
  let stats: UserStats | null = null;
  let achievements: AchievementState[] = [];
  if (canSee) {
    const [rows, computed, earned] = await Promise.all([
      prisma.userGame.findMany({
        where: { userId: user.id },
        include: { game: true },
        orderBy: { updatedAt: "desc" },
      }),
      getUserStats(user.id),
      getUserAchievements(user.id),
    ]);
    achievements = earned;
    entries = rows.map((e) => ({
      id: e.id,
      status: e.status,
      progressPercent: e.progressPercent,
      hoursPlayed: e.hoursPlayed ? Number(e.hoursPlayed) : null,
      rating: e.rating,
      game: {
        id: e.game.id,
        title: e.game.title,
        coverUrl: e.game.coverUrl,
        genres: e.game.genres,
      },
    }));
    stats = computed;
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar src={user.avatarUrl} name={user.username} size={72} />
          <div>
            <h1 className="text-2xl font-semibold">{user.displayName || user.username}</h1>
            <p className="text-sm text-black/60 dark:text-white/60">@{user.username}</p>
            {user.privacy === "PRIVATE" && (
              <span className="mt-1 inline-block rounded-full border border-black/15 px-2 py-0.5 text-xs text-black/60 dark:border-white/15 dark:text-white/60">
                {s.privateBadge}
              </span>
            )}
          </div>
        </div>

        {rel.isSelf ? (
          <Link
            href="/profile"
            className="rounded-md border border-black/20 px-3 py-1.5 text-sm hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/5"
          >
            {s.editProfile}
          </Link>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <FollowButton targetUserId={user.id} following={rel.following} t={s} />
            <FriendButton targetUserId={user.id} friendship={rel.friendship} t={s} />
          </div>
        )}
      </section>

      {user.bio && <p className="text-black/80 dark:text-white/80">{user.bio}</p>}

      <section className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-black/60 dark:text-white/60">
        <span>
          {s.friends}: <strong className="text-foreground">{counts.friends}</strong>
        </span>
        <span>
          {s.followers}: <strong className="text-foreground">{counts.followers}</strong>
        </span>
        <span>
          {s.following}: <strong className="text-foreground">{counts.following}</strong>
        </span>
        {rel.followsYou && !rel.isSelf && <span className="text-black/50 dark:text-white/50">{s.followsYou}</span>}
      </section>

      {canSee && stats ? (
        <>
          <section>
            <h2 className="mb-2 text-lg font-medium">{t.profile.statsHeading}</h2>
            <StatsSummary stats={stats} t={t} />
          </section>
          <AchievementBadges
            achievements={achievements}
            showLocked={false}
            locale={locale}
            t={t.achievements}
          />
          <section>
            <h2 className="mb-3 text-lg font-medium">{t.nav.library}</h2>
            <ReadOnlyLibrary entries={entries} t={t} />
          </section>
        </>
      ) : (
        <section className="rounded-md border border-dashed border-black/20 p-6 text-center text-sm text-black/60 dark:border-white/20 dark:text-white/60">
          {s.privateProfileNotice}
        </section>
      )}
    </div>
  );
}
