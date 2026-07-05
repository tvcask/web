import { eq, ilike, sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { episodes as episodesTable, titles as titlesTable } from "@/db/schema";
import { normalizeTitle } from "@/lib/metadata/normalize";
import { getTmdbCollection, getTmdbSeason, getTmdbShowDetails, searchTmdb } from "@/lib/metadata/tmdb";
import { titleToRow, toEpisode, toTitle } from "@/lib/services/mappers";
import type { Episode, Title } from "@/lib/services/types";

export async function upsertTitle(title: Title): Promise<Title> {
  const row = titleToRow(title);
  const [saved] = await db
    .insert(titlesTable)
    .values(row)
    .onConflictDoUpdate({
      target: titlesTable.id,
      set: {
        title: row.title,
        originalTitle: row.originalTitle,
        overview: row.overview,
        posterUrl: row.posterUrl,
        backdropUrl: row.backdropUrl,
        year: row.year,
        genres: row.genres,
        updatedAt: new Date()
      }
    })
    .returning();
  return toTitle(saved);
}

// Cache a batch of catalog titles without overwriting existing rows.
async function cacheTitles(titles: Title[]) {
  if (titles.length === 0) {
    return;
  }
  await db
    .insert(titlesTable)
    .values(titles.map(titleToRow))
    .onConflictDoNothing({ target: titlesTable.id });
}

export async function getTitle(id: string): Promise<Title | undefined> {
  const [row] = await db.select().from(titlesTable).where(eq(titlesTable.id, id)).limit(1);
  return row ? toTitle(row) : undefined;
}

export async function getEpisodesForTitle(titleId: string): Promise<Episode[]> {
  const rows = await db.select().from(episodesTable).where(eq(episodesTable.titleId, titleId));
  return rows.map(toEpisode);
}

export async function searchTitles(query: string): Promise<Title[]> {
  const normalizedQuery = normalizeTitle(query);
  const localRows = await db
    .select()
    .from(titlesTable)
    .where(ilike(titlesTable.title, `%${query}%`))
    .limit(24);
  const local = localRows.map(toTitle);

  if (normalizedQuery.length < 2) {
    return local.slice(0, 20);
  }

  const remote = await searchTmdb(query);
  await cacheTitles(remote);

  const merged = new Map<string, Title>();
  [...local, ...remote].forEach((title) => merged.set(title.id, title));
  return [...merged.values()].slice(0, 24);
}

export async function matchTitle(title: string, year?: number) {
  const normalized = normalizeTitle(title);

  const candidates = (
    await db.select().from(titlesTable).where(ilike(titlesTable.title, `%${title}%`)).limit(20)
  ).map(toTitle);
  const exact = candidates.find((item) => {
    const sameTitle =
      normalizeTitle(item.title) === normalized || normalizeTitle(item.originalTitle ?? "") === normalized;
    return sameTitle && (!year || item.year === year);
  });
  if (exact) {
    return { title: exact, confidence: year && exact.year === year ? 98 : 92 };
  }

  const remote = await searchTmdb(title);
  await cacheTitles(remote);
  const remoteExact =
    remote.find((item) => normalizeTitle(item.title) === normalized && (!year || item.year === year)) ??
    remote.find((item) => normalizeTitle(item.title) === normalized) ??
    remote[0];

  if (!remoteExact) {
    return null;
  }

  return {
    title: remoteExact,
    confidence: normalizeTitle(remoteExact.title) === normalized ? (year && remoteExact.year === year ? 96 : 88) : 72
  };
}

export async function getDiscoverSections() {
  const sections = await Promise.all([
    getTmdbCollection("trending-tv"),
    getTmdbCollection("top-tv"),
    getTmdbCollection("trending-movies"),
    getTmdbCollection("top-movies")
  ]);
  await cacheTitles(sections.flat());

  return [
    { title: "Top shows for you", items: sections[0] },
    { title: "Trending shows", items: sections[1] },
    { title: "Movies to track", items: sections[2] },
    { title: "Popular movies", items: sections[3] }
  ];
}

// Ingest every season's episodes for a show from TMDB (once). Powers the
// season accordion, episode-level tracking, and the upcoming calendar.
export async function ensureEpisodes(title: Title): Promise<void> {
  if (title.type === "movie" || title.externalSource !== "tmdb" || !title.externalId) {
    return;
  }
  const [{ c }] = await db
    .select({ c: sql<number>`count(*)::int` })
    .from(episodesTable)
    .where(eq(episodesTable.titleId, title.id));
  if (c > 0) {
    return;
  }

  const details = await getTmdbShowDetails(title.externalId);
  const seasons = (details?.seasons ?? []).filter((s) => s.season_number >= 1 && s.episode_count > 0).slice(0, 40);
  if (seasons.length === 0) {
    return;
  }
  const network = details?.networks?.[0]?.name ?? null;

  const rows: (typeof episodesTable.$inferInsert)[] = [];
  for (const season of seasons) {
    const eps = await getTmdbSeason(title.externalId, season.season_number);
    for (const e of eps) {
      rows.push({
        id: `tmdb-episode-${e.id}`,
        titleId: title.id,
        seasonNumber: e.season_number,
        episodeNumber: e.episode_number,
        name: e.name ?? `Episode ${e.episode_number}`,
        overview: e.overview ?? null,
        airDate: e.air_date || null,
        network,
        runtimeMinutes: e.runtime ?? null
      });
    }
  }

  if (rows.length > 0) {
    await db
      .insert(episodesTable)
      .values(rows)
      .onConflictDoNothing({
        target: [episodesTable.titleId, episodesTable.seasonNumber, episodesTable.episodeNumber]
      });
  }
}

export async function ensureUpcomingEpisode(title: Title): Promise<Episode | null> {
  if (title.type === "movie" || title.externalSource !== "tmdb") {
    return null;
  }

  const details = await getTmdbShowDetails(title.externalId);
  const next = details?.next_episode_to_air;
  if (!next?.air_date || !next.season_number || !next.episode_number) {
    return null;
  }

  const row = {
    id: `tmdb-episode-${next.id}`,
    titleId: title.id,
    seasonNumber: next.season_number,
    episodeNumber: next.episode_number,
    name: next.name ?? `Episode ${next.episode_number}`,
    overview: next.overview ?? null,
    airDate: next.air_date,
    network: details?.networks?.[0]?.name ?? null,
    runtimeMinutes: next.runtime ?? null
  };

  const [saved] = await db
    .insert(episodesTable)
    .values(row)
    .onConflictDoUpdate({
      target: [episodesTable.titleId, episodesTable.seasonNumber, episodesTable.episodeNumber],
      set: {
        name: row.name,
        overview: row.overview,
        airDate: row.airDate,
        network: row.network,
        runtimeMinutes: row.runtimeMinutes,
        updatedAt: new Date()
      }
    })
    .returning();

  return toEpisode(saved);
}
