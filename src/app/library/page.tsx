import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getUserStats } from "@/lib/stats";
import { STATUS_LABELS, STATUS_ORDER } from "@/lib/labels";
import { GameSearchAdd } from "@/components/GameSearchAdd";
import { LibraryItem } from "@/components/LibraryItem";
import { StatsSummary } from "@/components/StatsSummary";

export default async function LibraryPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const userId = session.user.id;

  const [entries, stats] = await Promise.all([
    prisma.userGame.findMany({
      where: { userId },
      include: { game: true },
      orderBy: { updatedAt: "desc" },
    }),
    getUserStats(userId),
  ]);

  const grouped = STATUS_ORDER.map((status) => ({
    status,
    items: entries.filter((e) => e.status === status),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h1 className="mb-3 text-2xl font-semibold">Моя библиотека</h1>
        <StatsSummary stats={stats} />
      </section>

      <section>
        <h2 className="mb-2 text-lg font-medium">Добавить игру</h2>
        <GameSearchAdd />
      </section>

      <section className="flex flex-col gap-6">
        {grouped.length === 0 && (
          <p className="text-black/60 dark:text-white/60">
            Пока пусто — найдите игру выше и добавьте её в библиотеку.
          </p>
        )}

        {grouped.map((group) => (
          <div key={group.status}>
            <h3 className="mb-2 text-sm font-semibold uppercase text-black/60 dark:text-white/60">
              {STATUS_LABELS[group.status]} ({group.items.length})
            </h3>
            <ul className="flex flex-col gap-2">
              {group.items.map((entry) => (
                <LibraryItem
                  key={entry.id}
                  entry={{
                    id: entry.id,
                    status: entry.status,
                    progressPercent: entry.progressPercent,
                    hoursPlayed: entry.hoursPlayed ? Number(entry.hoursPlayed) : null,
                    rating: entry.rating,
                    game: {
                      title: entry.game.title,
                      coverUrl: entry.game.coverUrl,
                      genres: entry.game.genres,
                    },
                  }}
                />
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}
