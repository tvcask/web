import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon } from '@hugeicons/core-free-icons';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TabsNav } from "@/components/ui/tabs-nav";
import { ViewToggle } from "@/components/ui/view-toggle";
import { MediaRail } from "@/components/titles/media-rail";
import { InfiniteLibrary } from "@/components/titles/infinite-library";
import { Upcoming } from "@/components/titles/upcoming";
import { getCalendar, getDiscover, getLibraryPage } from "@/lib/data";

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
      {/* Pinned under the top nav so the filters stay reachable while the
          infinite list scrolls. -mt/pt swallow main's top padding so cards
          can't peek through the gap when stuck. */}
      <header className="sticky top-16 z-20 -mx-5 -mt-8 mb-6 flex items-center gap-2.5 border-b border-white/[0.06] bg-[#0d0c0b]/95 px-5 pb-3 pt-6 backdrop-blur-xl sm:-mx-8 sm:gap-4 sm:px-8">
        {/* The nav pill already names the page; a visible title would repeat it. */}
        <h1 className="sr-only">Shows</h1>
        <TabsNav tabs={tabs} active={activeTab} base="/app/shows" />
        {activeTab === "watchlist" && total > 0 ? (
          <div className="ml-auto shrink-0">
            <ViewToggle view={activeView} listHref="/app/shows?tab=watchlist&view=list" gridHref="/app/shows?tab=watchlist&view=grid" />
          </div>
        ) : null}
      </header>

      {activeTab === "upcoming" ? (
        calendar ? (
          <Upcoming calendar={calendar} />
        ) : null
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
            <HugeiconsIcon icon={Search01Icon} className="size-4" /> Explore
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

