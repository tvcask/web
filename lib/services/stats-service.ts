import { getUserList } from "@/lib/services/tracking-service";
import { store } from "@/lib/services/store";

export function getStats(userId: string) {
  const list = getUserList(userId);
  const watched = store.watchedEpisodes.filter((episode) => episode.userId === userId);
  const genres = new Map<string, number>();
  list.forEach((item) => item.title.genres.forEach((genre) => genres.set(genre, (genres.get(genre) ?? 0) + 1)));

  return {
    titlesImported: list.filter((item) => item.importedFrom).length,
    showsWatched: list.filter((item) => item.title.type === "tv" || item.title.type === "anime").length,
    moviesWatched: list.filter((item) => item.title.type === "movie").length,
    episodesWatched: watched.length,
    completedTitles: list.filter((item) => item.status === "completed").length,
    favorites: list.filter((item) => item.favorite).length,
    estimatedWatchTimeMinutes: watched.length * 42 + list.filter((item) => item.title.type === "movie").length * 110,
    mostWatchedGenres: [...genres.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6)
  };
}
