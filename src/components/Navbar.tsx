import Link from "next/link";
import { auth, signOut } from "@/auth";
import { getLocale } from "@/i18n/getLocale";
import { getDictionary } from "@/i18n/dictionaries";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";

export async function Navbar() {
  const [session, locale] = await Promise.all([auth(), getLocale()]);
  const t = getDictionary(locale).nav;

  return (
    <header className="border-b border-black/10 dark:border-white/10">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          GameHub
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link href="/games" className="hover:underline">
            {t.catalog}
          </Link>

          {session?.user ? (
            <>
              <Link href="/library" className="hover:underline">
                {t.library}
              </Link>
              <Link href="/profile" className="hover:underline">
                {t.profile}
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button type="submit" className="hover:underline">
                  {t.logout}
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">
                {t.login}
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-foreground px-3 py-1.5 text-background hover:opacity-90"
              >
                {t.register}
              </Link>
            </>
          )}

          <LocaleSwitcher locale={locale} />
        </div>
      </nav>
    </header>
  );
}
