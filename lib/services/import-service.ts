import { and, desc, eq, ilike, inArray } from "drizzle-orm";
import { db } from "@/lib/db/client";
import {
  importItems as importItemsTable,
  imports as importsTable,
  titles as titlesTable,
  userTitles as userTitlesTable
} from "@/db/schema";
import { normalizeTitle } from "@/lib/metadata/normalize";
import { tvTimeImporter, type UploadedFile } from "@/lib/importers/tv-time-importer";
import { getTitle, matchTitle, upsertTitle } from "@/lib/services/metadata-service";
import { getUserTitle, recordWatchedEpisode, upsertUserCollection } from "@/lib/services/tracking-service";
import { toTitle } from "@/lib/services/mappers";
import { createId } from "@/lib/services/ids";
import type {
  ImportPreviewItem,
  ImportRecord,
  ImportStatus,
  MatchStatus,
  ParsedImport,
  ParsedTitle,
  UserTitleStatus
} from "@/lib/services/types";

type ImportRow = typeof importsTable.$inferSelect;
type ImportItemRow = typeof importItemsTable.$inferSelect;

function toPreviewItem(row: ImportItemRow): ImportPreviewItem {
  return {
    id: row.id,
    rawTitle: row.rawTitle,
    normalizedTitle: row.normalizedTitle,
    matchedTitleId: row.matchedTitleId,
    matchStatus: row.matchStatus as MatchStatus,
    matchConfidence: row.matchConfidence,
    rawData: row.rawData as ParsedTitle
  };
}

function toImportRecord(row: ImportRow, items: ImportItemRow[]): ImportRecord {
  return {
    id: row.id,
    userId: row.userId,
    source: "tv_time",
    originalFilename: row.originalFilename,
    status: row.status as ImportStatus,
    totalTitles: row.totalTitles,
    totalEpisodes: row.totalEpisodes,
    matchedTitles: row.matchedTitles,
    unmatchedTitles: row.unmatchedTitles,
    errorMessage: row.errorMessage,
    rawPreview: (row.rawPreview as ParsedImport | null) ?? null,
    items: items.map(toPreviewItem),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString()
  };
}

export async function createTvTimeImport(userId: string, file: UploadedFile): Promise<ImportRecord> {
  const [record] = await db
    .insert(importsTable)
    .values({ userId, source: "tv_time", originalFilename: file.name, status: "parsing" })
    .returning();

  try {
    if (!(await tvTimeImporter.canParse(file))) {
      throw new Error("Unsupported file type. Upload a TV Time JSON or CSV export.");
    }

    const parsed = await tvTimeImporter.parse(file);
    const items = await Promise.all(
      parsed.titles.map(async (parsedTitle) => {
        const match = await matchTitle(parsedTitle.title, parsedTitle.year);
        return {
          importId: record.id,
          userId,
          rawTitle: parsedTitle.title,
          normalizedTitle: normalizeTitle(parsedTitle.title),
          matchedTitleId: match?.title.id ?? null,
          matchStatus: (match ? "matched" : "unmatched") as MatchStatus,
          matchConfidence: match?.confidence ?? null,
          rawData: parsedTitle
        };
      })
    );

    const insertedItems = items.length
      ? await db.insert(importItemsTable).values(items).returning()
      : [];

    const unmatched = items.filter((item) => item.matchStatus === "unmatched").length;
    const [updated] = await db
      .update(importsTable)
      .set({
        status: unmatched > 0 ? "needs_review" : "parsed",
        totalTitles: parsed.titles.length,
        totalEpisodes: parsed.episodes.length,
        matchedTitles: items.length - unmatched,
        unmatchedTitles: unmatched,
        rawPreview: parsed,
        updatedAt: new Date()
      })
      .where(eq(importsTable.id, record.id))
      .returning();

    return toImportRecord(updated, insertedItems);
  } catch (error) {
    const [failed] = await db
      .update(importsTable)
      .set({
        status: "failed",
        errorMessage: error instanceof Error ? error.message : "Import failed.",
        updatedAt: new Date()
      })
      .where(eq(importsTable.id, record.id))
      .returning();
    return toImportRecord(failed, []);
  }
}

