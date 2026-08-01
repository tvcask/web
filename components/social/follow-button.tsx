"use client";

import { useToggleFollow } from "@/lib/query/social";
import type { UserCard } from "@/lib/social";
import { cn } from "@/lib/utils";

export function FollowButton({ user, size = "sm" }: { user: UserCard; size?: "sm" | "lg" }) {
  const toggle = useToggleFollow();
  const following = user.viewerFollows;

  return (
    <button
      type="button"
      onClick={() => toggle.mutate({ user, following: !following })}
      aria-label={following ? `Unfollow ${user.username}` : `Follow ${user.username}`}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-bold transition",
        // The large variant sits in the hero's action slot, so it matches the
        // width behaviour of Edit profile on the profile you own.
        size === "lg" ? "h-10 w-full px-6 text-sm sm:w-auto" : "h-8 px-4 text-[13px]",
        // Follow is the action on offer, so it gets the filled treatment.
        // Already-following recedes to an outline that reads as undoable.
        following
          ? "border border-white/25 text-white hover:border-white/40 hover:bg-white/[0.06]"
          : "bg-[color:var(--accent-text)] text-black hover:brightness-110"
      )}
    >
      {following ? "Following" : "Follow"}
    </button>
  );
}
