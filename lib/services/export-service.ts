import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { watchedEpisodes as watchedEpisodesTable } from "@/db/schema";
import { getImports } from "@/lib/services/import-service";
import { getStats } from "@/lib/services/stats-service";
import { getUserList } from "@/lib/services/tracking-service";

export async function createUserExport(userId: string) {
  const [titles, watchedEpisodes, imports, stats] = await Promise.all([
    getUserList(userId),
    db.select().from(watchedEpisodesTable).where(eq(watchedEpisodesTable.userId, userId)),
    getImports(userId),
    getStats(userId)
  ]);

  return {
    exportedAt: new Date().toISOString(),
    source: "tv_cask",
    titles,
    watchedEpisodes,
    imports: imports.map(({ rawPreview: _rawPreview, ...record }) => record),
    stats
  };
}
