import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getFeed, type FeedItem } from "@/lib/activity";
import { relativeTime } from "@/lib/format";
import { Avatar } from "@/components/Avatar";
import { getLocale } from "@/i18n/getLocale";
import { getDictionary } from "@/i18n/dictionaries";
import type { AchievementId } from "@/lib/achievements";

export default async function FeedPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const locale = await getLocale();
  const t = getDictionary(locale);
  const a = t.activity;

  const events = await getFeed(session.user.id);

  function verb(item: FeedItem): string {
    switch (item.type) {
      case "ADDED_GAME":
        return a.addedGame;
      case "STARTED_PLAYING":
        return a.startedPlaying;
      case "COMPLETED":
        return a.completed;
      case "RATED":
        return a.rated.replace("{rating}", String(item.rating ?? ""));
      case "REVIEWED":
        return a.reviewed;
      case "ACHIEVEMENT_UNLOCKED":
        return t.achievements.activityVerb;
    }
  }

  function target(item: FeedItem) {
    if (item.type === "ACHIEVEMENT_UNLOCKED" && item.achievementId) {
      const meta = t.achievements.items[item.achievementId as AchievementId];
      return <span className="font-medium">«{meta?.name ?? item.achievementId}»</span>;
    }
    if (item.game) {
      return (
        <Link href={`/games/${item.game.externalId}`} className="font-medium hover:text-red-400">
          {item.game.title}
        </Link>
      );
    }
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">{a.title}</h1>

      {events.length === 0 ? (
        <p className="text-black/60 dark:text-white/60">
          {a.empty}{" "}
          <Link href="/users" className="underline">
            {t.social.findPeople}
          </Link>
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {events.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-md border border-black/10 p-3 dark:border-white/10"
            >
              <Link href={`/u/${item.actor.username}`} className="shrink-0">
                <Avatar src={item.actor.avatarUrl} name={item.actor.username} size={40} />
              </Link>

              <div className="min-w-0 flex-1 text-sm">
                <Link href={`/u/${item.actor.username}`} className="font-medium hover:underline">
                  {item.actor.displayName || item.actor.username}
                </Link>{" "}
                <span className="text-black/60 dark:text-white/60">{verb(item)}</span>{" "}
                {target(item)}
                <div className="mt-0.5 text-xs text-black/50 dark:text-white/50">
                  {relativeTime(item.createdAt, locale)}
                </div>
              </div>

              {item.type === "ACHIEVEMENT_UNLOCKED" ? (
                <span className="shrink-0 text-2xl" aria-hidden>
                  🏆
                </span>
              ) : (
                item.game?.coverUrl && (
                  <Link
                    href={`/games/${item.game.externalId}`}
                    className="shrink-0 overflow-hidden rounded border border-black/10 dark:border-white/10"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.game.coverUrl} alt="" className="h-12 w-20 object-cover" />
                  </Link>
                )
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
