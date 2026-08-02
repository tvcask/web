import Link from "next/link";
import { AddToLibraryButton } from "@/components/titles/add-to-library-button";
import { MediaRail } from "@/components/titles/media-rail";
import { Poster } from "@/components/titles/poster";
import { SearchBox } from "@/components/titles/search-box";
import { FeedList } from "@/components/social/feed-list";
import { TabsNav } from "@/components/ui/tabs-nav";
import { getDiscover, getLibrary, searchTitles } from "@/lib/data";
import { getFeed } from "@/lib/social";

const tabs = [
  { value: "discover", label: "Discover" },
  { value: "following", label: "Following" }
];

export default async function ExplorePage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; tab?: string }>;
}) {
  const { q = "", tab } = await searchParams;
  const query = q.trim();
  const following = tab === "following";
  const returnTo = query
    ? `/app/explore?q=${encodeURIComponent(query)}`
    : following
      ? "/app/explore?tab=following"
      : "/app/explore";

  // Only the mode being rendered pays for its data. Searching overrides the
  // tabs, so a search fetches neither the rails nor the feed.
  const [results, sections, library, feed] = await Promise.all([
    query ? searchTitles(query) : Promise.resolve([]),
    query || following ? Promise.resolve([]) : getDiscover(),
    getLibrary({ limit: 100 }),
    query || !following ? Promise.resolve({ items: [] }) : getFeed()
  ]);
  const trackedTitleIds = library.map((item) => item.titleId);

  return (
    <div className="mx-auto max-w-[1300px] space-y-7">
      <div className="md:hidden">
        <SearchBox initialQuery={query} size="md" className="w-full" />
      </div>

      {query ? (
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
                return (
                  <div key={title.id} className="relative">
                    <Link href={href} className="block overflow-hidden rounded-[12px] lift">
                      <Poster src={title.posterUrl} title={title.title} className="rounded-[12px]" />
                    </Link>
                    <div className="absolute right-2 top-2">
                      <AddToLibraryButton
                        titleId={title.id}
                        title={title.title}
                        tracked={trackedTitleIds.includes(title.id)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-7">
          <TabsNav tabs={tabs} active={following ? "following" : "discover"} base="/app/explore" />

          {following ? (
            <FeedList initial={feed} trackedTitleIds={trackedTitleIds} />
          ) : sections.some((section) => section.items.length > 0) ? (
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
          )}
        </div>
      )}
    </div>
  );
}
