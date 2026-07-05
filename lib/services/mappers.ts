import type { episodes, titles, userTitles } from "@/db/schema";
import type { Episode, Title, TitleCategory, TitleType, UserTitle, UserTitleStatus } from "@/lib/services/types";

type TitleRow = typeof titles.$inferSelect;
type EpisodeRow = typeof episodes.$inferSelect;
type UserTitleRow = typeof userTitles.$inferSelect;

export function toTitle(row: TitleRow): Title {
  return {
    id: row.id,
    externalId: row.externalId,
    externalSource: row.externalSource,
    title: row.title,
    originalTitle: row.originalTitle,
    type: row.type as TitleType,
    category: row.category as TitleCategory,
    overview: row.overview,
    posterUrl: row.posterUrl,
    backdropUrl: row.backdropUrl,
    year: row.year,
    genres: row.genres ?? []
  };
}

export function toEpisode(row: EpisodeRow): Episode {
  return {
    id: row.id,
    titleId: row.titleId,
    seasonNumber: row.seasonNumber,
    episodeNumber: row.episodeNumber,
    name: row.name,
    overview: row.overview,
    airDate: row.airDate,
    runtimeMinutes: row.runtimeMinutes,
    network: row.network
  };
}

export function toUserTitle(row: UserTitleRow): UserTitle {
  return {
    id: row.id,
    userId: row.userId,
    titleId: row.titleId,
    status: row.status as UserTitleStatus,
    favorite: row.favorite,
    rating: row.rating,
    currentSeason: row.currentSeason,
    currentEpisode: row.currentEpisode,
    importedFrom: row.importedFrom,
    importedExternalId: row.importedExternalId
  };
}

// Shape a domain Title for insert into the titles table.
export function titleToRow(title: Title) {
  return {
    id: title.id,
    externalId: title.externalId ?? null,
    externalSource: title.externalSource ?? null,
    title: title.title,
    originalTitle: title.originalTitle ?? null,
    type: title.type,
    category: title.category,
    overview: title.overview ?? null,
    posterUrl: title.posterUrl ?? null,
    backdropUrl: title.backdropUrl ?? null,
    year: title.year ?? null,
    genres: title.genres ?? []
  };
}
