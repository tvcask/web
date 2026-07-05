import { and, eq, inArray, isNotNull } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { episodes as episodesTable, titles as titlesTable } from "@/db/schema";
import { ensureUpcomingEpisode } from "@/lib/services/metadata-service";
import { toEpisode, toTitle } from "@/lib/services/mappers";
import { getUserList } from "@/lib/services/tracking-service";
import type { CalendarEpisode } from "@/lib/services/types";

export async function getCalendar(userId: string) {
  const tracked = await getUserList(userId);
  await Promise.all(tracked.map((item) => ensureUpcomingEpisode(item.title)));

  const trackedTitleIds = tracked.map((item) => item.titleId);
  if (trackedTitleIds.length === 0) {
    return { today: [], thisWeek: [], upcoming: [] };
  }

  const rows = await db
    .select()
    .from(episodesTable)
    .innerJoin(titlesTable, eq(episodesTable.titleId, titlesTable.id))
    .where(and(inArray(episodesTable.titleId, trackedTitleIds), isNotNull(episodesTable.airDate)));

  const upcoming: CalendarEpisode[] = rows
    .map((row) => ({ ...toEpisode(row.episodes), title: toTitle(row.titles) }))
    .sort((a, b) => String(a.airDate).localeCompare(String(b.airDate)));

  const today = new Date().toISOString().slice(0, 10);
  const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  return {
    today: upcoming.filter((episode) => episode.airDate === today),
    thisWeek: upcoming.filter((episode) => String(episode.airDate) > today && String(episode.airDate) <= weekFromNow),
    upcoming: upcoming.filter((episode) => String(episode.airDate) > weekFromNow).slice(0, 24)
  };
}
