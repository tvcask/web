import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import {
  episodes as episodesTable,
  titles as titlesTable,
  userListItems,
  userLists,
  userTitles as userTitlesTable,
  watchedEpisodes as watchedEpisodesTable
} from "@/db/schema";
import { ensureEpisodes, getTitle, upsertTitle } from "@/lib/services/metadata-service";
import { toTitle, toUserTitle } from "@/lib/services/mappers";
import type {
  Title,
  UserCollection,
  UserCollectionWithTitles,
  UserTitle,
  UserTitleStatus,
  UserTitleWithTitle
} from "@/lib/services/types";

export async function getUserList(userId: string): Promise<UserTitleWithTitle[]> {
  const rows = await db
    .select()
    .from(userTitlesTable)
    .innerJoin(titlesTable, eq(userTitlesTable.titleId, titlesTable.id))
    .where(eq(userTitlesTable.userId, userId));

  const titleIds = rows.map((row) => row.titles.id);
  const counts = titleIds.length
    ? await db
        .select({ titleId: episodesTable.titleId, count: sql<number>`count(*)::int` })
        .from(episodesTable)
        .where(inArray(episodesTable.titleId, titleIds))
        .groupBy(episodesTable.titleId)
    : [];
  const countByTitle = new Map(counts.map((entry) => [entry.titleId, entry.count]));

  return rows.map((row) => ({
    ...toUserTitle(row.user_titles),
    title: toTitle(row.titles),
    episodeCount: countByTitle.get(row.titles.id) ?? 0
  }));
}

export async function getUserMovies(userId: string) {
  return (await getUserList(userId)).filter((item) => item.title.type === "movie");
}

export async function getUserShows(userId: string) {
  return (await getUserList(userId)).filter((item) => item.title.type !== "movie");
}

export async function getFavoriteTitles(userId: string) {
  return (await getUserList(userId)).filter((item) => item.favorite);
}

export async function upsertUserCollection(
  userId: string,
  name: string,
  titleId: string,
  input?: Partial<Pick<UserCollection, "description" | "importedFrom">>
) {
  const normalizedName = name.trim();
  if (!normalizedName) {
    return null;
  }

  const [existing] = await db
    .select()
    .from(userLists)
    .where(and(eq(userLists.userId, userId), sql`lower(${userLists.name}) = ${normalizedName.toLowerCase()}`))
    .limit(1);

  let listId: string;
  if (existing) {
    listId = existing.id;
    if (input?.description || input?.importedFrom) {
      await db
        .update(userLists)
        .set({
          description: input?.description ?? existing.description,
          importedFrom: input?.importedFrom ?? existing.importedFrom,
          updatedAt: new Date()
        })
        .where(eq(userLists.id, listId));
    }
  } else {
    const [created] = await db
      .insert(userLists)
      .values({
        userId,
        name: normalizedName,
        description: input?.description ?? null,
        importedFrom: input?.importedFrom ?? null
      })
      .returning();
    listId = created.id;
  }

  await db.insert(userListItems).values({ listId, titleId }).onConflictDoNothing();
  return { id: listId, name: normalizedName };
}

