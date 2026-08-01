import Link from "next/link";
import type { ReactNode } from "react";
import { Avatar } from "@/components/ui/avatar";

type Props = {
  name: string;
  username?: string;
  avatarUrl?: string;
  followerCount?: number;
  followingCount?: number;
  /** Level medallion on the avatar. Only your own profile exposes one today. */
  level?: number;
  /** Primary action: Edit profile on your own page, Follow on someone else's. */
  action?: ReactNode;
  /** Small circular controls in the top corner. */
  controls?: ReactNode;
};

// The one profile header, used for your own page and for anyone else's. Sharing
// it is the point: a profile you visit should look like the profile you own,
// not like a card bolted onto an empty screen.
export function ProfileHero({
  name,
  username,
  avatarUrl,
  followerCount,
  followingCount,
  level,
  action,
  controls
}: Props) {
  const counts = username && followerCount !== undefined && followingCount !== undefined;

  return (
    <section
      className="relative overflow-hidden rounded-[18px]"
      style={{ background: "linear-gradient(120deg,#2a2016,#14110d 52%,#3a2418)" }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      {controls ? <div className="absolute right-4 top-4 z-10 flex items-center gap-2">{controls}</div> : null}

      <div className="relative grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-4 px-5 pb-5 pt-20 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:px-6 sm:pt-24">
        <div className="relative shrink-0">
          <Avatar src={avatarUrl} name={name} size={78} className="ring-[3px] ring-white/90" />
          {level !== undefined ? (
            <Link
              href="/app/profile/badges"
              aria-label={`Level ${level}, see your progress`}
              className="absolute -bottom-1 -right-1 grid h-7 min-w-7 place-items-center rounded-full border-2 border-black px-1.5 text-[11px] font-extrabold transition hover:brightness-110"
              style={{ backgroundColor: "#ca9a65", color: "#000000" }}
            >
              {level}
            </Link>
          ) : null}
        </div>

        <div className="min-w-0">
          <p className="display truncate text-[22px] leading-tight text-white sm:text-[26px]">{name}</p>
          {username ? <p className="truncate text-sm font-semibold text-white/50">@{username}</p> : null}
          {counts ? (
            <div className="mt-2 flex items-center gap-4 text-[13px] font-semibold text-white/70">
              <Link href={`/app/u/${username}/followers`} className="transition hover:text-white">
                <b className="text-white">{followerCount.toLocaleString()}</b>{" "}
                {followerCount === 1 ? "Follower" : "Followers"}
              </Link>
              <Link href={`/app/u/${username}/following`} className="transition hover:text-white">
                <b className="text-white">{followingCount.toLocaleString()}</b> Following
              </Link>
            </div>
          ) : null}
        </div>

        {action ? (
          <>
            <div className="hidden self-end sm:block">{action}</div>
            <div className="col-span-2 sm:hidden">{action}</div>
          </>
        ) : null}
      </div>
    </section>
  );
}

// Shared shape for the hero's primary action, so Edit profile and Follow are
// the same size and weight in the same slot.
export const heroActionClass =
  "inline-flex h-10 w-full items-center justify-center rounded-full border border-white/50 px-5 text-sm font-bold text-white transition hover:bg-white/[0.06] sm:w-auto";

export const heroControlClass =
  "grid size-9 place-items-center rounded-full bg-black/40 text-white transition hover:bg-black/60";
