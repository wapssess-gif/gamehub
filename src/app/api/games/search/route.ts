import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { searchRawgGames } from "@/lib/rawg";
import { getLocale } from "@/i18n/getLocale";
import { getDictionary } from "@/i18n/dictionaries";

export async function GET(request: NextRequest) {
  const [session, locale] = await Promise.all([auth(), getLocale()]);
  const t = getDictionary(locale);

  if (!session?.user) {
    return NextResponse.json({ error: t.auth.errors.notAuthorized }, { status: 401 });
  }

  const query = request.nextUrl.searchParams.get("q")?.trim();
  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchRawgGames({ search: query });
    return NextResponse.json({
      results: results.map((g) => ({
        externalId: String(g.id),
        title: g.name,
        coverUrl: g.background_image,
        releaseDate: g.released,
        genres: g.genres?.map((genre) => genre.name) ?? [],
      })),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: t.search.searchFailed }, { status: 502 });
  }
}
