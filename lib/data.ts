import { api } from "@/lib/api";
import type { Episode, Title, UserTitle, UserTitleWithTitle } from "@/lib/services/types";

export type DiscoverSection = { title: string; items: Title[] };
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
};

export type TitleDetail = Title & { episodes: Episode[] };
export type MyTitle = { tracked: boolean; userTitle?: UserTitle; watched: string[] };

export type LibraryQuery = { type?: "show" | "movie"; status?: string; limit?: number; offset?: number };
export type LibraryPage = { items: UserTitleWithTitle[]; total: number; limit: number; offset: number };

function libraryPath({ type, status, limit, offset }: LibraryQuery = {}): string {
  const p = new URLSearchParams();
  if (type) p.set("type", type);
  if (status) p.set("status", status);
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

export async function getSettings(): Promise<Settings> {
  return api<Settings>("/v1/me/settings");
}

export async function searchTitles(query: string): Promise<Title[]> {
  const res = await api<{ results: Title[] }>(`/v1/titles/search?q=${encodeURIComponent(query)}`);
  return res.results ?? [];
}

export async function getTitleDetail(id: string): Promise<TitleDetail | null> {
  try {
    return await api<TitleDetail>(`/v1/titles/${id}`);
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
