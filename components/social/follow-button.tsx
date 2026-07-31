"use client";

import { useToggleFollow } from "@/lib/query/social";
import type { UserCard } from "@/lib/social";
import { cn } from "@/lib/utils";

// `contextHandle` is the profile the button is being rendered on, so the
// viewer's own following count can move at the same time.
export function FollowButton({
  user,
  contextHandle,
  size = "sm"
}: {
  user: UserCard;
  contextHandle?: string;
  size?: "sm" | "lg";
}) {
  const toggle = useToggleFollow(contextHandle);
  const following = user.viewerFollows;

  return (
    <button
      type="button"
      onClick={() => toggle.mutate({ user, following: !following })}
      // Following is the loud state, so it gets the filled treatment and
      // following-already recedes to an outline the user can click to undo.
      aria-label={following ? `Unfollow ${user.username}` : `Follow ${user.username}`}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-bold transition",
        size === "lg" ? "h-10 px-6 text-sm" : "h-8 px-4 text-[13px]",
        following
          ? "border border-white/25 text-white hover:border-white/40 hover:bg-white/[0.06]"
          : "bg-[color:var(--accent-text)] text-black hover:brightness-110"
      )}
    >
      {following ? "Following" : "Follow"}
    </button>
  );
}
