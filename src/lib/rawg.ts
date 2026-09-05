const RAWG_BASE_URL = "https://api.rawg.io/api";

export type RawgGame = {
  id: number;
  name: string;
  background_image: string | null;
  background_image_additional?: string | null;
  released: string | null;
  genres?: { id?: number; name: string }[];
  platforms?: { platform: { id?: number; name: string } }[] | null;
  description_raw?: string;
  description?: string;
  metacritic?: number | null;
  metacritic_url?: string | null;
  website?: string | null;
  rating?: number | null;
  rating_top?: number | null;
  ratings_count?: number | null;
  playtime?: number | null;
  developers?: { id: number; name: string }[];
  publishers?: { id: number; name: string }[];
  esrb_rating?: { id: number; name: string } | null;
};

export type RawgTaxonomy = { id: number; name: string; slug: string };

function apiKey(): string {
  const key = process.env.RAWG_API_KEY;
  if (!key) throw new Error("RAWG_API_KEY не задан в переменных окружения");
  return key;
}

async function rawgFetch<T>(path: string, params: Record<string, string | undefined>, revalidate: number): Promise<T> {
  const search = new URLSearchParams({ key: apiKey() });
  for (const [k, v] of Object.entries(params)) {
    if (v) search.set(k, v);
  }

  const res = await fetch(`${RAWG_BASE_URL}${path}?${search.toString()}`, {
    next: { revalidate },
  });
  if (!res.ok) {
    throw new Error(`RAWG API error ${res.status} on ${path}`);
  }
  return res.json() as Promise<T>;
}

export async function searchRawgGames(opts: {
  search?: string;
  genres?: string;
  platforms?: string;
  page?: number;
}): Promise<RawgGame[]> {
  const data = await rawgFetch<{ results: RawgGame[] }>(
    "/games",
    {
      search: opts.search,
      genres: opts.genres,
      platforms: opts.platforms,
      page: opts.page ? String(opts.page) : undefined,
      page_size: "20",
      ordering: opts.search ? undefined : "-rating",
    },
    3600,
  );
  return data.results;
}

export async function getRawgGame(externalId: string): Promise<RawgGame> {
  return rawgFetch<RawgGame>(`/games/${externalId}`, {}, 3600);
}

export async function listRawgGenres(): Promise<RawgTaxonomy[]> {
  const data = await rawgFetch<{ results: RawgTaxonomy[] }>("/genres", {}, 86400);
  return data.results;
}

export async function listRawgPlatforms(): Promise<RawgTaxonomy[]> {
  const data = await rawgFetch<{ results: RawgTaxonomy[] }>("/platforms", {}, 86400);
  return data.results;
}
