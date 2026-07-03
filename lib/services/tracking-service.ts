import { getEpisodesForTitle, getTitle } from "@/lib/services/metadata-service";
import { createId, store, upsertTitle } from "@/lib/services/store";
import type { Title, UserTitleStatus, UserTitleWithTitle } from "@/lib/services/types";

export function getUserList(userId: string): UserTitleWithTitle[] {
  return store.userTitles
    .filter((entry) => entry.userId === userId)
    .map((entry) => {
      const title = getTitle(entry.titleId);
      if (!title) {
        return null;
      }
      return {
        ...entry,
        title,
        episodeCount: getEpisodesForTitle(title.id).length
      };
    })
    .filter(Boolean) as UserTitleWithTitle[];
}

export function addTitleToUser(userId: string, title: Title, status: UserTitleStatus, favorite = false) {
  const storedTitle = upsertTitle(title);
  const existing = store.userTitles.find((entry) => entry.userId === userId && entry.titleId === storedTitle.id);
  if (existing) {
    existing.status = status;
    existing.favorite = existing.favorite || favorite;
    return existing;
  }

  const userTitle = {
    id: createId("ut"),
    userId,
    titleId: storedTitle.id,
    status,
    favorite,
    currentSeason: null,
    currentEpisode: null,
    rating: null,
    importedFrom: null,
    importedExternalId: null
  };
  store.userTitles.push(userTitle);
  return userTitle;
}

export function updateUserTitle(userId: string, userTitleId: string, input: Partial<Pick<UserTitleWithTitle, "status" | "favorite" | "rating">>) {
  const userTitle = store.userTitles.find((entry) => entry.userId === userId && entry.id === userTitleId);
  if (!userTitle) {
    throw new Error("Tracked title not found.");
  }
  Object.assign(userTitle, input);
  return userTitle;
}

export function markNextEpisodeWatched(userId: string, userTitleId: string) {
  const userTitle = store.userTitles.find((entry) => entry.userId === userId && entry.id === userTitleId);
  if (!userTitle) {
    throw new Error("Tracked title not found.");
  }

  const nextSeason = userTitle.currentSeason ?? 1;
  const nextEpisode = (userTitle.currentEpisode ?? 0) + 1;
  userTitle.currentSeason = nextSeason;
  userTitle.currentEpisode = nextEpisode;
  userTitle.status = "watching";
  store.watchedEpisodes.push({
    id: createId("we"),
    userId,
    titleId: userTitle.titleId,
    seasonNumber: nextSeason,
    episodeNumber: nextEpisode,
    watchedAt: new Date().toISOString()
  });
  return userTitle;
}
