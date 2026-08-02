"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { FeedCard } from "@/components/social/feed-card";
import { useFeed } from "@/lib/query/social";
import type { FeedPage } from "@/lib/social";

export function FeedList({ initial, trackedTitleIds }: { initial: FeedPage; trackedTitleIds: string[] }) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useFeed(initial);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = sentinel.current;
    if (!node || !hasNextPage) {
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting && !isFetchingNextPage) {
        void fetchNextPage();
      }
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const items = data?.pages.flatMap((page) => page.items) ?? [];

  // A feed with nobody in it is the main way this feature dies, so the empty
  // state is a route into finding people rather than a sentence.
  if (items.length === 0) {
    return (
      <div className="surface rounded-[16px] p-10 text-center">
        <p className="display text-lg text-white">Nothing here yet</p>
        <p className="mx-auto mt-2 max-w-[38ch] text-sm text-white/50">
          Follow a few people to see what they watch.
        </p>
        <Link
          href="/app/people"
          className="mt-5 inline-flex h-10 items-center rounded-full bg-[var(--accent)] px-5 text-[13px] font-bold text-[var(--on-accent)] transition hover:opacity-90"
        >
          Find people
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* A single column even on desktop. A feed is something you scroll down,
          and two columns of wide cards reads as a gallery again. */}
      <div className="mx-auto max-w-[640px] space-y-5">
        {items.map((item) => (
          <FeedCard
            key={item.id}
            item={item}
            returnTo="/app/explore?tab=feed"
            tracked={trackedTitleIds.includes(item.title.id)}
          />
        ))}
      </div>
      <div ref={sentinel} aria-hidden className="h-px" />
    </>
  );
}
