import Link from "next/link";
import { Search } from "lucide-react";
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
  const activeView = view === "list" ? "list" : "grid";
  const status = activeTab === "watched" ? "completed" : "watchlist,watching";

  const { items, total } = await getLibraryPage({ type: "movie", status, limit: 40 });
  const returnTo = `/app/movies?tab=${activeTab}&view=${activeView}`;

  return (
    <div className="mx-auto max-w-[1300px]">
      <header className="mb-6 flex items-center gap-2.5 sm:gap-4">
        <h1 className="display shrink-0 text-xl text-white sm:text-2xl">Movies</h1>
        <TabsNav tabs={tabs} active={activeTab} base="/app/movies" />
        {total > 0 ? (
          <div className="ml-auto shrink-0">
            <ViewToggle
              view={activeView}
              listHref={`/app/movies?tab=${activeTab}&view=list`}
              gridHref={`/app/movies?tab=${activeTab}&view=grid`}
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
            <Search className="size-4" /> Explore
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
