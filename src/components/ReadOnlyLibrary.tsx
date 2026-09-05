import Image from "next/image";
import Link from "next/link";
import type { GameStatus } from "@prisma/client";
import { STATUS_ORDER } from "@/lib/labels";
import type { Dictionary } from "@/i18n/dictionaries";

export type ReadOnlyEntry = {
  id: string;
  status: GameStatus;
  progressPercent: number | null;
  hoursPlayed: number | null;
  rating: number | null;
  game: { id: string; title: string; coverUrl: string | null; genres: string[] };
};

/** Someone else's library — grouped by status, no editing controls. */
export function ReadOnlyLibrary({ entries, t }: { entries: ReadOnlyEntry[]; t: Dictionary }) {
  if (entries.length === 0) {
    return <p className="text-black/60 dark:text-white/60">{t.social.emptyLibrary}</p>;
  }

  const grouped = STATUS_ORDER.map((status) => ({
    status,
    items: entries.filter((e) => e.status === status),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="flex flex-col gap-6">
      {grouped.map((group) => (
        <div key={group.status}>
          <h3 className="mb-2 text-sm font-semibold uppercase text-black/60 dark:text-white/60">
            {t.status[group.status]} ({group.items.length})
          </h3>
          <ul className="flex flex-col gap-2">
            {group.items.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center gap-3 rounded-md border border-black/10 p-3 dark:border-white/10"
              >
                {entry.game.coverUrl && (
                  <Image
                    src={entry.game.coverUrl}
                    alt={entry.game.title}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded object-cover"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/games/${entry.game.id}`}
                    className="font-medium hover:underline"
                  >
                    {entry.game.title}
                  </Link>
                  <p className="truncate text-xs text-black/60 dark:text-white/60">
                    {entry.game.genres.join(", ") || t.library.unknownGenre}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center justify-end gap-x-3 gap-y-0.5 text-xs text-black/60 dark:text-white/60">
                  {entry.rating != null && <span>★ {entry.rating}/10</span>}
                  {entry.hoursPlayed != null && (
                    <span>
                      {entry.hoursPlayed} {t.gameDetails.hours}
                    </span>
                  )}
                  {entry.progressPercent != null && <span>{entry.progressPercent}%</span>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
