"use client";

import { useState } from "react";
import { useTransition } from "react";
import { addGameToCollection } from "@/lib/actions/collections";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locale";
import type { UserGame, Game } from "@prisma/client";

interface AddGameToCollectionModalProps {
  collectionId: string;
  userGames: (UserGame & { game: Game })[];
  onClose: () => void;
}

export function AddGameToCollectionModal({
  collectionId,
  userGames,
  onClose,
}: AddGameToCollectionModalProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [locale, setLocale] = useState<Locale>("en");
  const [selectedGames, setSelectedGames] = useState<Set<string>>(new Set());

  const t = getDictionary(locale);

  const handleAdd = () => {
    if (selectedGames.size === 0) return;

    startTransition(async () => {
      try {
        for (const gameId of selectedGames) {
          await addGameToCollection(collectionId, gameId);
        }
        onClose();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error adding games";
        setError(msg);
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#141414] border border-white/10 rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">
            {locale === "ru" ? "Добавить игры в коллекцию" : "Add games to collection"}
          </h2>
        </div>

        {error && (
          <div className="mx-6 mt-6 rounded-md border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="p-6 space-y-2">
          {userGames.length === 0 ? (
            <p className="text-white/60">
              {locale === "ru" ? "В вашей библиотеке нет игр" : "You have no games in your library"}
            </p>
          ) : (
            userGames.map((ug) => (
              <label
                key={ug.id}
                className="flex items-center gap-3 p-2 rounded hover:bg-white/5 cursor-pointer text-white"
              >
                <input
                  type="checkbox"
                  checked={selectedGames.has(ug.gameId)}
                  onChange={(e) => {
                    const newSet = new Set(selectedGames);
                    if (e.target.checked) {
                      newSet.add(ug.gameId);
                    } else {
                      newSet.delete(ug.gameId);
                    }
                    setSelectedGames(newSet);
                  }}
                  disabled={isPending}
                  className="cursor-pointer"
                />
                <span>{ug.game.title}</span>
              </label>
            ))
          )}
        </div>

        <div className="p-6 border-t border-white/10 flex gap-3">
          <button
            onClick={handleAdd}
            disabled={isPending || selectedGames.size === 0}
            className="rounded-md bg-white text-black px-4 py-2 font-medium transition-all hover:bg-red-900 hover:text-white active:bg-red-950 disabled:opacity-60"
          >
            {isPending ? "..." : locale === "ru" ? "Добавить" : "Add"}
          </button>
          <button
            onClick={onClose}
            disabled={isPending}
            className="rounded-md border border-white/20 text-white px-4 py-2 font-medium transition-all hover:bg-white/10 active:bg-white/20 disabled:opacity-60"
          >
            {t.profile.cancel}
          </button>
        </div>
      </div>
    </div>
  );
}
