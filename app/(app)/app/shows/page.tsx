import Link from "next/link";
import { FileUp, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TabsNav } from "@/components/ui/tabs-nav";
import { ViewToggle } from "@/components/ui/view-toggle";
import { LibraryGrid } from "@/components/titles/library-grid";
import { MediaRail } from "@/components/titles/media-rail";
import { UpNextCard } from "@/components/titles/up-next-card";
import { getUserId } from "@/lib/auth/session";
import { getCalendar } from "@/lib/services/calendar-service";
import { getDiscoverSections } from "@/lib/services/metadata-service";
import { getEpisodeNameMap, getUserShows } from "@/lib/services/tracking-service";

const tabs = [
  { value: "watchlist", label: "Watch list" },
  { value: "upcoming", label: "Upcoming" }
];

export default async function ShowsPage({ searchParams }: { searchParams: Promise<{ tab?: string; view?: string }> }) {
  const userId = await getUserId();
  const { tab, view } = await searchParams;
  const activeTab = tab === "upcoming" ? "upcoming" : "watchlist";
  const activeView = view === "grid" ? "grid" : "list";

  const list = await getUserShows(userId);
  const upNext = list.filter((item) => item.status === "watching");
  const notStarted = list.filter((item) => item.status === "watchlist");
  const everything = [...upNext, ...notStarted];
  const calendar = activeTab === "upcoming" ? await getCalendar(userId) : null;

  const returnTo = `/app/shows?tab=watchlist&view=${activeView}`;

  // Next-episode names for the watch-next rows (one batched query).
  const nameMap =
    activeTab === "watchlist" && activeView === "list" && everything.length > 0
      ? await getEpisodeNameMap(everything.map((item) => item.title.id))
      : new Map<string, string>();
  const nextName = (item: (typeof everything)[number]) =>
    nameMap.get(`${item.title.id}-${item.currentSeason ?? 1}-${(item.currentEpisode ?? 0) + 1}`);

  return (
    <div className="mx-auto max-w-[1300px]">
      <header className="mb-6 flex items-center gap-4">
        <h1 className="display text-2xl text-white">Shows</h1>
        <TabsNav tabs={tabs} active={activeTab} base="/app/shows" />
        {activeTab === "watchlist" && list.length > 0 ? (
          <ViewToggle view={activeView} listHref="/app/shows?tab=watchlist&view=list" gridHref="/app/shows?tab=watchlist&view=grid" />
        ) : null}
      </header>

      {activeTab === "upcoming" ? (
        <Upcoming calendar={calendar} />
      ) : list.length === 0 ? (
        <EmptyShows />
      ) : activeView === "grid" ? (
        <LibraryGrid items={everything} returnTo={returnTo} />
      ) : (
        <div className="space-y-8">
          {upNext.length > 0 ? (
            <section>
              <p className="eyebrow mb-3">Watch next</p>
              <div className="space-y-3">
                {upNext.map((item) => (
                  <UpNextCard key={item.id} item={item} returnTo={returnTo} nextEpisodeName={nextName(item)} />
                ))}
              </div>
            </section>
          ) : null}
          {notStarted.length > 0 ? (
            <section>
              <p className="eyebrow mb-3">Haven&apos;t watched for a while</p>
              <div className="space-y-3">
                {notStarted.map((item) => (
                  <UpNextCard key={item.id} item={item} returnTo={returnTo} nextEpisodeName={nextName(item)} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      )}
    </div>
  );
}

async function EmptyShows() {
  const sections = await getDiscoverSections();
  const shows = sections.find((section) => section.items.some((item) => item.type !== "movie"));

  return (
    <div className="space-y-8">
      <div className="surface rounded-[16px] p-8">
        <h2 className="display text-xl text-white">Nothing tracked yet.</h2>
        <p className="mt-2 max-w-md text-white/50">Bring your TV Time history over, or add shows from Explore.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/app/import">
              <FileUp className="size-4" /> Import from TV Time
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/app/explore">
              <Search className="size-4" /> Explore
            </Link>
          </Button>
        </div>
      </div>
      {shows ? (
        <MediaRail
          title="Popular right now"
          items={shows.items.filter((item) => item.type !== "movie").slice(0, 12)}
          returnTo="/app/shows"
        />
      ) : null}
    </div>
  );
}

function Upcoming({ calendar }: { calendar: Awaited<ReturnType<typeof getCalendar>> | null }) {
  const groups = calendar
    ? ([
        ["Today", calendar.today],
        ["This week", calendar.thisWeek],
        ["Later", calendar.upcoming]
      ] as const)
    : [];
  const hasItems = groups.some(([, items]) => items.length > 0);

  if (!hasItems) {
    return <p className="surface rounded-[14px] p-6 text-white/50">No upcoming episodes for your shows yet.</p>;
  }

  return (
    <div className="max-w-3xl space-y-7">
      {groups.map(([label, items]) =>
        items.length > 0 ? (
          <section key={label}>
            <div className="mb-3 flex items-center gap-3">
              <span className="text-sm font-extrabold" style={{ color: "var(--accent-text)" }}>
                {label}
              </span>
              <div className="h-px flex-1 bg-white/[0.07]" />
            </div>
            <div className="flex flex-col gap-2.5">
              {items.map((episode) => (
                <div key={episode.id} className="flex items-center gap-3.5">
                  <div
                    className="surface h-[60px] w-[104px] shrink-0 overflow-hidden rounded-[9px]"
                    style={{ background: episode.title?.backdropUrl ? undefined : "linear-gradient(140deg,#2a2f3a,#14110d)" }}
                  >
                    {episode.title?.backdropUrl ? (
                      <img src={episode.title.backdropUrl} alt="" className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-white">{episode.title?.title}</p>
                    <p className="mt-0.5 text-xs font-medium text-white/50">
                      S{episode.seasonNumber} · E{episode.episodeNumber}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-white/55">{episode.airDate}</span>
                </div>
              ))}
            </div>
          </section>
        ) : null
      )}
    </div>
  );
}
