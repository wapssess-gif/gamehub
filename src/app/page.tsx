import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getLocale } from "@/i18n/getLocale";
import { getDictionary } from "@/i18n/dictionaries";

export default async function HomePage() {
  const [session, locale, games, latestGames] = await Promise.all([
    auth(),
    getLocale(),
    prisma.game.findMany({
      take: 6,
    }),
    prisma.game.findMany({
      take: 6,
      orderBy: { cachedAt: "desc" },
    }),
  ]);
  const t = getDictionary(locale).home;

  return (
    <main className="flex flex-col gap-12 py-12">
      {/* Hero */}
      <section className="flex flex-col items-center gap-6 py-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">GameHub</h1>
        <p className="max-w-xl text-balance text-black/70 dark:text-white/70">{t.subtitle}</p>

        <div className="flex gap-3">
          {session?.user ? (
            <Link
              href="/library"
              className="rounded-md bg-white px-4 py-2 text-black font-medium transition-all duration-200 hover:bg-red-900 hover:text-white active:bg-red-950"
            >
              {t.myLibrary}
            </Link>
          ) : (
            <>
              <Link
                href="/register"
                className="rounded-md bg-white px-4 py-2 text-black font-medium transition-all duration-200 hover:bg-red-900 hover:text-white active:bg-red-950"
              >
                {t.start}
              </Link>
              <Link
                href="/games"
                className="rounded-md border border-white/30 px-4 py-2 text-white font-medium transition-all duration-200 hover:bg-red-900 hover:border-red-900 active:bg-red-950"
              >
                {t.browseCatalog}
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Popular Games */}
      <section className="mx-auto w-full max-w-5xl px-4">
        <h2 className="mb-8 text-2xl font-bold">{t.popularGames}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <Link
              key={game.id}
              href={`/games/${game.id}`}
              className="group overflow-hidden rounded-lg border border-white/10 bg-black/40 transition-all hover:border-red-900 hover:bg-black/60"
            >
              {game.coverUrl && (
                <img
                  src={game.coverUrl}
                  alt={game.title}
                  className="h-40 w-full object-cover"
                />
              )}
              <div className="p-3">
                <h3 className="font-semibold line-clamp-1 group-hover:text-red-400">{game.title}</h3>
                <p className="text-xs text-white/60">{game.releaseDate?.getFullYear()}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Additions */}
      {latestGames.length > 0 && (
        <section className="mx-auto w-full max-w-5xl px-4">
          <h2 className="mb-8 text-2xl font-bold">{t.latestAdditions}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {latestGames.map((game) => (
              <Link
                key={game.id}
                href={`/games/${game.id}`}
                className="group overflow-hidden rounded-lg border border-white/10 bg-black/40 transition-all hover:border-red-900 hover:bg-black/60"
              >
                {game.backgroundImage && (
                  <img
                    src={game.backgroundImage}
                    alt={game.title}
                    className="h-40 w-full object-cover"
                  />
                )}
                <div className="p-3">
                  <h3 className="font-semibold line-clamp-1 group-hover:text-red-400">{game.title}</h3>
                  <p className="text-xs text-white/60">{game.releaseDate?.getFullYear()}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Features */}
      <section className="mx-auto w-full max-w-5xl px-4">
        <h2 className="mb-8 text-2xl font-bold">{t.whyGamehub}</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: "📚", title: "Game Library", desc: "Track all your games in one place" },
            { icon: "📊", title: "Statistics", desc: "Hours played, ratings, favorite genres" },
            { icon: "👥", title: "Social", desc: "Find friends and follow their progress" },
            { icon: "🎯", title: "Progress", desc: "Mark completion % and playtime" },
            { icon: "🌍", title: "Discover", desc: "Browse 800k+ games from RAWG" },
            { icon: "🎨", title: "Minimal Design", desc: "Clean interface, no clutter" },
          ].map((feature, i) => (
            <div key={i} className="rounded-lg border border-white/10 bg-black/40 p-4">
              <div className="mb-2 text-3xl">{feature.icon}</div>
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="text-sm text-white/60">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      {!session?.user && (
        <section className="mx-auto w-full max-w-5xl px-4 text-center">
          <div className="rounded-lg border border-red-900/50 bg-gradient-to-r from-red-900/10 to-transparent p-8">
            <h2 className="mb-2 text-2xl font-bold">{t.readyToStart}</h2>
            <p className="mb-6 text-white/70">{t.readyToStartDesc}</p>
            <Link
              href="/register"
              className="inline-block rounded-md bg-red-900 px-6 py-3 text-white font-medium transition-all hover:bg-red-800"
            >
              {t.createAccount}
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
