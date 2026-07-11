import { api } from "@/lib/api";
import type { CastMember, Episode, Title, UserTitle, UserTitleWithTitle, WatchProvider } from "@/lib/services/types";

export type DiscoverSection = { title: string; kind: string; items: Title[] };
export type CollectionPage = { title: string; items: Title[]; page: number; hasMore: boolean };

export async function getCollection(kind: string, page = 1): Promise<CollectionPage> {
  const res = await api<CollectionPage>(`/v1/titles/collection?kind=${encodeURIComponent(kind)}&page=${page}`);
  return { title: res.title ?? "", items: res.items ?? [], page: res.page ?? page, hasMore: Boolean(res.hasMore) };
}
export type CalendarEpisode = Episode & { title: Title | null };
export type Calendar = { today: CalendarEpisode[]; thisWeek: CalendarEpisode[]; later: CalendarEpisode[] };

export type Stats = {
  episodesWatched: number;
  moviesWatched: number;
  showsWatched: number;
  completedTitles: number;
  favorites: number;
  tvTimeMinutes: number;
  movieTimeMinutes: number;
};

export type Settings = {
  theme: string;
  titlesInLanguage: boolean;
  privateProfile: boolean;
  newEpisodeAlerts: boolean;
  premiereReminders: boolean;
  weeklyDigest: boolean;
  watchRegion: string;
};

export type TitleDetail = Title & {
  episodes: Episode[];
  cast: CastMember[];
  watchRegion: string;
  watchProviders: WatchProvider[];
  watchProviderLink?: string;
  watchProviderAttribution: string;
};
export type MyTitle = { tracked: boolean; userTitle?: UserTitle; watched: string[] };

export type LibraryQuery = { type?: "show" | "movie"; status?: string; favorite?: boolean; limit?: number; offset?: number };
export type LibraryPage = { items: UserTitleWithTitle[]; total: number; limit: number; offset: number };
export type UserList = {
  id: string;
  userId: string;
  name: string;
  description?: string;
  isPublic: boolean;
  importedFrom?: string | null;
  externalId?: string | null;
  itemCount?: number;
  createdAt: string;
  updatedAt: string;
};
export type UserListItem = {
  id: string;
  listId: string;
  titleId: string;
  position: number;
  title: Title;
};
export type UserListDetail = UserList & { items: UserListItem[] };

function libraryPath({ type, status, favorite, limit, offset }: LibraryQuery = {}): string {
  const p = new URLSearchParams();
  if (type) p.set("type", type);
  if (status) p.set("status", status);
  if (favorite) p.set("favorite", "true");
  if (limit != null) p.set("limit", String(limit));
  if (offset != null) p.set("offset", String(offset));
  const qs = p.toString();
  return `/v1/me/library${qs ? `?${qs}` : ""}`;
}

export async function getLibraryPage(q: LibraryQuery = {}): Promise<LibraryPage> {
  const res = await api<LibraryPage>(libraryPath(q));
  return { items: res.items ?? [], total: res.total ?? 0, limit: res.limit ?? 0, offset: res.offset ?? 0 };
}

export async function getLibrary(q: LibraryQuery = {}): Promise<UserTitleWithTitle[]> {
  return (await getLibraryPage(q)).items;
}

export async function getLists(): Promise<UserList[]> {
  const res = await api<{ lists: UserList[] }>("/v1/me/lists");
  return res.lists ?? [];
}

export async function getList(id: string): Promise<UserListDetail | null> {
  try {
    return await api<UserListDetail>(`/v1/me/lists/${id}`);
  } catch {
    return null;
  }
}

export async function getCalendar(): Promise<Calendar> {
  return api<Calendar>("/v1/me/calendar");
}

export async function getDiscover(): Promise<DiscoverSection[]> {
  const res = await api<{ sections: DiscoverSection[] }>("/v1/titles/discover");
  return res.sections ?? [];
}

export async function getStats(): Promise<Stats> {
  return api<Stats>("/v1/me/stats");
}

export type CatalogStatus = {
  tmdbConfigured: boolean;
  titles: number;
  episodes: number;
  lastUpdatedAt: string | null;
};

export async function getCatalogStatus(): Promise<CatalogStatus | null> {
  try {
    return await api<CatalogStatus>("/v1/catalog/status");
  } catch {
    return null;
  }
}

export async function getSettings(): Promise<Settings> {
  return api<Settings>("/v1/me/settings");
}

export async function searchTitles(query: string): Promise<Title[]> {
  const res = await api<{ results: Title[] }>(`/v1/titles/search?q=${encodeURIComponent(query)}`);
  return res.results ?? [];
}

export async function getTitleDetail(id: string, region = "US"): Promise<TitleDetail | null> {
  try {
    return await api<TitleDetail>(`/v1/titles/${id}?region=${encodeURIComponent(region)}`);
  } catch {
    return null;
  }
}

export type ImportRecord = {
  id: string;
  status: "processing" | "completed" | "failed";
  totalTitles: number;
  matchedTitles: number;
  unmatchedTitles: number;
  watchedEpisodes: number;
  importedLists: number;
  importedListItems: number;
  unmatchedListItems: number;
  errorMessage?: string;
};

export async function getImport(id: string): Promise<ImportRecord | null> {
  try {
    return await api<ImportRecord>(`/v1/me/import/${id}`);
  } catch {
    return null;
  }
}

export async function getMyTitle(id: string): Promise<MyTitle> {
  try {
    return await api<MyTitle>(`/v1/me/titles/${id}`);
  } catch {
    return { tracked: false, watched: [] };
  }
}
