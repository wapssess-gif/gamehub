import Link from "next/link";
import { auth } from "@/auth";
import { getLocale } from "@/i18n/getLocale";
import { getDictionary } from "@/i18n/dictionaries";

export default async function HomePage() {
  const [session, locale] = await Promise.all([auth(), getLocale()]);
  const t = getDictionary(locale).home;

  return (
    <div className="flex flex-col items-center gap-6 py-16 text-center">
      <h1 className="text-4xl font-bold tracking-tight">GameHub</h1>
      <p className="max-w-xl text-balance text-black/70 dark:text-white/70">{t.subtitle}</p>

      <div className="flex gap-3">
        {session?.user ? (
          <Link
            href="/library"
            className="rounded-md bg-foreground px-4 py-2 text-background hover:opacity-90"
          >
            {t.myLibrary}
          </Link>
        ) : (
          <>
            <Link
              href="/register"
              className="rounded-md bg-foreground px-4 py-2 text-background hover:opacity-90"
            >
              {t.start}
            </Link>
            <Link
              href="/games"
              className="rounded-md border border-black/20 px-4 py-2 hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
            >
              {t.browseCatalog}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
