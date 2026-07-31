"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Avatar } from "@/components/ui/avatar";
import { FollowButton } from "@/components/social/follow-button";
import { apiGet } from "@/lib/query/client";
import { queryKeys } from "@/lib/query/keys";
import type { UserProfile } from "@/lib/social";

function joined(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

// Seeded from the server render, then kept in the query cache so following
// someone moves the counts here without a refetch.
export function ProfileHeader({ profile: initial }: { profile: UserProfile }) {
  const { data } = useQuery({
    queryKey: queryKeys.userProfile(initial.username),
    queryFn: () => apiGet<UserProfile>(`/api/v1/users/${encodeURIComponent(initial.username)}`),
    initialData: initial
  });
  const profile = data ?? initial;

  return (
    <section className="surface rounded-[18px] p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <Avatar src={profile.avatarUrl} name={profile.name} size={72} />
        <div className="min-w-0 flex-1">
          <h1 className="display truncate text-[22px] leading-tight text-white sm:text-[26px]">
            {profile.name || profile.username}
          </h1>
          <p className="truncate text-sm font-semibold text-white/45">@{profile.username}</p>
          {profile.createdAt ? (
            <p className="mt-1 text-[13px] text-white/35">Joined {joined(profile.createdAt)}</p>
          ) : null}
        </div>
        {profile.isSelf ? (
          <Link
            href="/app/profile/edit"
            className="inline-flex h-10 shrink-0 items-center rounded-full border border-white/25 px-5 text-sm font-bold text-white transition hover:bg-white/[0.06]"
          >
            Edit profile
          </Link>
        ) : (
          <FollowButton user={profile} contextHandle={profile.username} size="lg" />
        )}
      </div>

      <div className="mt-5 flex items-center gap-6 border-t border-white/[0.08] pt-4">
        <CountLink
          href={`/app/u/${profile.username}/followers`}
          value={profile.followerCount}
          label={profile.followerCount === 1 ? "Follower" : "Followers"}
        />
        <CountLink
          href={`/app/u/${profile.username}/following`}
          value={profile.followingCount}
          label="Following"
        />
      </div>
    </section>
  );
}

function CountLink({ href, value, label }: { href: string; value: number; label: string }) {
  return (
    <Link href={href} className="group flex items-baseline gap-1.5">
      <span className="display text-lg text-white">{value.toLocaleString()}</span>
      <span className="text-[13px] font-semibold text-white/45 group-hover:text-white/70">{label}</span>
    </Link>
  );
}
