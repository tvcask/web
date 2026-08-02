import Link from "next/link";
import { notFound } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { FollowList } from "@/components/social/follow-list";
import { getFollowList, getUserProfile, type FollowSide } from "@/lib/social";

// Shared by the followers and following routes: same shell, same first page
// fetched on the server, only the side differs.
export async function FollowPage({ handle, side }: { handle: string; side: FollowSide }) {
  const profile = await getUserProfile(handle);
  if (!profile) {
    notFound();
  }

  const initial = await getFollowList(handle, side);
  const total = side === "followers" ? profile.followerCount : profile.followingCount;
  // Your own profile is /app/profile; /app/u/<you> redirects there. Point Back
  // at the real destination rather than bouncing through a redirect.
  const backHref = profile.isSelf ? "/app/profile" : `/app/u/${profile.username}`;

  return (
    <div className="mx-auto max-w-2xl space-y-5 pt-1">
      <div className="flex items-center gap-3">
        <Link
          href={backHref}
          aria-label="Back to profile"
          className="grid size-9 shrink-0 place-items-center rounded-full border border-white/12 text-white/70 transition hover:bg-white/5 hover:text-white"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="size-[18px]" />
        </Link>
        <div className="min-w-0">
          <h1 className="display truncate text-xl text-white">
            {side === "followers" ? "Followers" : "Following"}
          </h1>
          <p className="truncate text-[13px] font-semibold text-white/45">
            @{profile.username} · {total.toLocaleString()}
          </p>
        </div>
      </div>

      <FollowList handle={profile.username} side={side} initial={initial} isSelf={profile.isSelf} />
    </div>
  );
}
