"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { GameStatus } from "@prisma/client";
import {
  addGameToLibrary,
  changeLibraryStatus,
  removeLibraryEntry,
  updateLibraryEntry,
} from "@/lib/actions/library";
import { STATUS_ORDER } from "@/lib/labels";
import type { Dictionary } from "@/i18n/dictionaries";

export type UserGameDetailView = {
  id: string;
  status: GameStatus;
  progressPercent: number | null;
  hoursPlayed: number | null;
  rating: number | null;
  notes: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  createdAt: string;
};

export function GameLibraryCard({
  externalId,
  userGame,
  isLoggedIn,
  t,
}: {
  externalId: string;
  userGame: UserGameDetailView | null;
  isLoggedIn: boolean;
  t: Dictionary["gameDetails"] & {
    status: Dictionary["status"];
    removeConfirm: string;
    remove: string;
  };
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const [status, setStatus] = useState<GameStatus>(userGame?.status ?? "WANT_TO_PLAY");
  const [progress, setProgress] = useState(userGame?.progressPercent ?? "");
  const [hours, setHours] = useState(userGame?.hoursPlayed ?? "");
  const [rating, setRating] = useState(userGame?.rating ?? "");
  const [notes, setNotes] = useState(userGame?.notes ?? "");

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-black/10 bg-black/[0.02] p-4 sm:p-6 dark:border-white/10 dark:bg-white/[0.02]">
        <div>
          <h3 className="font-semibold text-base">{t.inLibraryStatus}</h3>
          <p className="text-sm text-black/60 dark:text-white/60">
            {t.loginToAdd}
          </p>
        </div>
        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:opacity-90 transition-opacity"
        >
          {t.loginToAdd}
        </Link>
      </div>
    );
  }

  if (!userGame) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-dashed border-black/20 bg-black/[0.01] p-4 sm:p-6 dark:border-white/20 dark:bg-white/[0.01]">
        <div>
          <h3 className="font-semibold text-base">{t.notInLibrary}</h3>
          <p className="text-sm text-black/60 dark:text-white/60 mt-0.5">
            {t.inLibraryStatus}
          </p>
        </div>
        <button
          onClick={() => {
            startTransition(async () => {
              await addGameToLibrary(externalId);
              router.refresh();
            });
          }}
          disabled={isPending}
          className="inline-flex items-center justify-center rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {isPending ? "..." : t.addToLibrary}
        </button>
      </div>
    );
  }

  function handleSave() {
    startTransition(async () => {
      await updateLibraryEntry(userGame!.id, {
        progressPercent: progress === "" ? null : Number(progress),
        hoursPlayed: hours === "" ? null : Number(hours),
        rating: rating === "" ? null : Number(rating),
        notes: notes.trim() === "" ? null : notes.trim(),
      });
      setSavedAt(Date.now());
      router.refresh();
    });
  }

  function handleStatusChange(newStatus: GameStatus) {
    setStatus(newStatus);
    startTransition(async () => {
      await changeLibraryStatus(userGame!.id, newStatus);
      router.refresh();
    });
  }

  function handleRemove() {
    if (!confirm(t.removeConfirm)) return;
    startTransition(async () => {
      await removeLibraryEntry(userGame!.id);
      router.refresh();
    });
  }

  const progressNum = typeof progress === "number" ? Math.min(100, Math.max(0, progress)) : 0;

  return (
    <div className="flex flex-col gap-5 rounded-xl border border-black/10 bg-black/[0.02] p-5 sm:p-6 dark:border-white/10 dark:bg-white/[0.02]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-4 dark:border-white/10">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-black/50 dark:text-white/50">
            {t.inLibraryStatus}
          </span>
          <span className="rounded-full bg-foreground px-2.5 py-0.5 text-xs font-medium text-background">
            {t.status[status]}
          </span>
        </div>

        <button
          onClick={handleRemove}
          disabled={isPending}
          className="text-xs text-red-500 hover:underline disabled:opacity-50"
        >
          {t.remove}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-black/60 dark:text-white/60">
            {t.inLibraryStatus}
          </label>
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value as GameStatus)}
            disabled={isPending}
            className="w-full rounded-lg border border-black/20 bg-background px-3 py-2 text-sm outline-none focus:border-foreground dark:border-white/20"
          >
            {STATUS_ORDER.map((st) => (
              <option key={st} value={st}>
                {t.status[st]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-black/60 dark:text-white/60">
              {progressNum}%
            </label>
          </div>
          <input
            type="number"
            min={0}
            max={100}
            value={progress}
            onChange={(e) => setProgress(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="0-100"
            className="w-full rounded-lg border border-black/20 bg-background px-3 py-2 text-sm outline-none focus:border-foreground dark:border-white/20"
          />
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10 mt-1">
            <div
              className="h-full bg-foreground transition-all duration-300"
              style={{ width: `${progressNum}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-black/60 dark:text-white/60">
            {t.hours}
          </label>
          <input
            type="number"
            min={0}
            step={0.5}
            value={hours}
            onChange={(e) => setHours(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="0"
            className="w-full rounded-lg border border-black/20 bg-background px-3 py-2 text-sm outline-none focus:border-foreground dark:border-white/20"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-black/60 dark:text-white/60">
            {t.rating} (1-10)
          </label>
          <input
            type="number"
            min={1}
            max={10}
            value={rating}
            onChange={(e) => setRating(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="1-10"
            className="w-full rounded-lg border border-black/20 bg-background px-3 py-2 text-sm outline-none focus:border-foreground dark:border-white/20"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-black/60 dark:text-white/60">
          {t.notes}
        </label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t.notesPlaceholder}
          className="w-full rounded-lg border border-black/20 bg-background px-3 py-2 text-sm outline-none focus:border-foreground dark:border-white/20"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={isPending}
            className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {isPending ? "..." : t.saveChanges}
          </button>
          {savedAt && !isPending && (
            <span className="text-xs font-medium text-green-600">✓ {t.saved}</span>
          )}
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-black/50 dark:text-white/50">
          <span>{t.addedOn} {new Date(userGame.createdAt).toLocaleDateString()}</span>
          {userGame.startedAt && (
            <span>{t.startedOn} {new Date(userGame.startedAt).toLocaleDateString()}</span>
          )}
          {userGame.finishedAt && (
            <span>{t.finishedOn} {new Date(userGame.finishedAt).toLocaleDateString()}</span>
          )}
        </div>
      </div>
    </div>
  );
}
