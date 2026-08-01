"use client";

import { useQuery } from "@tanstack/react-query";
import { FollowButton } from "@/components/social/follow-button";
import { ProfileHero } from "@/components/social/profile-hero";
import { apiGet } from "@/lib/query/client";
import { queryKeys } from "@/lib/query/keys";
import type { UserProfile } from "@/lib/social";

// Seeded from the server render, then kept in the query cache so following
// someone moves the counts here without a refetch.
export function ProfileHeader({ profile: initial }: { profile: UserProfile }) {
  const { data } = useQuery({
    queryKey: queryKeys.userProfile(initial.username),
    queryFn: () => apiGet<UserProfile>(`/api/v1/users/${encodeURIComponent(initial.username)}`),
    initialData: initial,
    // Without this, React Query treats server-provided initialData as stale and
    // refetches the profile on every mount, duplicating the render's own fetch.
    staleTime: 60_000
  });
  const profile = data ?? initial;

  return (
    <ProfileHero
      name={profile.name || profile.username}
      username={profile.username}
      avatarUrl={profile.avatarUrl}
      followerCount={profile.followerCount}
      followingCount={profile.followingCount}
      action={profile.isSelf ? undefined : <FollowButton user={profile} size="lg" />}
    />
  );
}
