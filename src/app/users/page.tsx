import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getRelationship } from "@/lib/social";
import { UserCard } from "@/components/UserCard";
import { FollowButton } from "@/components/FollowButton";
import { FriendButton } from "@/components/FriendButton";
import { getLocale } from "@/i18n/getLocale";
import { getDictionary } from "@/i18n/dictionaries";

type SearchMode = "handle" | "name" | "id";
const MODES: SearchMode[] = ["handle", "name", "id"];

export default async function UsersSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; by?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const meId = session.user.id;

  const { q: rawQuery, by: rawBy } = await searchParams;
  const mode: SearchMode = MODES.includes(rawBy as SearchMode) ? (rawBy as SearchMode) : "handle";
  const t = getDictionary(await getLocale());
  const s = t.social;

  const raw = rawQuery?.trim() ?? "";
  let where: Prisma.UserWhereInput | null = null;

  if (mode === "id") {
    const n = Number.parseInt(raw, 10);
    if (Number.isInteger(n) && n > 0 && String(n) === raw) {
      where = { publicId: n };
    }
  } else if (mode === "name") {
    if (raw.length >= 2) where = { displayName: { contains: raw, mode: "insensitive" } };
  } else {
    const handle = raw.replace(/^@+/, "");
    if (handle.length >= 2) where = { username: { contains: handle, mode: "insensitive" } };
  }

  const results = where
    ? await prisma.user.findMany({
        where: { ...where, NOT: { id: meId } },
        select: { id: true, publicId: true, username: true, displayName: true, avatarUrl: true },
        orderBy: { username: "asc" },
        take: 25,
      })
    : [];

  const relationships = await Promise.all(results.map((u) => getRelationship(meId, u.id)));

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">{s.searchTitle}</h1>

      <form method="get" className="flex flex-wrap gap-3">
        <select
          name="by"
          defaultValue={mode}
          className="rounded-md border border-white/20 bg-[#141414] px-3 py-2 text-sm"
        >
          <option value="handle">{s.searchByHandle}</option>
          <option value="name">{s.searchByName}</option>
          <option value="id">{s.searchById}</option>
        </select>
        <input
          name="q"
          defaultValue={rawQuery}
          placeholder={s.searchPlaceholder}
          className="min-w-48 flex-1 rounded-md border border-black/20 bg-transparent px-3 py-2 dark:border-white/20"
        />
        <button
          type="submit"
          className="rounded-md bg-foreground px-4 py-2 text-background hover:opacity-90"
        >
          {s.searchSubmit}
        </button>
      </form>

      {where && results.length === 0 && (
        <p className="text-black/60 dark:text-white/60">{s.noUsersFound}</p>
      )}
      {!where && <p className="text-black/60 dark:text-white/60">{s.searchHint}</p>}

      <ul className="flex flex-col gap-2">
        {results.map((user, i) => (
          <UserCard key={user.id} user={user}>
            <FollowButton
              targetUserId={user.id}
              following={relationships[i].following}
              t={s}
            />
            <FriendButton
              targetUserId={user.id}
              friendship={relationships[i].friendship}
              t={s}
            />
          </UserCard>
        ))}
      </ul>
    </div>
  );
}
