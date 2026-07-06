import Link from "next/link";
import { Plus } from "lucide-react";
import { addTitleAction } from "@/app/actions";
import { MediaRail } from "@/components/titles/media-rail";
import { Poster } from "@/components/titles/poster";
import { getDiscover, getLibrary, searchTitles } from "@/lib/data";

export default async function ExplorePage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const returnTo = query ? `/app/explore?q=${encodeURIComponent(query)}` : "/app/explore";

  const [results, sections, library] = await Promise.all([
    query ? searchTitles(query) : Promise.resolve([]),
    query ? Promise.resolve([]) : getDiscover(),
    getLibrary({ limit: 100 })
  ]);
  const trackedTitleIds = library.map((item) => item.titleId);

  return (
    <div className="mx-auto max-w-[1300px] space-y-7">
      {!query ? (
        sections.some((s) => s.items.length > 0) ? (
          <div className="space-y-7">
            {sections
              .filter((section) => section.items.length > 0)
              .map((section) => (
                <MediaRail
                  key={section.title}
                  title={section.title}
                  items={section.items}
                  trackedTitleIds={trackedTitleIds}
                  returnTo="/app/explore"
                  seeAllHref={`/app/browse/${section.kind}`}
                />
              ))}
          </div>
        ) : (
          <div className="surface rounded-[16px] p-8 text-center">
            <p className="display text-lg text-white">Nothing to explore right now.</p>
            <p className="mt-2 text-sm text-white/50">
              Recommendations couldn&apos;t be loaded. Try searching for a title in the header.
            </p>
          </div>
        )
      ) : (
        <div className="space-y-5">
          <h1 className="display text-xl text-white">
            Results for <span style={{ color: "var(--accent-text)" }}>&ldquo;{query}&rdquo;</span>
          </h1>
          {results.length === 0 ? (
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
      )}
    </div>
  );
}
