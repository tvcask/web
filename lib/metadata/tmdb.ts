import { env } from "@/lib/env/env";
import type { Title } from "@/lib/services/types";

type TmdbSearchResult = {
  id: number;
  media_type?: string;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview?: string;
  poster_path?: string;
  backdrop_path?: string;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
};

const genreMap = new Map<number, string>([
  [12, "Adventure"],
  [14, "Fantasy"],
  [16, "Animation"],
  [18, "Drama"],
  [27, "Horror"],
  [28, "Action"],
  [35, "Comedy"],
  [36, "History"],
  [53, "Thriller"],
  [878, "Sci-Fi"],
  [9648, "Mystery"],
  [10749, "Romance"]
]);

function mapTmdbResult(item: TmdbSearchResult, fallbackType?: "movie" | "tv"): Title {
  const mediaType = item.media_type ?? fallbackType;
  const isMovie = mediaType === "movie";
  const date = isMovie ? item.release_date : item.first_air_date;
  return {
    id: `tmdb-${mediaType}-${item.id}`,
    externalId: String(item.id),
    externalSource: "tmdb",
    title: item.title ?? item.name ?? "Untitled",
    originalTitle: item.original_title ?? item.original_name ?? null,
    type: isMovie ? "movie" : "tv",
    category: isMovie ? "movie" : "tv_show",
    overview: item.overview ?? null,
    posterUrl: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
    backdropUrl: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : null,
    year: date ? Number(date.slice(0, 4)) : null,
    genres: (item.genre_ids ?? []).map((id) => genreMap.get(id)).filter(Boolean) as string[]
  };
}

async function fetchTmdbTitles(path: string, queryParams: Record<string, string> = {}, fallbackType?: "movie" | "tv") {
  if (!env.TMDB_API_KEY) {
    return [];
  }

  const params = new URLSearchParams({
    api_key: env.TMDB_API_KEY,
    include_adult: "false",
    ...queryParams
  });
  const response = await fetch(`https://api.themoviedb.org/3${path}?${params}`, {
    next: { revalidate: 60 * 60 }
  });

  if (!response.ok) {
    return [];
  }

  const payload = (await response.json()) as { results?: TmdbSearchResult[] };
  return (payload.results ?? [])
    .filter((item) => item.media_type === "movie" || item.media_type === "tv" || Boolean(fallbackType))
    .slice(0, 20)
    .map((item) => mapTmdbResult(item, fallbackType));
}

export async function searchTmdb(query: string): Promise<Title[]> {
  if (query.trim().length < 2) {
    return [];
  }
  return fetchTmdbTitles("/search/multi", { query });
}

export async function getTmdbCollection(kind: "trending-tv" | "trending-movies" | "top-tv" | "top-movies") {
  if (kind === "trending-tv") {
    return fetchTmdbTitles("/trending/tv/week", {}, "tv");
  }
  if (kind === "trending-movies") {
    return fetchTmdbTitles("/trending/movie/week", {}, "movie");
  }
  if (kind === "top-tv") {
    return fetchTmdbTitles("/discover/tv", { sort_by: "popularity.desc", vote_count_gte: "200" }, "tv");
  }
  return fetchTmdbTitles("/discover/movie", { sort_by: "popularity.desc", vote_count_gte: "300" }, "movie");
}