export async function getUserCollections(userId: string): Promise<UserCollectionWithTitles[]> {
  const list = await getUserList(userId);
  const byTitleId = new Map(list.map((item) => [item.titleId, item]));

  const derived: UserCollectionWithTitles[] = [
    makeDerivedCollection(userId, "watchlist", "Watchlist", "Saved titles", list.filter((i) => i.status === "watchlist")),
    makeDerivedCollection(userId, "watching", "Currently watching", "In progress", list.filter((i) => i.status === "watching")),
    makeDerivedCollection(userId, "favorites", "Favorites", "Favorited titles", list.filter((i) => i.favorite)),
    makeDerivedCollection(userId, "completed", "Watched", "Completed history", list.filter((i) => i.status === "completed"))
  ].filter((collection) => collection.items.length > 0);

  const lists = await db.select().from(userLists).where(eq(userLists.userId, userId));
  const listIds = lists.map((entry) => entry.id);
  const itemRows = listIds.length
    ? await db.select().from(userListItems).where(inArray(userListItems.listId, listIds))
    : [];
  const itemsByList = new Map<string, string[]>();
  itemRows.forEach((item) => {
    itemsByList.set(item.listId, [...(itemsByList.get(item.listId) ?? []), item.titleId]);
  });

  const custom: UserCollectionWithTitles[] = lists
    .map((entry) => {
      const titleIds = itemsByList.get(entry.id) ?? [];
      return {
        id: entry.id,
        userId,
        name: entry.name,
        description: entry.description,
        kind: "custom" as const,
        titleIds,
        importedFrom: entry.importedFrom,
        createdAt: entry.createdAt.toISOString(),
        updatedAt: entry.updatedAt.toISOString(),
        items: titleIds.map((id) => byTitleId.get(id)).filter(Boolean) as UserTitleWithTitle[]
      };
    })
    .filter((collection) => collection.items.length > 0);

  return [...custom, ...derived];
}

function makeDerivedCollection(
  userId: string,
  kind: UserCollection["kind"],
  name: string,
  description: string,
  items: UserTitleWithTitle[]
): UserCollectionWithTitles {
  const now = new Date().toISOString();
  return {
    id: `derived-${kind}`,
    userId,
    name,
    description,
    kind,
    titleIds: items.map((item) => item.titleId),
    importedFrom: null,
    createdAt: now,
    updatedAt: now,
    items
  };
}

export async function addTitleToUser(
  userId: string,
  title: Title,
  status: UserTitleStatus,
  favorite = false
): Promise<UserTitle> {
  const storedTitle = await upsertTitle(title);
  await ensureEpisodes(storedTitle);

  const [saved] = await db
    .insert(userTitlesTable)
    .values({ userId, titleId: storedTitle.id, status, favorite })
    .onConflictDoUpdate({
      target: [userTitlesTable.userId, userTitlesTable.titleId],
      set: {
        status,
        favorite: sql`${userTitlesTable.favorite} or ${favorite}`,
        updatedAt: new Date()
      }
    })
    .returning();

  return toUserTitle(saved);
}

export async function removeTitleFromUser(userId: string, titleId: string) {
  await db
    .delete(watchedEpisodesTable)
    .where(and(eq(watchedEpisodesTable.userId, userId), eq(watchedEpisodesTable.titleId, titleId)));
  await db
    .delete(userTitlesTable)
    .where(and(eq(userTitlesTable.userId, userId), eq(userTitlesTable.titleId, titleId)));
}

export async function getUserTitle(userId: string, titleId: string): Promise<UserTitle | null> {
  const [row] = await db
    .select()
    .from(userTitlesTable)
    .where(and(eq(userTitlesTable.userId, userId), eq(userTitlesTable.titleId, titleId)))
    .limit(1);
  return row ? toUserTitle(row) : null;
}

type UserTitleUpdate = Partial<Pick<UserTitleWithTitle, "status" | "favorite" | "rating">>;

export async function updateUserTitleByTitleId(userId: string, titleId: string, input: UserTitleUpdate) {
  const [updated] = await db
    .update(userTitlesTable)
    .set({ ...input, updatedAt: new Date() })
    .where(and(eq(userTitlesTable.userId, userId), eq(userTitlesTable.titleId, titleId)))
    .returning();
  if (!updated) {
    throw new Error("Tracked title not found.");
  }
  return toUserTitle(updated);
}

