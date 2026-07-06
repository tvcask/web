import Link from "next/link";
import { Plus } from "lucide-react";
import { addTitleAction } from "@/app/actions";
import { MediaRail } from "@/components/titles/media-rail";
import { Poster } from "@/components/titles/poster";
import { SearchBox } from "@/components/titles/search-box";
import { getDiscover, getLibrary, searchTitles } from "@/lib/data";

export default async function ExplorePage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const returnTo = query ? `/app/explore?q=${encodeURIComponent(query)}` : "/app/explore";

  const [results, sections, library] = await Promise.all([
    query ? searchTitles(query) : Promise.resolve([]),
    query ? Promise.resolve([]) : getDiscover(),
    getLibrary()
  ]);
  const trackedTitleIds = library.map((item) => item.titleId);

  return (
    <div className="mx-auto max-w-[1300px] space-y-7">
      <SearchBox initialQuery={query} />

      {!query ? (
        <div className="space-y-7">
          {sections.map((section) => (
            <MediaRail
              key={section.title}
              title={section.title}
              items={section.items}
              trackedTitleIds={trackedTitleIds}
              returnTo="/app/explore"
            />
          ))}
        </div>
      ) : results.length === 0 ? (
        <p className="surface rounded-[14px] p-6 text-white/50">No results for “{query}”.</p>
      ) : (
        <div className="grid grid-cols-3 gap-3.5 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
          {results.map((title) => {
            const href = `/app/titles/${title.id}?returnTo=${encodeURIComponent(returnTo)}`;
            const tracked = trackedTitleIds.includes(title.id);
            return (
              <div key={title.id} className="relative">
                <Link href={href} className="block overflow-hidden rounded-[12px] lift">
                  <Poster src={title.posterUrl} title={title.title} className="rounded-[12px]" />
                </Link>
                {tracked ? null : (
                  <form action={addTitleAction} className="absolute right-2 top-2">
                    <input type="hidden" name="payload" value={JSON.stringify({ title, status: "watchlist", favorite: false })} />
                    <input type="hidden" name="returnTo" value={returnTo} />
                    <button
                      className="cask-focus grid size-[30px] place-items-center rounded-[9px] bg-black/45"
                      style={{ color: "var(--accent-text)", boxShadow: "inset 0 0 0 1.5px var(--accent)" }}
                      aria-label={`Add ${title.title}`}
                    >
                      <Plus className="size-[15px]" />
                    </button>
                  </form>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
