import { nanoid } from "nanoid";
import type { Episode, ImportRecord, Title, UserTitle } from "@/lib/services/types";

type Store = {
  titles: Title[];
  episodes: Episode[];
  userTitles: UserTitle[];
  watchedEpisodes: {
    id: string;
    userId: string;
    titleId: string;
    seasonNumber: number;
    episodeNumber: number;
    watchedAt?: string | null;
    importedFrom?: string | null;
  }[];
  imports: ImportRecord[];
};

const globalForStore = globalThis as typeof globalThis & { tvcaskStore?: Store };

export const store: Store =
  globalForStore.tvcaskStore ??
  (globalForStore.tvcaskStore = {
    titles: [],
    episodes: [],
    userTitles: [],
    watchedEpisodes: [],
    imports: []
  });

export function createId(prefix: string) {
  return `${prefix}_${nanoid(12)}`;
}

export function upsertTitle(title: Title) {
  const existing = store.titles.find(
    (item) =>
      item.id === title.id ||
      (title.externalId && item.externalId === title.externalId && item.externalSource === title.externalSource)
  );

  if (existing) {
    Object.assign(existing, title, { id: existing.id });
    return existing;
  }

  store.titles.push(title);
  return title;
}
