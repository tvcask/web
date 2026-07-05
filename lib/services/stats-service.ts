import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { watchedEpisodes as watchedEpisodesTable } from "@/db/schema";
import { getUserList } from "@/lib/services/tracking-service";

export async function getStats(userId: string) {
  const list = await getUserList(userId);
  const [watched] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(watchedEpisodesTable)
    .where(eq(watchedEpisodesTable.userId, userId));
  const episodesWatched = watched?.count ?? 0;
  const moviesWatched = list.filter((item) => item.title.type === "movie").length;

  const genres = new Map<string, number>();
  list.forEach((item) => item.title.genres.forEach((genre) => genres.set(genre, (genres.get(genre) ?? 0) + 1)));

  return {
    titlesImported: list.filter((item) => item.importedFrom).length,
    showsWatched: list.filter((item) => item.title.type === "tv" || item.title.type === "anime").length,
    moviesWatched,
    episodesWatched,
    completedTitles: list.filter((item) => item.status === "completed").length,
    favorites: list.filter((item) => item.favorite).length,
    estimatedWatchTimeMinutes: episodesWatched * 42 + moviesWatched * 110,
    mostWatchedGenres: [...genres.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6)
  };
}
