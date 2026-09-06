"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { relativeTime } from "@/lib/format";
import { upsertReview, deleteReview } from "@/lib/actions/reviews";
import type { ReviewView } from "@/lib/reviews";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locale";

type MyReview = { rating: number; body: string; createdAt: string; updatedAt: string };

export function GameReviews({
  gameId,
  otherReviews,
  myReview,
  isLoggedIn,
  gameInDb,
  locale,
  t,
}: {
  gameId: string;
  otherReviews: ReviewView[];
  myReview: MyReview | null;
  isLoggedIn: boolean;
  gameInDb: boolean;
  locale: Locale;
  t: Dictionary["reviews"];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [rating, setRating] = useState<number | "">(myReview?.rating ?? "");
  const [body, setBody] = useState(myReview?.body ?? "");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      try {
        await upsertReview(gameId, rating === "" ? 0 : Number(rating), body);
        setError("");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : t.errorEmptyBody);
      }
    });
  }

  function handleDelete() {
    if (!confirm(t.deleteConfirm)) return;
    startTransition(async () => {
      await deleteReview(gameId);
      setRating("");
      setBody("");
      router.refresh();
    });
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">{t.heading}</h2>

      {!gameInDb ? (
        <p className="text-sm text-black/60 dark:text-white/60">{t.addToDbHint}</p>
      ) : !isLoggedIn ? (
        <p className="text-sm text-black/60 dark:text-white/60">{t.loginToReview}</p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 rounded-xl border border-black/10 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/[0.02]"
        >
          <p className="text-sm font-medium">{t.writeHeading}</p>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-black/60 dark:text-white/60">{t.ratingLabel}</label>
            <input
              type="number"
              min={1}
              max={10}
              value={rating}
              onChange={(e) => setRating(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-24 rounded-md border border-black/20 bg-background px-3 py-2 text-sm outline-none focus:border-foreground dark:border-white/20"
              disabled={isPending}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-black/60 dark:text-white/60">{t.bodyLabel}</label>
            <textarea
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={t.bodyPlaceholder}
              className="w-full rounded-md border border-black/20 bg-background px-3 py-2 text-sm outline-none focus:border-foreground dark:border-white/20"
              disabled={isPending}
            />
          </div>

          {error && (
            <p className="rounded-md border border-red-500/50 bg-red-500/10 p-2 text-xs text-red-400">
              {error}
            </p>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-all hover:bg-red-900 hover:text-white active:bg-red-950 disabled:opacity-60"
            >
              {isPending ? t.saving : myReview ? t.update : t.submit}
            </button>
            {myReview && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="text-xs text-red-500 hover:underline disabled:opacity-50"
              >
                {t.delete}
              </button>
            )}
          </div>
        </form>
      )}

      <ul className="flex flex-col gap-3">
        {myReview && (
          <ReviewItem
            review={{
              id: "mine",
              authorId: "",
              rating: myReview.rating,
              body: myReview.body,
              createdAt: myReview.createdAt,
              updatedAt: myReview.updatedAt,
              author: { username: "", displayName: t.writeHeading, avatarUrl: null },
            }}
            locale={locale}
            t={t}
            selfLabel
          />
        )}
        {otherReviews.map((r) => (
          <ReviewItem key={r.id} review={r} locale={locale} t={t} />
        ))}
        {!myReview && otherReviews.length === 0 && gameInDb && (
          <li className="text-sm text-black/60 dark:text-white/60">{t.none}</li>
        )}
      </ul>
    </section>
  );
}

function ReviewItem({
  review,
  locale,
  t,
  selfLabel = false,
}: {
  review: ReviewView;
  locale: Locale;
  t: Dictionary["reviews"];
  selfLabel?: boolean;
}) {
  const edited = review.updatedAt !== review.createdAt;
  return (
    <li className="flex flex-col gap-2 rounded-xl border border-black/10 p-4 dark:border-white/10">
      <div className="flex items-center gap-3">
        {selfLabel ? (
          <span className="text-sm font-medium">{review.author.displayName}</span>
        ) : (
          <Link
            href={`/u/${review.author.username}`}
            className="flex items-center gap-2 hover:opacity-85"
          >
            <Avatar src={review.author.avatarUrl} name={review.author.username} size={28} />
            <span className="text-sm font-medium">
              {review.author.displayName || review.author.username}
            </span>
          </Link>
        )}
        <span className="rounded-full bg-foreground px-2 py-0.5 text-xs font-medium text-background">
          {review.rating}/10
        </span>
        <span className="text-xs text-black/50 dark:text-white/50">
          {relativeTime(review.createdAt, locale)}
          {edited ? ` · ${t.edited}` : ""}
        </span>
      </div>
      <p className="whitespace-pre-line text-sm text-black/80 dark:text-white/80">{review.body}</p>
    </li>
  );
}
