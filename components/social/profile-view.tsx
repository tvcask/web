"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { FollowButton } from "@/components/social/follow-button";
import { ProfileHero } from "@/components/social/profile-hero";
import { TitleRail } from "@/components/titles/title-rail";
import { Poster } from "@/components/titles/poster";
import { apiGet } from "@/lib/query/client";
import { queryKeys } from "@/lib/query/keys";
import { duration } from "@/lib/dates";
import { emptyProfileStats, type UserProfile } from "@/lib/social";

// Someone else's profile, laid out as your own is. Seeded from the server
// render and kept in the query cache so following moves the counts here without
// a refetch.
export function ProfileView({ profile: initial, preview = false }: { profile: UserProfile; preview?: boolean }) {
  const { data } = useQuery({
    queryKey: queryKeys.userProfile(initial.username),
    queryFn: () => apiGet<UserProfile>(`/api/v1/users/${encodeURIComponent(initial.username)}`),
    initialData: initial,
    // Without this, React Query treats server-provided initialData as stale and
    // refetches on every mount, duplicating the render's own request.
    staleTime: 60_000
  });
  const profile = data ?? initial;
  const base = `/app/u/${profile.username}`;
  const stats = profile.stats ?? emptyProfileStats;
  const lists = profile.lists ?? [];

  const tiles = [
    { label: "Shows", value: stats.shows.toLocaleString(), accent: false },
    { label: "Movies", value: stats.movies.toLocaleString(), accent: false },
    { label: "Episodes", value: stats.episodesWatched.toLocaleString(), accent: false },
    { label: "TV time", value: duration(stats.tvTimeMinutes), accent: false },
    { label: "Movie time", value: duration(stats.movieTimeMinutes), accent: false },
    { label: "Completed", value: String(stats.completedTitles), accent: true }
  ];

  const hasLibrary = stats.shows + stats.movies > 0;

  return (
    <div className="mx-auto max-w-[1300px] space-y-7">
      {preview ? (
        <div className="flex flex-wrap items-center gap-3 rounded-[14px] border border-[color:var(--accent-text)]/25 bg-[color:var(--accent-text)]/[0.06] px-4 py-3">
          <p className="text-sm font-semibold text-white/80">
            This is your profile as other people see it.
          </p>
          <Link
            href="/app/profile"
            className="ml-auto text-sm font-bold text-[color:var(--accent-text)] hover:brightness-110"
          >
            Back to your profile
          </Link>
        </div>
      ) : null}

      <ProfileHero
        name={profile.name || profile.username}
        username={profile.username}
        avatarUrl={profile.avatarUrl}
        level={profile.level ?? 0}
        levelHref={`${base}/badges`}
        followerCount={profile.followerCount}
        followingCount={profile.followingCount}
        // You cannot follow yourself, so the preview has no action to offer.
        action={preview ? undefined : <FollowButton user={profile} size="lg" />}
      />

      <Link
        href={`${base}/stats`}
        className="group surface block rounded-[16px] px-5 py-4 transition-colors hover:border-white/[0.14]"
      >
        <div className="flex items-center gap-3">
          <div className="grid min-w-0 flex-1 grid-cols-3 gap-y-4 sm:grid-cols-6 sm:gap-y-0">
            {tiles.map((tile, i) => (
              <div key={tile.label} className={i > 0 ? "sm:border-l sm:border-white/[0.08] sm:pl-5" : ""}>
                <p className="eyebrow">{tile.label}</p>
                <p className="display mt-1 text-xl" style={{ color: tile.accent ? "var(--accent-text)" : "#fff" }}>
                  {tile.value}
                </p>
              </div>
            ))}
          </div>
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            className="size-5 shrink-0 text-white/35 transition-transform group-hover:translate-x-0.5 group-hover:text-white/60"
          />
        </div>
      </Link>

      <TitleRail title="Shows" items={profile.shows ?? []} href={`${base}/library?type=show`} returnTo={base} />
      <TitleRail
        title="Favorite shows"
        heart
        items={profile.favoriteShows ?? []}
        href={`${base}/library?type=show&favorite=true`}
        returnTo={base}
      />
      <TitleRail title="Movies" items={profile.movies ?? []} href={`${base}/library?type=movie`} returnTo={base} />
      <TitleRail
        title="Favorite movies"
        heart
        items={profile.favoriteMovies ?? []}
        href={`${base}/library?type=movie&favorite=true`}
        returnTo={base}
      />

      {lists.length > 0 ? (
        <section>
          <div className="mb-3 flex items-center gap-2">
            <h2 className="display text-lg text-white">Lists</h2>
            <span className="rounded-full bg-white/8 px-2 py-0.5 text-[11px] font-bold text-white/45">
              {lists.length}
            </span>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {lists.map((list) => (
              <Link
                key={list.id}
                href={`/app/lists/${list.id}`}
                className="surface rounded-[14px] p-4 transition hover:bg-white/[0.04]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-white">{list.name}</p>
                    <p className="mt-1 text-xs font-semibold text-white/40">
                      {list.itemCount.toLocaleString()} titles
                    </p>
                  </div>
                  <HugeiconsIcon icon={ArrowRight01Icon} className="mt-0.5 size-5 shrink-0 text-white/30" />
                </div>
                {(list.titles ?? []).length > 0 ? (
                  <div className="mt-3 flex -space-x-3">
                    {(list.titles ?? []).map((title) => (
                      <div key={title.id} className="w-[46px] overflow-hidden rounded-[8px] ring-2 ring-[#11100e]">
                        <Poster src={title.posterUrl} title={title.title} className="rounded-[8px]" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-white/45">No titles yet.</p>
                )}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {!hasLibrary ? (
        <div className="surface rounded-[16px] p-8">
          <h2 className="display text-xl text-white">Nothing here yet.</h2>
          <p className="mt-2 max-w-md text-white/50">
            {profile.name || profile.username} hasn&apos;t tracked any shows or movies.
          </p>
        </div>
      ) : null}
    </div>
  );
}
