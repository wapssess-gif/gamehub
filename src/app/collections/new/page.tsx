"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createCollection } from "@/lib/actions/collections";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locale";

export default function NewCollectionPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPending, setIsPending] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(locale === "ru" ? "Название обязательно" : "Name is required");
      return;
    }

    setIsPending(true);
    setError("");

    try {
      const collection = await createCollection(name, description || undefined);
      router.push(`/collections/${collection.id}`);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : (locale === "ru" ? "Ошибка при создании коллекции" : "Failed to create collection");
      setError(errorMsg);
      setIsPending(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="mb-8 text-3xl font-bold">
        {locale === "ru" ? "Создать коллекцию" : "Create Collection"}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            {t.collections.name} *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={locale === "ru" ? "например, Любимые RPG" : "e.g., Favorite RPGs"}
            maxLength={100}
            disabled={isPending}
            className="w-full rounded-md border border-white/10 bg-white/5 text-white placeholder:text-white/40 px-3 py-2 disabled:opacity-50"
          />
          <p className="mt-1 text-xs text-white/50">
            {name.length}/100
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t.collections.description}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={
              locale === "ru"
                ? "Расскажи об этой коллекции…"
                : "Tell us about this collection..."
            }
            maxLength={500}
            rows={4}
            disabled={isPending}
            className="w-full rounded-md border border-white/10 bg-white/5 text-white placeholder:text-white/40 px-3 py-2 disabled:opacity-50"
          />
          <p className="mt-1 text-xs text-white/50">
            {description.length}/500
          </p>
        </div>

        {error && (
          <div className="rounded-md border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isPending || !name.trim()}
            className="rounded-md bg-white text-black px-4 py-2 font-medium transition-all hover:bg-red-900 hover:text-white active:bg-red-950 disabled:opacity-60"
          >
            {isPending ? t.collections.creating : t.collections.create}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isPending}
            className="rounded-md border border-white/20 text-white px-4 py-2 font-medium transition-all hover:bg-white/10 active:bg-white/20 disabled:opacity-60"
          >
            {t.profile.cancel}
          </button>
        </div>
      </form>
    </div>
  );
}
