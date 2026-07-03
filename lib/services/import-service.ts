import { normalizeTitle } from "@/lib/metadata/normalize";
import { tvTimeImporter, type UploadedFile } from "@/lib/importers/tv-time-importer";
import { matchTitle } from "@/lib/services/metadata-service";
import { createId, store, upsertTitle } from "@/lib/services/store";
import type { ImportRecord, UserTitleStatus } from "@/lib/services/types";

export async function createTvTimeImport(userId: string, file: UploadedFile): Promise<ImportRecord> {
  const now = new Date().toISOString();
  const record: ImportRecord = {
    id: createId("imp"),
    userId,
    source: "tv_time",
    originalFilename: file.name,
    status: "parsing",
    totalTitles: 0,
    totalEpisodes: 0,
    matchedTitles: 0,
    unmatchedTitles: 0,
    rawPreview: null,
    items: [],
    createdAt: now,
    updatedAt: now
  };
  store.imports.push(record);

  try {
    if (!(await tvTimeImporter.canParse(file))) {
      throw new Error("Unsupported file type. Upload a TV Time JSON or CSV export.");
    }

    const parsed = await tvTimeImporter.parse(file);
    const items = await Promise.all(
      parsed.titles.map(async (parsedTitle) => {
        const match = await matchTitle(parsedTitle.title, parsedTitle.year);
        return {
          id: createId("item"),
          rawTitle: parsedTitle.title,
          normalizedTitle: normalizeTitle(parsedTitle.title),
          matchedTitleId: match?.title.id ?? null,
          matchStatus: match ? "matched" : "unmatched",
          matchConfidence: match?.confidence ?? null,
          rawData: parsedTitle
        } as const;
      })
    );

    record.status = items.some((item) => item.matchStatus === "unmatched") ? "needs_review" : "parsed";
    record.totalTitles = parsed.titles.length;
    record.totalEpisodes = parsed.episodes.length;
    record.matchedTitles = items.filter((item) => item.matchStatus === "matched").length;
    record.unmatchedTitles = items.filter((item) => item.matchStatus === "unmatched").length;
    record.rawPreview = parsed;
    record.items = items;
    record.updatedAt = new Date().toISOString();
    return record;
  } catch (error) {
    record.status = "failed";
    record.errorMessage = error instanceof Error ? error.message : "Import failed.";
    record.updatedAt = new Date().toISOString();
    return record;
  }
}

export function getImport(userId: string, id: string) {
  return store.imports.find((item) => item.userId === userId && item.id === id);
}

export function getImports(userId: string) {
  return store.imports.filter((item) => item.userId === userId);
}

export function confirmImport(userId: string, importId: string) {
  const record = getImport(userId, importId);
  if (!record || !record.rawPreview) {
    throw new Error("Import preview not found.");
  }

  record.status = "importing";
  record.items.forEach((item) => {
    const parsedTitle = item.rawData;
    const existingTitle = item.matchedTitleId ? store.titles.find((title) => title.id === item.matchedTitleId) : null;
    const title =
      existingTitle ??
      upsertTitle({
        id: createId("title"),
        title: parsedTitle.title,
        originalTitle: parsedTitle.originalTitle ?? null,
        type: parsedTitle.type === "movie" ? "movie" : parsedTitle.type === "anime" ? "anime" : "tv",
        category: parsedTitle.type === "movie" ? "movie" : parsedTitle.type === "anime" ? "anime" : "tv_show",
        overview: null,
        posterUrl: null,
        backdropUrl: null,
        year: parsedTitle.year ?? null,
        genres: []
      });

    const status = parsedTitle.status && parsedTitle.status !== "unknown" ? parsedTitle.status : "watching";
    const existingUserTitle = store.userTitles.find((entry) => entry.userId === userId && entry.titleId === title.id);
    if (existingUserTitle) {
      existingUserTitle.status = mergeStatus(existingUserTitle.status, status);
      existingUserTitle.favorite = existingUserTitle.favorite || Boolean(parsedTitle.favorite);
      return;
    }

    store.userTitles.push({
      id: createId("ut"),
      userId,
      titleId: title.id,
      status,
      favorite: Boolean(parsedTitle.favorite),
      rating: parsedTitle.rating ?? null,
      currentSeason: null,
      currentEpisode: null,
      importedFrom: "tv_time",
      importedExternalId: parsedTitle.sourceId ?? null
    });
  });

  record.rawPreview.episodes.forEach((episode) => {
    const normalized = normalizeTitle(episode.title);
    const title = store.titles.find((candidate) => normalizeTitle(candidate.title) === normalized);
    if (!title || !episode.seasonNumber || !episode.episodeNumber) {
      return;
    }
    store.watchedEpisodes.push({
      id: createId("we"),
      userId,
      titleId: title.id,
      seasonNumber: episode.seasonNumber,
      episodeNumber: episode.episodeNumber,
      watchedAt: episode.watchedAt ?? null,
      importedFrom: "tv_time"
    });
  });

  record.status = "completed";
  record.updatedAt = new Date().toISOString();
  return record;
}

function mergeStatus(existing: UserTitleStatus, incoming: UserTitleStatus): UserTitleStatus {
  if (existing === "completed" || incoming === "completed") {
    return "completed";
  }
  if (existing === "watching" || incoming === "watching") {
    return "watching";
  }
  return incoming;
}
