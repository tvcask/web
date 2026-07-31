"use client";

import { useEffect, useRef } from "react";
import { UserRow } from "@/components/social/user-row";
import { useFollowList } from "@/lib/query/social";
import type { FollowSide, UserPage } from "@/lib/social";

export function FollowList({
  handle,
  side,
  initial
}: {
  handle: string;
  side: FollowSide;
  initial: UserPage;
}) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useFollowList(handle, side, initial);
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

  const users = data?.pages.flatMap((page) => page.items) ?? [];

  if (users.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-white/45">
        {side === "followers" ? "No followers yet." : "Not following anyone yet."}
      </p>
    );
  }

  return (
    <div className="-mx-3">
      {users.map((user) => (
        <UserRow key={user.id} user={user} contextHandle={handle} />
      ))}
      <div ref={sentinel} aria-hidden className="h-px" />
    </div>
  );
}
