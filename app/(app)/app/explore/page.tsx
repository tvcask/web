import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { addTitleAction } from "@/app/actions";
import { MediaRail } from "@/components/titles/media-rail";
import { Poster } from "@/components/titles/poster";
import { getUserId } from "@/lib/auth/session";
import { getDiscoverSections, searchTitles } from "@/lib/services/metadata-service";
import { getUserList } from "@/lib/services/tracking-service";

export default async function ExplorePage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const userId = await getUserId();
  const { q = "" } = await searchParams;
  const query = q.trim();
  const returnTo = query ? `/app/explore?q=${encodeURIComponent(query)}` : "/app/explore";

  const [results, sections, trackedTitleIds] = await Promise.all([
    query ? searchTitles(query) : Promise.resolve([]),
    query ? Promise.resolve([]) : getDiscoverSections(),
    getUserList(userId).then((list) => list.map((item) => item.titleId))
  ]);

  return (
    <div className="mx-auto max-w-[1300px] space-y-7">
      <form className="relative max-w-xl">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/40" />
        <input
          name="q"
          defaultValue={query}
          autoComplete="off"
          placeholder="Search shows, movies, anime, K-dramas"
          className="cask-focus h-12 w-full rounded-full bg-white/5 pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/40"
        />
      </form>

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
