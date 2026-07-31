"use client";

import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { FollowButton } from "@/components/social/follow-button";
import type { UserCard } from "@/lib/social";

// One person in a list: search results, followers, following. The row is the
// link and the follow button sits outside it, so tapping Follow never navigates.
export function UserRow({ user, contextHandle }: { user: UserCard; contextHandle?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-[14px] px-3 py-2.5 transition-colors hover:bg-white/[0.04]">
      <Link href={`/app/u/${user.username}`} className="flex min-w-0 flex-1 items-center gap-3">
        <Avatar src={user.avatarUrl} name={user.name} size={44} />
        <span className="min-w-0">
          <span className="block truncate font-bold text-white">{user.name || user.username}</span>
          <span className="block truncate text-[13px] font-semibold text-white/45">@{user.username}</span>
        </span>
      </Link>
      <FollowButton user={user} contextHandle={contextHandle} />
    </div>
  );
}
