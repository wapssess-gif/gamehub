import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getRelationship } from "@/lib/social";
import { UserCard } from "@/components/UserCard";
import { FollowButton } from "@/components/FollowButton";
import { FriendButton } from "@/components/FriendButton";
import { getLocale } from "@/i18n/getLocale";
import { getDictionary } from "@/i18n/dictionaries";

export default async function UsersSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const meId = session.user.id;

  const { q: rawQuery } = await searchParams;
  const query = rawQuery?.trim().replace(/^@+/, "") ?? "";
  const t = getDictionary(await getLocale());

  const results =
    query.length >= 2
      ? await prisma.user.findMany({
          where: {
            username: { contains: query, mode: "insensitive" },
            NOT: { id: meId },
          },
          select: { id: true, username: true, displayName: true, avatarUrl: true },
          orderBy: { username: "asc" },
          take: 25,
        })
      : [];

  const relationships = await Promise.all(
    results.map((u) => getRelationship(meId, u.id)),
  );

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">{t.social.searchTitle}</h1>

      <form method="get" className="flex gap-3">
        <input
          name="q"
          defaultValue={rawQuery}
          placeholder={t.social.searchPlaceholder}
          className="min-w-48 flex-1 rounded-md border border-black/20 bg-transparent px-3 py-2 dark:border-white/20"
        />
        <button
          type="submit"
          className="rounded-md bg-foreground px-4 py-2 text-background hover:opacity-90"
        >
          {t.social.searchSubmit}
        </button>
      </form>

      {query.length >= 2 && results.length === 0 && (
        <p className="text-black/60 dark:text-white/60">{t.social.noUsersFound}</p>
      )}
      {query.length < 2 && (
        <p className="text-black/60 dark:text-white/60">{t.social.searchHint}</p>
      )}

      <ul className="flex flex-col gap-2">
        {results.map((user, i) => (
          <UserCard key={user.id} user={user}>
            <FollowButton
              targetUserId={user.id}
              following={relationships[i].following}
              t={t.social}
            />
            <FriendButton
              targetUserId={user.id}
              friendship={relationships[i].friendship}
              t={t.social}
            />
          </UserCard>
        ))}
      </ul>
    </div>
  );
}
