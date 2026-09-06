"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { updateCollection, deleteCollection } from "@/lib/actions/collections";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locale";

export default function EditCollectionPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    const cookieLocale = document.cookie
      .split("; ")
      .find((row) => row.startsWith("NEXT_LOCALE="))
      ?.split("=")[1] as Locale;
    if (cookieLocale) setLocale(cookieLocale);

    // Load collection data
    const loadCollection = async () => {
      try {
        const res = await fetch(`/api/collections/${id}`);
        if (res.ok) {
          const data = await res.json();
          setName(data.name);
          setDescription(data.description || "");
        }
      } catch {
        setError("Failed to load collection");
      }
    };

    loadCollection();
  }, [id]);

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
      await updateCollection(id, name, description || undefined);
      router.push(`/collections/${id}`);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to update collection";
      setError(errorMsg);
      setIsPending(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(locale === "ru" ? "Удалить коллекцию?" : "Delete collection?")) {
      return;
    }

    setIsDeleting(true);
    setError("");

    try {
      await deleteCollection(id);
      router.push("/collections");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to delete collection";
      setError(errorMsg);
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="mb-8 text-3xl font-bold">
        {locale === "ru" ? "Редактировать коллекцию" : "Edit Collection"}
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
            maxLength={100}
            disabled={isPending || isDeleting}
            className="w-full rounded-md border border-black/10 bg-white text-black placeholder:text-black/50 px-3 py-2 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/50 disabled:opacity-50"
          />
          <p className="mt-1 text-xs text-black/50 dark:text-white/50">
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
            maxLength={500}
            rows={4}
            disabled={isPending || isDeleting}
            className="w-full rounded-md border border-black/10 bg-white text-black placeholder:text-black/50 px-3 py-2 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/50 disabled:opacity-50"
          />
          <p className="mt-1 text-xs text-black/50 dark:text-white/50">
            {description.length}/500
          </p>
        </div>

        {error && (
          <div className="rounded-md border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isPending || isDeleting}
            className="rounded-md bg-white dark:bg-red-900 text-black dark:text-white px-4 py-2 font-medium transition-all hover:bg-red-900 hover:text-white dark:hover:bg-red-950 active:bg-red-950 disabled:opacity-60"
          >
            {isPending ? (locale === "ru" ? "Сохраняю..." : "Saving...") : (locale === "ru" ? "Сохранить" : "Save")}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isPending || isDeleting}
            className="rounded-md border border-black/20 text-black dark:text-white dark:border-white/20 px-4 py-2 font-medium transition-all hover:bg-black/10 active:bg-black/20 disabled:opacity-60 dark:hover:bg-white/10 dark:active:bg-white/20"
          >
            {t.profile.cancel}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending || isDeleting}
            className="rounded-md border border-red-500/50 px-4 py-2 font-medium text-red-600 transition-all hover:bg-red-500/10 active:bg-red-500/20 disabled:opacity-60 dark:text-red-400 dark:border-red-500/50"
          >
            {isDeleting ? (locale === "ru" ? "Удаляю..." : "Deleting...") : (locale === "ru" ? "Удалить" : "Delete")}
          </button>
        </div>
      </form>
    </div>
  );
}
