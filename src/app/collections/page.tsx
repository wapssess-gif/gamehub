import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserCollections } from "@/lib/actions/collections";
import { getLocale } from "@/i18n/getLocale";
import { getDictionary } from "@/i18n/dictionaries";

export default async function CollectionsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const collections = await getUserCollections(session.user.id);
  const locale = await getLocale();
  const t = getDictionary(locale);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {t.collections.myCollections}
        </h1>
        <Link
          href="/collections/new"
          className="rounded-md bg-white px-4 py-2 text-black font-medium transition-all hover:bg-red-900 hover:text-white active:bg-red-950"
        >
          {t.collections.create}
        </Link>
      </div>

      {collections.length === 0 ? (
        <div className="rounded-lg border border-black/10 bg-black/[0.02] p-8 text-center dark:border-white/10 dark:bg-white/[0.02]">
          <p className="text-black/70 dark:text-white/60 mb-4">
            {t.collections.empty}
          </p>
          <Link
            href="/collections/new"
            className="inline-block rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-all hover:bg-red-900 hover:text-white active:bg-red-950"
          >
            {t.collections.createFirst}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.id}`}
              className="group rounded-lg border border-black/10 bg-black/[0.02] p-4 transition-all hover:border-red-900 hover:bg-black/[0.05] dark:border-white/10 dark:bg-white/[0.02] dark:hover:border-red-900 dark:hover:bg-white/[0.05]"
            >
              <h3 className="font-semibold text-black dark:text-white hover:text-red-500">
                {collection.name}
              </h3>
              {collection.description && (
                <p className="mt-1 text-sm text-black/70 dark:text-white/60 line-clamp-2">
                  {collection.description}
                </p>
              )}
              <p className="mt-2 text-xs text-black/70 dark:text-white/50">
                {collection._count.items}{" "}
                {locale === "ru" ? "игр" : collection._count.items === 1 ? "game" : "games"}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
