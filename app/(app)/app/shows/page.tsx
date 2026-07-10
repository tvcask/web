import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TabsNav } from "@/components/ui/tabs-nav";
import { ViewToggle } from "@/components/ui/view-toggle";
import { MediaRail } from "@/components/titles/media-rail";
import { InfiniteLibrary } from "@/components/titles/infinite-library";
import { getCalendar, getDiscover, getLibraryPage, type Calendar } from "@/lib/data";

const tabs = [
  { value: "watchlist", label: "Watch list" },
  { value: "upcoming", label: "Upcoming" }
];

export default async function ShowsPage({ searchParams }: { searchParams: Promise<{ tab?: string; view?: string }> }) {
  const { tab, view } = await searchParams;
  const activeTab = tab === "upcoming" ? "upcoming" : "watchlist";
  const activeView = view === "grid" ? "grid" : "list";

  // The watch list is active shows only — completed shows leave it.
  const status = "watchlist,watching";
  const { items, total } =
    activeTab === "watchlist" ? await getLibraryPage({ type: "show", status, limit: 40 }) : { items: [], total: 0 };
  const calendar = activeTab === "upcoming" ? await getCalendar() : null;

  const returnTo = `/app/shows?tab=watchlist&view=${activeView}`;

  return (
    <div className="mx-auto max-w-[1300px]">
      <header className="mb-6 flex items-center gap-2.5 sm:gap-4">
        <h1 className="display shrink-0 text-xl text-white sm:text-2xl">Shows</h1>
        <TabsNav tabs={tabs} active={activeTab} base="/app/shows" />
        {activeTab === "watchlist" && total > 0 ? (
          <div className="ml-auto shrink-0">
            <ViewToggle view={activeView} listHref="/app/shows?tab=watchlist&view=list" gridHref="/app/shows?tab=watchlist&view=grid" />
          </div>
        ) : null}
      </header>

      {activeTab === "upcoming" ? (
        <Upcoming calendar={calendar} />
      ) : total === 0 ? (
        <EmptyShows />
      ) : (
        <InfiniteLibrary key={status} type="show" view={activeView} status={status} initial={items} total={total} returnTo={returnTo} />
      )}
    </div>
  );
}

async function EmptyShows() {
  const sections = await getDiscover();
  const shows = sections.find((section) => section.items.some((item) => item.type !== "movie"));

  return (
    <div className="space-y-8">
      <div className="surface rounded-[16px] p-8">
        <h2 className="display text-xl text-white">Nothing tracked yet.</h2>
        <p className="mt-2 max-w-md text-white/50">Add shows from Explore to start tracking.</p>
        <Button asChild className="mt-5">
          <Link href="/app/explore">
            <Search className="size-4" /> Explore
          </Link>
        </Button>
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

function Upcoming({ calendar }: { calendar: Calendar | null }) {
  const groups = calendar
    ? ([
        ["Today", calendar.today],
        ["This week", calendar.thisWeek],
        ["Later", calendar.later]
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
                    className="surface relative h-[60px] w-[104px] shrink-0 overflow-hidden rounded-[9px]"
                    style={{ background: episode.title?.backdropUrl ? undefined : "linear-gradient(140deg,#2a2f3a,#14110d)" }}
                  >
                    {episode.title?.backdropUrl ? (
                      <Image src={episode.title.backdropUrl} alt="" fill sizes="104px" className="object-cover" />
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
