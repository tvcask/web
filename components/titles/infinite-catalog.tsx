"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { AddToLibraryButton } from "@/components/titles/add-to-library-button";
import { Poster } from "@/components/titles/poster";
import { apiGet } from "@/lib/query/client";
import { queryKeys } from "@/lib/query/keys";
import type { Title } from "@/lib/services/types";

type CatalogPage = { items: Title[]; hasMore: boolean };

export function InfiniteCatalog({
  kind,
  initial,
  hasMore,
  trackedIds
}: {
  kind: string;
  initial: Title[];
  hasMore: boolean;
  trackedIds: string[];
}) {
  const tracked = new Set(trackedIds);
  const returnTo = `/app/browse/${kind}`;

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: queryKeys.catalog(kind),
    queryFn: ({ pageParam }) =>
      apiGet<CatalogPage>(`/api/v1/titles/collection?kind=${encodeURIComponent(kind)}&page=${pageParam}`),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore && lastPage.items.length > 0 ? allPages.length + 1 : undefined,
    initialData: { pageParams: [1], pages: [{ items: initial, hasMore }] }
  });

  // Flatten pages and drop any titles the API repeats across pages.
  const seen = new Set<string>();
  const items = data.pages
    .flatMap((page) => page.items)
    .filter((title) => (seen.has(title.id) ? false : (seen.add(title.id), true)));

  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) {
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "700px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <>
      <div className="grid grid-cols-3 gap-3.5 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
        {items.map((title) => (
          <div key={title.id} className="relative">
            <Link
              href={`/app/titles/${title.id}?returnTo=${encodeURIComponent(returnTo)}`}
              className="block overflow-hidden rounded-[12px] lift"
            >
              <Poster src={title.posterUrl} title={title.title} className="rounded-[12px]" />
            </Link>
            <div className="absolute right-2 top-2">
              <AddToLibraryButton titleId={title.id} title={title.title} tracked={tracked.has(title.id)} />
            </div>
          </div>
        ))}
      </div>
      {hasNextPage ? <div ref={sentinelRef} className="h-12" /> : null}
      {isFetchingNextPage ? (
        <div className="mt-4 flex justify-center">
          <Loader2 className="size-5 animate-spin text-white/40" />
        </div>
      ) : null}
    </>
  );
}
