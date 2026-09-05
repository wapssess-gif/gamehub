import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getRawgGame, type RawgGame } from "@/lib/rawg";
import { getLocale } from "@/i18n/getLocale";
import { getDictionary } from "@/i18n/dictionaries";
import { GameLibraryCard, type UserGameDetailView } from "@/components/GameLibraryCard";
import { translateText } from "@/lib/translate";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const dbGame = await prisma.game.findFirst({
    where: { OR: [{ id }, { externalId: id }] },
    select: { title: true, summary: true },
  });

  if (dbGame) {
    return {
      title: `${dbGame.title} | GameHub`,
      description: dbGame.summary?.slice(0, 160) ?? "Game information and library tracking",
    };
  }

  try {
    const rawg = await getRawgGame(id);
    return {
      title: `${rawg.name} | GameHub`,
      description: rawg.description_raw?.slice(0, 160) ?? "Game information and library tracking",
    };
  } catch {
    return { title: "Game Details | GameHub" };
  }
}

export default async function GameDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [session, locale] = await Promise.all([auth(), getLocale()]);
  const dict = getDictionary(locale);
  const t = dict.gameDetails;

  const dbGame = await prisma.game.findFirst({
    where: {
      OR: [{ id }, { externalId: id }],
    },
    include: {
      library: session?.user?.id
        ? {
            where: { userId: session.user.id },
          }
        : false,
    },
  });

  const externalId = dbGame?.externalId ?? id;

  let rawgGame: RawgGame | null = null;
  try {
    rawgGame = await getRawgGame(externalId);
  } catch (error) {
    console.warn(`Could not load RAWG details for externalId=${externalId}:`, error);
  }

  if (!dbGame && !rawgGame) {
    notFound();
  }

  const title = rawgGame?.name ?? dbGame?.title ?? t.unknown;
  const coverUrl = rawgGame?.background_image ?? dbGame?.coverUrl;
  const bannerUrl = rawgGame?.background_image_additional ?? rawgGame?.background_image ?? dbGame?.coverUrl;
  const releaseDate = rawgGame?.released ?? (dbGame?.releaseDate ? dbGame.releaseDate.toISOString().split("T")[0] : null);
  const genres = rawgGame?.genres?.map((g) => g.name) ?? dbGame?.genres ?? [];
  const platforms = rawgGame?.platforms?.map((p) => p.platform.name) ?? dbGame?.platforms ?? [];
  const developers = rawgGame?.developers?.map((d) => d.name) ?? [];
  const publishers = rawgGame?.publishers?.map((p) => p.name) ?? [];
  const metacritic = rawgGame?.metacritic ?? null;
  const rating = rawgGame?.rating ?? null;
  const ratingsCount = rawgGame?.ratings_count ?? null;
  const playtime = rawgGame?.playtime ?? null;
  const website = rawgGame?.website ?? null;
  const esrbRating = rawgGame?.esrb_rating?.name ?? null;
  const rawSummary = rawgGame?.description_raw ?? dbGame?.summary ?? null;
  const summary = await translateText(rawSummary, locale);

  const userGameRow = dbGame?.library && dbGame.library.length > 0 ? dbGame.library[0] : null;

  const userGame: UserGameDetailView | null = userGameRow
    ? {
        id: userGameRow.id,
        status: userGameRow.status,
        progressPercent: userGameRow.progressPercent,
        hoursPlayed: userGameRow.hoursPlayed ? Number(userGameRow.hoursPlayed) : null,
        rating: userGameRow.rating,
        notes: userGameRow.notes,
        startedAt: userGameRow.startedAt ? userGameRow.startedAt.toISOString() : null,
        finishedAt: userGameRow.finishedAt ? userGameRow.finishedAt.toISOString() : null,
        createdAt: userGameRow.createdAt.toISOString(),
      }
    : null;

  function getMetacriticColor(score: number) {
    if (score >= 75) return "bg-green-600 text-white";
    if (score >= 50) return "bg-yellow-500 text-black";
    return "bg-red-600 text-white";
  }

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Breadcrumb navigation */}
      <nav className="flex items-center gap-4 text-sm text-black/60 dark:text-white/60">
        <Link
          href="/library"
          className="hover:text-foreground transition-colors inline-flex items-center gap-1"
        >
          {t.backToLibrary}
        </Link>
        <span>/</span>
        <Link
          href="/games"
          className="hover:text-foreground transition-colors inline-flex items-center gap-1"
        >
          {t.backToCatalog}
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02]">
        {bannerUrl && (
          <div className="absolute inset-0 z-0 opacity-15 dark:opacity-20 pointer-events-none">
            <Image
              src={bannerUrl}
              alt=""
              fill
              priority
              className="object-cover blur-xs"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </div>
        )}

        <div className="relative z-10 flex flex-col gap-6 p-6 sm:flex-row sm:items-start sm:p-8">
          {coverUrl && (
            <div className="shrink-0 overflow-hidden rounded-xl border border-black/10 dark:border-white/10 shadow-lg">
              <Image
                src={coverUrl}
                alt={title}
                width={220}
                height={300}
                priority
                className="h-64 w-48 object-cover sm:h-72 sm:w-52"
              />
            </div>
          )}

          <div className="flex flex-1 flex-col gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
              {releaseDate && (
                <p className="mt-1 text-sm text-black/60 dark:text-white/60">
                  {t.releaseDate}: {releaseDate}
                </p>
              )}
            </div>

            {/* Badges / Rating summary */}
            <div className="flex flex-wrap items-center gap-3">
              {metacritic !== null && (
                <div
                  className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-bold ${getMetacriticColor(
                    metacritic
                  )}`}
                  title="Metacritic Score"
                >
                  <span>Metacritic</span>
                  <span className="text-sm">{metacritic}</span>
                </div>
              )}

              {rating !== null && rating > 0 && (
                <div className="inline-flex items-center gap-1 rounded-md border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-2.5 py-1 text-xs font-medium">
                  <span className="text-yellow-500">★</span>
                  <span>{rating} / 5</span>
                  {ratingsCount ? (
                    <span className="text-black/50 dark:text-white/50">({ratingsCount})</span>
                  ) : null}
                </div>
              )}

              {playtime !== null && playtime > 0 && (
                <div className="inline-flex items-center gap-1 rounded-md border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-2.5 py-1 text-xs font-medium text-black/70 dark:text-white/70">
                  <span>⏱ {playtime} {t.hours}</span>
                </div>
              )}

              {esrbRating && (
                <div className="inline-flex items-center rounded-md border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-2.5 py-1 text-xs font-medium text-black/70 dark:text-white/70">
                  <span>ESRB: {esrbRating}</span>
                </div>
              )}
            </div>

            {/* Genres */}
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {genres.map((g) => (
                  <span
                    key={g}
                    className="rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3 py-0.5 text-xs font-medium"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}

            {/* Platforms */}
            {platforms.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-black/60 dark:text-white/60">
                <span className="font-medium text-foreground">{t.platforms}:</span>
                <span>{platforms.join(" · ")}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* User Library Management Card */}
      <section>
        <GameLibraryCard
          externalId={externalId}
          userGame={userGame}
          isLoggedIn={Boolean(session?.user)}
          t={{
            ...t,
            status: dict.status,
            removeConfirm: dict.library.removeConfirm.replace("{title}", title),
            remove: dict.library.remove,
          }}
        />
      </section>

      {/* Main Content Grid: About + Information Sidebar */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* About Section */}
        <section className="flex flex-col gap-4 lg:col-span-2">
          <h2 className="text-xl font-semibold">{t.about}</h2>
          {summary ? (
            <div className="whitespace-pre-line text-sm leading-relaxed text-black/80 dark:text-white/80 space-y-4">
              {summary}
            </div>
          ) : (
            <p className="text-sm text-black/50 dark:text-white/50">{t.unknown}</p>
          )}

          {/* Additional Screenshot */}
          {rawgGame?.background_image_additional && (
            <div className="mt-4 flex flex-col gap-2">
              <h3 className="text-sm font-medium text-black/60 dark:text-white/60">
                Скриншот
              </h3>
              <div className="overflow-hidden rounded-xl border border-black/10 dark:border-white/10">
                <Image
                  src={rawgGame.background_image_additional}
                  alt={`${title} screenshot`}
                  width={720}
                  height={400}
                  className="h-auto w-full object-cover"
                />
              </div>
            </div>
          )}
        </section>

        {/* Information Sidebar */}
        <aside className="flex flex-col gap-4">
          <div className="rounded-xl border border-black/10 bg-black/[0.02] p-5 dark:border-white/10 dark:bg-white/[0.02]">
            <h2 className="mb-4 text-base font-semibold">{t.info}</h2>

            <dl className="flex flex-col gap-3.5 text-sm">
              {releaseDate && (
                <div>
                  <dt className="text-xs text-black/50 dark:text-white/50">{t.releaseDate}</dt>
                  <dd className="font-medium mt-0.5">{releaseDate}</dd>
                </div>
              )}

              {developers.length > 0 && (
                <div>
                  <dt className="text-xs text-black/50 dark:text-white/50">{t.developers}</dt>
                  <dd className="font-medium mt-0.5">{developers.join(", ")}</dd>
                </div>
              )}

              {publishers.length > 0 && (
                <div>
                  <dt className="text-xs text-black/50 dark:text-white/50">{t.publishers}</dt>
                  <dd className="font-medium mt-0.5">{publishers.join(", ")}</dd>
                </div>
              )}

              {genres.length > 0 && (
                <div>
                  <dt className="text-xs text-black/50 dark:text-white/50">{t.genres}</dt>
                  <dd className="font-medium mt-0.5">{genres.join(", ")}</dd>
                </div>
              )}

              {platforms.length > 0 && (
                <div>
                  <dt className="text-xs text-black/50 dark:text-white/50">{t.platforms}</dt>
                  <dd className="font-medium mt-0.5">{platforms.join(", ")}</dd>
                </div>
              )}

              {playtime !== null && playtime > 0 && (
                <div>
                  <dt className="text-xs text-black/50 dark:text-white/50">{t.averagePlaytime}</dt>
                  <dd className="font-medium mt-0.5">{playtime} {t.hours}</dd>
                </div>
              )}

              {website && (
                <div>
                  <dt className="text-xs text-black/50 dark:text-white/50">{t.website}</dt>
                  <dd className="font-medium mt-0.5">
                    <a
                      href={website}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-blue-500 hover:underline inline-flex items-center gap-1 break-all"
                    >
                      <span>{website}</span>
                      <span className="text-xs">↗</span>
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}
