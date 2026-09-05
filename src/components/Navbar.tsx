import Link from "next/link";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getLocale } from "@/i18n/getLocale";
import { getDictionary } from "@/i18n/dictionaries";
import { Avatar } from "@/components/Avatar";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";

export async function Navbar() {
  const [session, locale] = await Promise.all([auth(), getLocale()]);
  const t = getDictionary(locale).nav;

  const profile = session?.user?.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          username: true,
          avatarUrl: true,
          _count: {
            select: { receivedFriendRequests: { where: { status: "PENDING" } } },
          },
        },
      })
    : null;

  const pendingRequests = profile?._count.receivedFriendRequests ?? 0;

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
              <Link href="/users" className="hover:underline">
                {t.people}
              </Link>
              <Link href="/friends" className="inline-flex items-center gap-1 hover:underline">
                {t.friends}
                {pendingRequests > 0 && (
                  <span className="rounded-full bg-foreground px-1.5 text-xs font-medium text-background">
                    {pendingRequests}
                  </span>
                )}
              </Link>
              <Link
                href="/profile"
                className="inline-flex items-center gap-1.5 hover:underline"
              >
                <Avatar
                  src={profile?.avatarUrl}
                  name={profile?.username ?? session.user.name ?? "?"}
                  size={22}
                />
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

          <ThemeToggle />
          <LocaleSwitcher locale={locale} />
        </div>
      </nav>
    </header>
  );
}
