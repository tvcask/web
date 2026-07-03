import { store } from "@/lib/services/store";
import { getUserList } from "@/lib/services/tracking-service";

export function getCalendar(userId: string) {
  const trackedTitleIds = new Set(getUserList(userId).map((item) => item.titleId));
  const upcoming = store.episodes
    .filter((episode) => trackedTitleIds.has(episode.titleId) && episode.airDate)
    .map((episode) => ({
      ...episode,
      title: store.titles.find((title) => title.id === episode.titleId)
    }))
    .filter((episode) => episode.title)
    .sort((a, b) => String(a.airDate).localeCompare(String(b.airDate)));

  return {
    today: upcoming.filter((episode) => episode.airDate === new Date().toISOString().slice(0, 10)),
    thisWeek: upcoming.slice(0, 7),
    upcoming: upcoming.slice(7, 24)
  };
}
