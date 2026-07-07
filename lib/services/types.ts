export type TitleType = "movie" | "tv" | "anime";
export type TitleCategory = "movie" | "tv_show" | "anime" | "k_drama";
export type UserTitleStatus = "watching" | "watchlist" | "completed" | "dropped";
export type ImportStatus = "uploaded" | "parsing" | "parsed" | "needs_review" | "importing" | "completed" | "failed";
export type MatchStatus = "matched" | "unmatched" | "ignored" | "already_exists";

export type Title = {
  id: string;
  externalId?: string | null;
  externalSource?: string | null;
  title: string;
  originalTitle?: string | null;
  type: TitleType;
  category: TitleCategory;
  overview?: string | null;
  posterUrl?: string | null;
  backdropUrl?: string | null;
  year?: number | null;
  genres: string[];
};

export type Episode = {
  id: string;
  titleId: string;
  seasonNumber: number;
  episodeNumber: number;
  name?: string | null;
  overview?: string | null;
  airDate?: string | null;
  runtimeMinutes?: number | null;
  network?: string | null;
  stillUrl?: string | null;
};

export type UserTitle = {
  id: string;
  userId: string;
  titleId: string;
  status: UserTitleStatus;
  favorite: boolean;
  rating?: number | null;
  currentSeason?: number | null;
  currentEpisode?: number | null;
  importedFrom?: string | null;
  importedExternalId?: string | null;
};

export type UserTitleWithTitle = UserTitle & {
  title: Title;
  episodeCount: number;
};

export type UserCollectionKind = "custom" | "watchlist" | "favorites" | "completed" | "watching";

export type UserCollection = {
  id: string;
  userId: string;
  name: string;
  description?: string | null;
  kind: UserCollectionKind;
  titleIds: string[];
  importedFrom?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UserCollectionWithTitles = UserCollection & {
  items: UserTitleWithTitle[];
};

export type CalendarEpisode = Episode & {
  title: Title;
};

export type ParsedTitle = {
  sourceId?: string;
  title: string;
  originalTitle?: string;
  type?: "tv" | "movie" | "anime" | "unknown";
  year?: number;
  status?: UserTitleStatus | "unknown";
  favorite?: boolean;
  rating?: number;
  listNames?: string[];
};

export type ParsedEpisode = {
  title: string;
  seasonNumber?: number;
  episodeNumber?: number;
  watchedAt?: string;
};

export type ParsedImport = {
  source: "tv_time";
  titles: ParsedTitle[];
  episodes: ParsedEpisode[];
  ratings?: unknown[];
  favorites?: unknown[];
  rawMetadata: Record<string, unknown>;
};

export type ImportPreviewItem = {
  id: string;
  rawTitle: string;
  normalizedTitle: string;
  matchedTitleId?: string | null;
  matchStatus: MatchStatus;
  matchConfidence?: number | null;
  rawData: ParsedTitle;
};

export type ImportRecord = {
  id: string;
  userId: string;
  source: "tv_time";
  originalFilename: string;
  status: ImportStatus;
  totalTitles: number;
  totalEpisodes: number;
  matchedTitles: number;
  unmatchedTitles: number;
  errorMessage?: string | null;
  rawPreview?: ParsedImport | null;
  items: ImportPreviewItem[];
  createdAt: string;
  updatedAt: string;
};
