import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { searchRawgGames } from "@/lib/rawg";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
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
    return NextResponse.json({ error: "Не удалось выполнить поиск" }, { status: 502 });
  }
}