export async function getImport(userId: string, id: string): Promise<ImportRecord | undefined> {
  const [row] = await db
    .select()
    .from(importsTable)
    .where(and(eq(importsTable.userId, userId), eq(importsTable.id, id)))
    .limit(1);
  if (!row) {
    return undefined;
  }
  const items = await db.select().from(importItemsTable).where(eq(importItemsTable.importId, id));
  return toImportRecord(row, items);
}

export async function getImports(userId: string): Promise<ImportRecord[]> {
  const rows = await db
    .select()
    .from(importsTable)
    .where(eq(importsTable.userId, userId))
    .orderBy(desc(importsTable.createdAt));
  if (rows.length === 0) {
    return [];
  }
  const items = await db
    .select()
    .from(importItemsTable)
    .where(inArray(importItemsTable.importId, rows.map((row) => row.id)));
  const itemsByImport = new Map<string, ImportItemRow[]>();
  items.forEach((item) => {
    itemsByImport.set(item.importId, [...(itemsByImport.get(item.importId) ?? []), item]);
  });
  return rows.map((row) => toImportRecord(row, itemsByImport.get(row.id) ?? []));
}

async function resolveTitleIdByName(name: string): Promise<string | undefined> {
  const normalized = normalizeTitle(name);
  const candidates = await db.select().from(titlesTable).where(ilike(titlesTable.title, `%${name}%`)).limit(10);
  return candidates.map(toTitle).find((title) => normalizeTitle(title.title) === normalized)?.id;
}

export async function confirmImport(userId: string, importId: string): Promise<ImportRecord | undefined> {
  const record = await getImport(userId, importId);
  if (!record || !record.rawPreview) {
    throw new Error("Import preview not found.");
  }

  await db.update(importsTable).set({ status: "importing", updatedAt: new Date() }).where(eq(importsTable.id, importId));

  const titleIdsByRawName = new Map<string, string>();

  for (const item of record.items) {
    const parsedTitle = item.rawData;
    const matched = item.matchedTitleId ? await getTitle(item.matchedTitleId) : undefined;
    const title =
      matched ??
      (await upsertTitle({
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
      }));

    const status: UserTitleStatus =
      parsedTitle.status && parsedTitle.status !== "unknown" ? parsedTitle.status : "watching";

    const existing = await getUserTitle(userId, title.id);
    if (existing) {
      await db
        .update(userTitlesTable)
        .set({
          status: mergeStatus(existing.status, status),
          favorite: existing.favorite || Boolean(parsedTitle.favorite),
          rating: existing.rating ?? parsedTitle.rating ?? null,
          importedFrom: existing.importedFrom ?? "tv_time",
          importedExternalId: existing.importedExternalId ?? parsedTitle.sourceId ?? null,
          updatedAt: new Date()
        })
        .where(and(eq(userTitlesTable.userId, userId), eq(userTitlesTable.titleId, title.id)));
    } else {
      await db
        .insert(userTitlesTable)
        .values({
          userId,
          titleId: title.id,
          status,
          favorite: Boolean(parsedTitle.favorite),
          rating: parsedTitle.rating ?? null,
          importedFrom: "tv_time",
          importedExternalId: parsedTitle.sourceId ?? null
        })
        .onConflictDoNothing();
    }

    for (const name of parsedTitle.listNames ?? []) {
      await upsertUserCollection(userId, name, title.id, { importedFrom: "tv_time" });
    }
    titleIdsByRawName.set(normalizeTitle(parsedTitle.title), title.id);
  }

  for (const episode of record.rawPreview.episodes) {
    const normalized = normalizeTitle(episode.title);
    const titleId = titleIdsByRawName.get(normalized) ?? (await resolveTitleIdByName(episode.title));
    if (!titleId || !episode.seasonNumber || !episode.episodeNumber) {
      continue;
    }
    await recordWatchedEpisode(userId, titleId, episode.seasonNumber, episode.episodeNumber, episode.watchedAt ?? null, "tv_time");
  }

  await db.update(importsTable).set({ status: "completed", updatedAt: new Date() }).where(eq(importsTable.id, importId));
  return getImport(userId, importId);
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
