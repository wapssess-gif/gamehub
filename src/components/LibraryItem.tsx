"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import type { GameStatus } from "@prisma/client";
import { changeLibraryStatus, removeLibraryEntry, updateLibraryEntry } from "@/lib/actions/library";
import { STATUS_ORDER } from "@/lib/labels";
import type { Dictionary } from "@/i18n/dictionaries";

export type LibraryEntryView = {
  id: string;
  status: GameStatus;
  progressPercent: number | null;
  hoursPlayed: number | null;
  rating: number | null;
  game: {
    id: string;
    title: string;
    coverUrl: string | null;
    genres: string[];
  };
};

export function LibraryItem({
  entry,
  t,
}: {
  entry: LibraryEntryView;
  t: Dictionary["library"] & { status: Dictionary["status"] };
}) {
  const [progress, setProgress] = useState(entry.progressPercent ?? "");
  const [hours, setHours] = useState(entry.hoursPlayed ?? "");
  const [rating, setRating] = useState(entry.rating ?? "");
  const [isPending, startTransition] = useTransition();
  const [savedAt, setSavedAt] = useState<number | null>(null);

  function saveFields() {
    startTransition(async () => {
      await updateLibraryEntry(entry.id, {
        progressPercent: progress === "" ? null : Number(progress),
        hoursPlayed: hours === "" ? null : Number(hours),
        rating: rating === "" ? null : Number(rating),
      });
      setSavedAt(Date.now());
    });
  }

  function handleStatusChange(status: GameStatus) {
    startTransition(async () => {
      await changeLibraryStatus(entry.id, status);
    });
  }

  function handleRemove() {
    if (!confirm(t.removeConfirm.replace("{title}", entry.game.title))) return;
    startTransition(async () => {
      await removeLibraryEntry(entry.id);
    });
  }

  return (
    <li className="flex flex-col gap-3 rounded-md border border-black/10 p-3 sm:flex-row sm:items-center dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 transition-colors">
      <Link
        href={`/games/${entry.game.id}`}
        className="group flex flex-1 items-center gap-3 transition-opacity hover:opacity-85"
      >
        {entry.game.coverUrl && (
          <Image
            src={entry.game.coverUrl}
            alt={entry.game.title}
            width={56}
            height={56}
            className="h-14 w-14 rounded object-cover shadow-sm transition-transform group-hover:scale-105"
          />
        )}
        <div>
          <p className="font-medium group-hover:underline flex items-center gap-1.5">
            <span>{entry.game.title}</span>
            <span className="text-xs text-black/40 dark:text-white/40 group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </p>
          <p className="text-xs text-black/60 dark:text-white/60">
            {entry.game.genres.join(", ") || t.unknownGenre}
          </p>
        </div>
      </Link>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <select
          value={entry.status}
          onChange={(e) => handleStatusChange(e.target.value as GameStatus)}
          className="rounded-md border border-black/20 bg-transparent px-2 py-1 dark:border-white/20"
        >
          {STATUS_ORDER.map((status) => (
            <option key={status} value={status}>
              {t.status[status]}
            </option>
          ))}
        </select>

        <input
          type="number"
          min={0}
          max={100}
          value={progress}
          onChange={(e) => setProgress(e.target.value === "" ? "" : Number(e.target.value))}
          placeholder={t.percentPlaceholder}
          className="w-24 rounded-md border border-black/20 bg-transparent px-2 py-1 dark:border-white/20"
        />

        <input
          type="number"
          min={0}
          step={0.5}
          value={hours}
          onChange={(e) => setHours(e.target.value === "" ? "" : Number(e.target.value))}
          placeholder={t.hoursPlaceholder}
          className="w-20 rounded-md border border-black/20 bg-transparent px-2 py-1 dark:border-white/20"
        />

        <input
          type="number"
          min={1}
          max={10}
          value={rating}
          onChange={(e) => setRating(e.target.value === "" ? "" : Number(e.target.value))}
          placeholder={t.ratingPlaceholder}
          className="w-20 rounded-md border border-black/20 bg-transparent px-2 py-1 dark:border-white/20"
        />

        <button
          onClick={saveFields}
          disabled={isPending}
          className="rounded-md bg-foreground px-3 py-1 text-background hover:opacity-90 disabled:opacity-50"
        >
          {isPending ? "..." : t.save}
        </button>

        {savedAt && !isPending && <span className="text-xs text-green-600">{t.saved}</span>}

        <Link
          href={`/games/${entry.game.id}`}
          className="rounded-md border border-black/20 px-2.5 py-1 text-xs hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/5"
        >
          {t.details}
        </Link>

        <button
          onClick={handleRemove}
          disabled={isPending}
          className="text-red-500 hover:underline disabled:opacity-50 text-xs"
        >
          {t.remove}
        </button>
      </div>
    </li>
  );
}
