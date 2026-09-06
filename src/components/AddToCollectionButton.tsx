"use client";

import { useState, useEffect } from "react";
import { useTransition } from "react";
import { addGameToCollection } from "@/lib/actions/collections";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locale";
import type { Collection } from "@prisma/client";

interface AddToCollectionButtonProps {
  gameId: string;
  collections: Collection[];
}

export function AddToCollectionButton({
  gameId,
  collections,
}: AddToCollectionButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    const cookieLocale = document.cookie
      .split("; ")
      .find((row) => row.startsWith("NEXT_LOCALE="))
      ?.split("=")[1] as Locale;
    if (cookieLocale) setLocale(cookieLocale);
  }, []);

  const t = getDictionary(locale);

  const handleAddToCollection = (collectionId: string) => {
    startTransition(async () => {
      try {
        await addGameToCollection(collectionId, gameId);
        setIsOpen(false);
        setError("");
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error adding game";
        setError(msg);
      }
    });
  };

  if (collections.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="text-sm text-white/60 hover:text-white transition-colors disabled:opacity-50"
      >
        {locale === "ru" ? "Добавить в коллекцию" : "Add to collection"}
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-[#141414] border border-white/10 rounded-md shadow-lg z-10 min-w-48">
          <div className="p-2">
            {error && (
              <div className="text-xs text-red-400 mb-2 px-2 py-1">
                {error}
              </div>
            )}
            {collections.map((collection) => (
              <button
                key={collection.id}
                onClick={() => handleAddToCollection(collection.id)}
                disabled={isPending}
                className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/5 rounded transition-colors disabled:opacity-50"
              >
                {collection.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
