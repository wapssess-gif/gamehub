import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getCollection } from "@/lib/actions/collections";
import { getLocale } from "@/i18n/getLocale";
import { getDictionary } from "@/i18n/dictionaries";
import { AddGameToCollectionButton } from "@/components/AddGameToCollectionButton";

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const locale = await getLocale();
  const t = getDictionary(locale);

  const collection = await getCollection(id);
  if (!collection) {
    notFound();
  }

  const isOwner = session?.user?.id === collection.userId;

  // Get user's library to show add games option
  const userLibrary = isOwner
    ? await prisma.userGame.findMany({
        where: { userId: session!.user!.id },
        include: { game: true },
      })
    : [];

  // Get games already in this collection
  const collectionGameIds = new Set(collection.items.map((i) => i.gameId));
  const availableGames = userLibrary.filter((ug) => !collectionGameIds.has(ug.gameId));

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{collection.name}</h1>
          {collection.description && (
            <p className="mt-2 text-white/70">
              {collection.description}
            </p>
          )}
          <p className="mt-2 text-sm text-white/50">
            {collection.items.length}{" "}
            {locale === "ru"
              ? "игр"
              : collection.items.length === 1
                ? "game"
                : "games"}
          </p>
        </div>

        {isOwner && (
          <div className="flex gap-2">
            {availableGames.length > 0 && (
              <AddGameToCollectionButton collectionId={id} userGames={availableGames} />
            )}
            <Link
              href={`/collections/${id}/edit`}
              className="rounded-md bg-white text-black px-4 py-2 font-medium transition-all hover:bg-red-900 hover:text-white active:bg-red-950"
            >
              {t.collections.edit}
            </Link>
          </div>
        )}
      </div>

      {collection.items.length === 0 ? (
        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-8 text-center">
          <p className="text-white/60 mb-4">
            {t.collections.noGames}
          </p>
          <Link
            href="/games"
            className="inline-block rounded-md bg-white text-black px-4 py-2 text-sm font-medium transition-all hover:bg-red-900 hover:text-white active:bg-red-950"
          >
            {t.collections.browseGames}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collection.items.map((item) => (
            <Link
              key={item.id}
              href={`/games/${item.game.id}`}
              className="group overflow-hidden rounded-lg border border-white/10 bg-white/[0.02] transition-all hover:border-red-900 hover:bg-white/[0.05]"
            >
              {item.game.coverUrl && (
                <img
                  src={item.game.coverUrl}
                  alt={item.game.title}
                  className="h-40 w-full object-cover"
                />
              )}
              <div className="p-3">
                <h3 className="font-semibold text-white group-hover:text-red-400">
                  {item.game.title}
                </h3>
                <p className="text-xs text-white/50 mt-1">
                  {item.game.releaseDate?.getFullYear() || t.games.unknownDate}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Link
          href="/collections"
          className="text-sm underline hover:text-red-600"
        >
          {t.collections.backToCollections}
        </Link>
      </div>
    </div>
  );
}