export async function markNextEpisodeWatched(userId: string, userTitleId: string): Promise<UserTitle> {
  const [current] = await db
    .select()
    .from(userTitlesTable)
    .where(and(eq(userTitlesTable.userId, userId), eq(userTitlesTable.id, userTitleId)))
    .limit(1);
  if (!current) {
    throw new Error("Tracked title not found.");
  }

  const title = await getTitle(current.titleId);
  if (title?.type === "movie") {
    const [updated] = await db
      .update(userTitlesTable)
      .set({ status: "completed", updatedAt: new Date() })
      .where(eq(userTitlesTable.id, userTitleId))
      .returning();
    return toUserTitle(updated);
  }

  const nextSeason = current.currentSeason ?? 1;
  const nextEpisode = (current.currentEpisode ?? 0) + 1;

  const [updated] = await db
    .update(userTitlesTable)
    .set({ currentSeason: nextSeason, currentEpisode: nextEpisode, status: "watching", updatedAt: new Date() })
    .where(eq(userTitlesTable.id, userTitleId))
    .returning();

  await db
    .insert(watchedEpisodesTable)
    .values({
      userId,
      titleId: current.titleId,
      seasonNumber: nextSeason,
      episodeNumber: nextEpisode,
      watchedAt: new Date()
    })
    .onConflictDoNothing();

  return toUserTitle(updated);
}

// Batch-fetch episode names for a set of shows so watch-next rows can show the
// next episode title without an N+1.
export async function getEpisodeNameMap(titleIds: string[]): Promise<Map<string, string>> {
  if (titleIds.length === 0) {
    return new Map();
  }
  const rows = await db
    .select({
      titleId: episodesTable.titleId,
      s: episodesTable.seasonNumber,
      e: episodesTable.episodeNumber,
      name: episodesTable.name
    })
    .from(episodesTable)
    .where(inArray(episodesTable.titleId, titleIds));
  const map = new Map<string, string>();
  for (const row of rows) {
    if (row.name) {
      map.set(`${row.titleId}-${row.s}-${row.e}`, row.name);
    }
  }
  return map;
}

export async function getWatchedEpisodeKeys(userId: string, titleId: string): Promise<Set<string>> {
  const rows = await db
    .select({ s: watchedEpisodesTable.seasonNumber, e: watchedEpisodesTable.episodeNumber })
    .from(watchedEpisodesTable)
    .where(and(eq(watchedEpisodesTable.userId, userId), eq(watchedEpisodesTable.titleId, titleId)));
  return new Set(rows.map((row) => `${row.s}-${row.e}`));
}

// Recompute a show's next-up pointer + status from its watched episodes.
async function recomputeShowProgress(userId: string, titleId: string) {
  const [{ total }] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(episodesTable)
    .where(eq(episodesTable.titleId, titleId));
  const watched = await db
    .select({ s: watchedEpisodesTable.seasonNumber, e: watchedEpisodesTable.episodeNumber })
    .from(watchedEpisodesTable)
    .where(and(eq(watchedEpisodesTable.userId, userId), eq(watchedEpisodesTable.titleId, titleId)));

  let maxSeason: number | null = null;
  let maxEpisode: number | null = null;
  for (const row of watched) {
    if (maxSeason === null || row.s > maxSeason || (row.s === maxSeason && row.e > (maxEpisode ?? 0))) {
      maxSeason = row.s;
      maxEpisode = row.e;
    }
  }

  const status = total > 0 && watched.length >= total ? "completed" : watched.length > 0 ? "watching" : "watchlist";
  await db
    .update(userTitlesTable)
    .set({ currentSeason: maxSeason, currentEpisode: maxEpisode, status, updatedAt: new Date() })
    .where(and(eq(userTitlesTable.userId, userId), eq(userTitlesTable.titleId, titleId)));
}

