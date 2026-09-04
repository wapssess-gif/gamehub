"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { addGameToLibrary } from "@/lib/actions/library";
import type { Dictionary } from "@/i18n/dictionaries";

type SearchResult = {
  externalId: string;
  title: string;
  coverUrl: string | null;
  releaseDate: string | null;
  genres: string[];
};

export function GameSearchAdd({ t }: { t: Dictionary["search"] }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const trimmedQuery = query.trim();

  useEffect(() => {
    if (trimmedQuery.length < 2) {
      return;
    }

    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/games/search?q=${encodeURIComponent(trimmedQuery)}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(t.searchFailed);
        const data = await res.json();
        setResults(data.results ?? []);
      } catch (err) {
        if (!(err instanceof DOMException && err.name === "AbortError")) {
          setError(t.searchFailed);
        }
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [trimmedQuery, t.searchFailed]);

  const visibleResults = trimmedQuery.length < 2 ? [] : results;

  function handleAdd(externalId: string) {
    setAddingId(externalId);
    startTransition(async () => {
      try {
        await addGameToLibrary(externalId);
        setResults((prev) => prev.filter((r) => r.externalId !== externalId));
      } catch {
        setError(t.addFailed);
      } finally {
        setAddingId(null);
      }
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t.placeholder}
        className="rounded-md border border-black/20 bg-transparent px-3 py-2 outline-none focus:border-foreground dark:border-white/20"
      />

      {loading && <p className="text-sm text-black/60 dark:text-white/60">{t.searching}</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {visibleResults.length > 0 && (
        <ul className="flex flex-col gap-2">
          {visibleResults.map((game) => (
            <li
              key={game.externalId}
              className="flex items-center justify-between gap-3 rounded-md border border-black/10 p-2 dark:border-white/10"
            >
              <div className="flex items-center gap-3">
                {game.coverUrl && (
                  <Image
                    src={game.coverUrl}
                    alt={game.title}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded object-cover"
                  />
                )}
                <div>
                  <p className="font-medium">{game.title}</p>
                  <p className="text-xs text-black/60 dark:text-white/60">
                    {game.releaseDate ?? t.unknownDate} · {game.genres.join(", ") || t.unknownGenre}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleAdd(game.externalId)}
                disabled={isPending && addingId === game.externalId}
                className="shrink-0 rounded-md bg-foreground px-3 py-1.5 text-sm text-background hover:opacity-90 disabled:opacity-50"
              >
                {isPending && addingId === game.externalId ? t.adding : t.add}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
