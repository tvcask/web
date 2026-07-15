import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon } from '@hugeicons/core-free-icons';
import Link from "next/link";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import { TabsNav } from "@/components/ui/tabs-nav";
import { ViewToggle } from "@/components/ui/view-toggle";
import { MediaRail } from "@/components/titles/media-rail";
import { InfiniteLibrary } from "@/components/titles/infinite-library";
import { getDiscover, getLibraryPage } from "@/lib/data";

const tabs = [
  { value: "watchlist", label: "Watch list" },
  { value: "watched", label: "Watched" }
];

export default async function MoviesPage({ searchParams }: { searchParams: Promise<{ tab?: string; view?: string }> }) {
  const { tab, view } = await searchParams;
  const activeTab = tab === "watched" ? "watched" : "watchlist";
  const savedView = (await cookies()).get("tvcask-movies-view")?.value;
  const activeView = view === "grid" || view === "list"
    ? view
    : savedView === "list" ? "list" : "grid";
  const status = activeTab === "watched" ? "completed" : "watchlist,watching";

  const { items, total } = await getLibraryPage({ type: "movie", status, limit: 40 });
  const returnTo = `/app/movies?tab=${activeTab}&view=${activeView}`;

  return (
    <div className="mx-auto max-w-[1300px]">
      {/* Pinned under the top nav so the filters stay reachable while the
          infinite list scrolls. -mt/pt swallow main's top padding so cards
          can't peek through the gap when stuck. */}
      <header className="sticky top-16 z-20 -mx-5 -mt-8 mb-6 flex items-center gap-2.5 border-b border-white/[0.06] bg-[#0d0c0b]/95 px-5 pb-3 pt-6 backdrop-blur-xl sm:-mx-8 sm:gap-4 sm:px-8">
        {/* The nav pill already names the page; a visible title would repeat it. */}
        <h1 className="sr-only">Movies</h1>
        <TabsNav tabs={tabs} active={activeTab} base="/app/movies" />
        {total > 0 ? (
          <div className="ml-auto shrink-0">
            <ViewToggle
              view={activeView}
              listHref={`/app/movies?tab=${activeTab}&view=list`}
              gridHref={`/app/movies?tab=${activeTab}&view=grid`}
              preference="movies"
            />
          </div>
        ) : null}
      </header>

      {total === 0 ? (
        activeTab === "watched" ? (
          <p className="surface rounded-[14px] p-6 text-white/50">Nothing watched yet.</p>
        ) : (
          <EmptyMovies />
        )
      ) : (
        <InfiniteLibrary key={status} type="movie" view={activeView} status={status} initial={items} total={total} returnTo={returnTo} />
      )}
    </div>
  );
}

async function EmptyMovies() {
  const sections = await getDiscover();
  const movies = sections.find((section) => section.items.some((item) => item.type === "movie"));

  return (
    <div className="space-y-8">
      <div className="surface rounded-[16px] p-8">
        <h2 className="display text-xl text-white">No movies yet.</h2>
        <p className="mt-2 max-w-md text-white/50">Add movies from Explore to start tracking.</p>
        <Button asChild className="mt-5">
          <Link href="/app/explore">
            <HugeiconsIcon icon={Search01Icon} className="size-4" /> Explore
          </Link>
        </Button>
      </div>
      {movies ? (
        <MediaRail
          title="Popular right now"
          items={movies.items.filter((item) => item.type === "movie").slice(0, 12)}
          returnTo="/app/movies"
        />
      ) : null}
    </div>
  );
}
