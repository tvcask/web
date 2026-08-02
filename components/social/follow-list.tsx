"use client";

import { useEffect, useRef } from "react";
import { UserRow } from "@/components/social/user-row";
import { useFollowList } from "@/lib/query/social";
import type { FollowSide, UserCard, UserPage } from "@/lib/social";

// Your own following list is the follow edge, so unfollowing has to take the
// row with it. Leaving a row that says Follow contradicts the count above it.
// Everywhere else the row stays and only the button flips, which is what makes
// an accidental click undoable.
export function visibleFollowRows(users: UserCard[], side: FollowSide, isSelf: boolean) {
  return isSelf && side === "following" ? users.filter((user) => user.viewerFollows) : users;
}

export function FollowList({
  handle,
  side,
  initial,
  isSelf = false
}: {
  handle: string;
  side: FollowSide;
  initial: UserPage;
  /** Whether the list being viewed belongs to the signed-in viewer. */
  isSelf?: boolean;
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

  const users = visibleFollowRows(data?.pages.flatMap((page) => page.items) ?? [], side, isSelf);

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
        <UserRow key={user.id} user={user} />
      ))}
      <div ref={sentinel} aria-hidden className="h-px" />
    </div>
  );
}