// Toggle a single episode watched/unwatched, then refresh progress.
export async function setEpisodeWatched(
  userId: string,
  titleId: string,
  episodeId: string | null,
  seasonNumber: number,
  episodeNumber: number,
  watched: boolean
) {
  // Make sure the show is tracked before recording episodes.
  const existing = await getUserTitle(userId, titleId);
  if (!existing) {
    await db
      .insert(userTitlesTable)
      .values({ userId, titleId, status: "watching" })
      .onConflictDoNothing({ target: [userTitlesTable.userId, userTitlesTable.titleId] });
  }

  if (watched) {
    await db
      .insert(watchedEpisodesTable)
      .values({ userId, titleId, episodeId, seasonNumber, episodeNumber, watchedAt: new Date() })
      .onConflictDoNothing({
        target: [
          watchedEpisodesTable.userId,
          watchedEpisodesTable.titleId,
          watchedEpisodesTable.seasonNumber,
          watchedEpisodesTable.episodeNumber
        ]
      });
  } else {
    await db
      .delete(watchedEpisodesTable)
      .where(
        and(
          eq(watchedEpisodesTable.userId, userId),
          eq(watchedEpisodesTable.titleId, titleId),
          eq(watchedEpisodesTable.seasonNumber, seasonNumber),
          eq(watchedEpisodesTable.episodeNumber, episodeNumber)
        )
      );
  }

  await recomputeShowProgress(userId, titleId);
}

// Mark or clear every episode in a season.
export async function setSeasonWatched(userId: string, titleId: string, seasonNumber: number, watched: boolean) {
  const existing = await getUserTitle(userId, titleId);
  if (!existing) {
    await db
      .insert(userTitlesTable)
      .values({ userId, titleId, status: "watching" })
      .onConflictDoNothing({ target: [userTitlesTable.userId, userTitlesTable.titleId] });
  }

  const seasonEpisodes = await db
    .select()
    .from(episodesTable)
    .where(and(eq(episodesTable.titleId, titleId), eq(episodesTable.seasonNumber, seasonNumber)));

  if (watched) {
    if (seasonEpisodes.length > 0) {
      await db
        .insert(watchedEpisodesTable)
        .values(
          seasonEpisodes.map((ep) => ({
            userId,
            titleId,
            episodeId: ep.id,
            seasonNumber: ep.seasonNumber,
            episodeNumber: ep.episodeNumber,
            watchedAt: new Date()
          }))
        )
        .onConflictDoNothing({
          target: [
            watchedEpisodesTable.userId,
            watchedEpisodesTable.titleId,
            watchedEpisodesTable.seasonNumber,
            watchedEpisodesTable.episodeNumber
          ]
        });
    }
  } else {
    await db
      .delete(watchedEpisodesTable)
      .where(
        and(
          eq(watchedEpisodesTable.userId, userId),
          eq(watchedEpisodesTable.titleId, titleId),
          eq(watchedEpisodesTable.seasonNumber, seasonNumber)
        )
      );
  }

  await recomputeShowProgress(userId, titleId);
}

export async function recordWatchedEpisode(
  userId: string,
  titleId: string,
  seasonNumber: number,
  episodeNumber: number,
  watchedAt?: string | null,
  importedFrom?: string | null
) {
  const parsed = watchedAt ? new Date(watchedAt) : null;
  const watchedAtValue = parsed && !Number.isNaN(parsed.getTime()) ? parsed : null;

  await db
    .insert(watchedEpisodesTable)
    .values({
      userId,
      titleId,
      seasonNumber,
      episodeNumber,
      watchedAt: watchedAtValue,
      importedFrom: importedFrom ?? null
    })
    .onConflictDoNothing();

  const [current] = await db
    .select()
    .from(userTitlesTable)
    .where(and(eq(userTitlesTable.userId, userId), eq(userTitlesTable.titleId, titleId)))
    .limit(1);
  if (!current) {
    return;
  }

  const isLaterSeason = (current.currentSeason ?? 0) < seasonNumber;
  const isLaterEpisode = (current.currentSeason ?? 0) === seasonNumber && (current.currentEpisode ?? 0) < episodeNumber;

  const set: Record<string, unknown> = {};
  if (isLaterSeason || isLaterEpisode) {
    set.currentSeason = seasonNumber;
    set.currentEpisode = episodeNumber;
  }
  if (current.status === "watchlist") {
    set.status = "watching";
  }
  if (Object.keys(set).length > 0) {
    set.updatedAt = new Date();
    await db.update(userTitlesTable).set(set).where(eq(userTitlesTable.id, current.id));
  }
}
