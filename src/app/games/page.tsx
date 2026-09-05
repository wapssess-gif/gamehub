import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { listRawgGenres, listRawgPlatforms, searchRawgGames } from "@/lib/rawg";
import { addGameToLibrary } from "@/lib/actions/library";
import { getLocale } from "@/i18n/getLocale";
import { getDictionary } from "@/i18n/dictionaries";

export default async function GamesCatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; genre?: string; platform?: string }>;
}) {
  const params = await searchParams;
  const [session, locale] = await Promise.all([auth(), getLocale()]);
  const t = getDictionary(locale).games;

  let genres: Awaited<ReturnType<typeof listRawgGenres>> = [];
  let platforms: Awaited<ReturnType<typeof listRawgPlatforms>> = [];
  let results: Awaited<ReturnType<typeof searchRawgGames>> = [];
  let catalogError: string | null = null;

  try {
    [genres, platforms, results] = await Promise.all([
      listRawgGenres(),
      listRawgPlatforms(),
      searchRawgGames({ search: params.q, genres: params.genre, platforms: params.platform }),
    ]);
  } catch (error) {
    console.error(error);
    catalogError = t.unavailable;
  }

  const inLibraryIds = session?.user
    ? await prisma.userGame
        .findMany({
          where: { userId: session.user.id, game: { externalSource: "RAWG" } },
          select: { game: { select: { externalId: true } } },
        })
        .then((rows) => new Set(rows.map((r) => r.game.externalId)))
    : new Set<string>();

  if (catalogError) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">{t.title}</h1>
        <p className="text-red-500">{catalogError}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">{t.title}</h1>

      <form className="flex flex-wrap gap-3" method="get">
        <input
          name="q"
          defaultValue={params.q}
          placeholder={t.searchPlaceholder}
          className="min-w-48 flex-1 rounded-md border border-black/20 bg-transparent px-3 py-2 dark:border-white/20"
        />
        <select
          name="genre"
          defaultValue={params.genre ?? ""}
          className="rounded-md border border-black/20 bg-transparent px-3 py-2 dark:border-white/20"
        >
          <option value="">{t.allGenres}</option>
          {genres.map((g) => (
            <option key={g.id} value={g.slug}>
              {g.name}
            </option>
          ))}
        </select>
        <select
          name="platform"
          defaultValue={params.platform ?? ""}
          className="rounded-md border border-black/20 bg-transparent px-3 py-2 dark:border-white/20"
        >
          <option value="">{t.allPlatforms}</option>
          {platforms.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-md bg-foreground px-4 py-2 text-background hover:opacity-90"
        >
          {t.apply}
        </button>
      </form>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((game) => {
          const externalId = String(game.id);
          const owned = inLibraryIds.has(externalId);
          return (
            <li
              key={externalId}
              className="flex flex-col gap-2 rounded-md border border-black/10 p-3 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 transition-colors"
            >
              {game.background_image && (
                <Link href={`/games/${externalId}`} className="group overflow-hidden rounded">
                  <Image
                    src={game.background_image}
                    alt={game.name}
                    width={320}
                    height={180}
                    className="h-40 w-full rounded object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                </Link>
              )}
              <Link href={`/games/${externalId}`} className="font-medium hover:underline flex items-center justify-between">
                <span>{game.name}</span>
                <span className="text-xs text-black/40 dark:text-white/40">→</span>
              </Link>
              <p className="text-xs text-black/60 dark:text-white/60">
                {game.released ?? t.unknownDate} ·{" "}
                {game.genres?.map((g) => g.name).join(", ") || t.unknownGenre}
              </p>

              {session?.user ? (
                owned ? (
                  <span className="mt-auto text-sm text-green-600">{t.inLibrary}</span>
                ) : (
                  <form action={addGameToLibrary.bind(null, externalId)} className="mt-auto">
                    <button
                      type="submit"
                      className="w-full rounded-md bg-foreground px-3 py-1.5 text-sm text-background hover:opacity-90"
                    >
                      {t.addToLibrary}
                    </button>
                  </form>
                )
              ) : (
                <p className="mt-auto text-xs text-black/50 dark:text-white/50">{t.loginToAdd}</p>
              )}
            </li>
          );
        })}

        {results.length === 0 && <p className="text-black/60 dark:text-white/60">{t.noResults}</p>}
      </ul>
    </div>
  );
}
