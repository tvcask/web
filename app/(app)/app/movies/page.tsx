import Link from "next/link";
import { Check, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TabsNav } from "@/components/ui/tabs-nav";
import { ViewToggle } from "@/components/ui/view-toggle";
import { updateTitleStatusAction } from "@/app/actions";
import { LibraryGrid } from "@/components/titles/library-grid";
import { MediaRail } from "@/components/titles/media-rail";
import { Poster } from "@/components/titles/poster";
import { getDiscover, getLibrary } from "@/lib/data";

const tabs = [
  { value: "watchlist", label: "Watch list" },
  { value: "watched", label: "Watched" }
];

export default async function MoviesPage({ searchParams }: { searchParams: Promise<{ tab?: string; view?: string }> }) {
  const { tab, view } = await searchParams;
  const activeTab = tab === "watched" ? "watched" : "watchlist";
  const activeView = view === "list" ? "list" : "grid";

  const movies = await getLibrary("movie");
  const visible =
    activeTab === "watched"
      ? movies.filter((item) => item.status === "completed")
      : movies.filter((item) => item.status === "watchlist" || item.status === "watching");

  const returnTo = `/app/movies?tab=${activeTab}&view=${activeView}`;

  return (
    <div className="mx-auto max-w-[1300px]">
      <header className="mb-6 flex items-center gap-4">
        <h1 className="display text-2xl text-white">Movies</h1>
        <TabsNav tabs={tabs} active={activeTab} base="/app/movies" />
        {movies.length > 0 ? (
          <ViewToggle
            view={activeView}
            listHref={`/app/movies?tab=${activeTab}&view=list`}
            gridHref={`/app/movies?tab=${activeTab}&view=grid`}
          />
        ) : null}
      </header>

      {movies.length === 0 ? (
        <EmptyMovies />
      ) : visible.length === 0 ? (
        <p className="surface rounded-[14px] p-6 text-white/50">Nothing here yet.</p>
      ) : activeView === "list" ? (
        <div className="grid gap-x-6 gap-y-2.5 md:grid-cols-2">
          {visible.map((item) => (
            <div key={item.id} className="surface flex items-center gap-3.5 rounded-[14px] p-3">
              <Link href={`/app/titles/${item.title.id}?returnTo=${encodeURIComponent(returnTo)}`} className="w-12 shrink-0 overflow-hidden rounded-[8px]">
                <Poster src={item.title.posterUrl} title={item.title.title} className="rounded-[8px]" />
              </Link>
              <Link href={`/app/titles/${item.title.id}?returnTo=${encodeURIComponent(returnTo)}`} className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-bold text-white">{item.title.title}</p>
                <p className="mt-0.5 text-[12.5px] font-medium text-white/50">{item.title.year ?? "Movie"}</p>
              </Link>
              {item.status === "completed" ? (
                <span className="grid size-8 shrink-0 place-items-center rounded-full" style={{ background: "var(--accent)", color: "var(--on-accent)" }}>
                  <Check className="size-4" />
                </span>
              ) : (
                <form action={updateTitleStatusAction}>
                  <input type="hidden" name="titleId" value={item.title.id} />
                  <input type="hidden" name="status" value="completed" />
                  <input type="hidden" name="returnTo" value={returnTo} />
                  <button
                    className="cask-focus grid size-8 shrink-0 place-items-center rounded-full text-transparent transition hover:text-[color:var(--accent-text)]"
                    style={{ boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.25)" }}
                    aria-label={`Mark ${item.title.title} watched`}
                  >
                    <Check className="size-4" />
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      ) : (
        <LibraryGrid items={visible} returnTo={returnTo} />
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
