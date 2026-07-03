import { getImports } from "@/lib/services/import-service";
import { getStats } from "@/lib/services/stats-service";
import { store } from "@/lib/services/store";
import { getUserList } from "@/lib/services/tracking-service";

export function createUserExport(userId: string) {
  return {
    exportedAt: new Date().toISOString(),
    source: "tv_cask",
    titles: getUserList(userId),
    watchedEpisodes: store.watchedEpisodes.filter((episode) => episode.userId === userId),
    imports: getImports(userId).map(({ rawPreview: _rawPreview, ...record }) => record),
    stats: getStats(userId)
  };
}
