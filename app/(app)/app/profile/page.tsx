import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon, FavouriteIcon, PlusSignIcon, Settings01Icon, UserAdd01Icon } from '@hugeicons/core-free-icons';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Poster } from "@/components/titles/poster";
import { getCurrentUser } from "@/lib/auth/session";
import { ProfileHero, heroActionClass, heroControlClass } from "@/components/social/profile-hero";
import { getBadges, getLibrary, getLibraryPage, getList, getLists, getStats, type UserListDetail } from "@/lib/data";
import { getUserProfile } from "@/lib/social";

function duration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  if (months > 0) return `${months}m ${days % 30}d`;
  if (days > 0) return `${days}d ${hours % 24}h`;
  return `${hours}h`;
}

export default async function ProfilePage() {
  // Fetch shows and movies separately so neither type is starved by a shared
  // page cap, and pull favorites directly instead of filtering a capped list.
  const [user, stats, badges, showsPage, moviesPage, favorites, lists] = await Promise.all([
    getCurrentUser(),
    getStats(),
    getBadges(),
    getLibraryPage({ type: "show", limit: 40 }),
    getLibraryPage({ type: "movie", limit: 40 }),
    getLibrary({ favorite: true, limit: 40 }),
    getLists()
  ]);
  const listDetails = (await Promise.all(lists.slice(0, 6).map((list) => getList(list.id)))).filter(Boolean) as UserListDetail[];
  // Follow counts live on the social profile endpoint. An account without a
  // username has no profile to resolve, so the section simply does not render.
  const social = user?.username ? await getUserProfile(user.username) : null;

  const displayName = user?.name || user?.email?.split("@")[0] || "you";
  const allShows = showsPage.items;
  const allMovies = moviesPage.items;
  const favShows = favorites.filter((item) => item.title.type !== "movie");
  const favMovies = favorites.filter((item) => item.title.type === "movie");
  const showCount = showsPage.total;
  const movieCount = moviesPage.total;
  const hasLibrary = showsPage.total + moviesPage.total > 0;

  // Shows and movies moved here when the hero took on follower counts. They are
  // library totals, which is what this row is for.
  const statTiles = [
    { label: "Shows", value: showCount.toLocaleString(), accent: false },
    { label: "Movies", value: movieCount.toLocaleString(), accent: false },
    { label: "Episodes", value: stats.episodesWatched.toLocaleString(), accent: false },
    { label: "TV time", value: duration(stats.tvTimeMinutes), accent: false },
    { label: "Movie time", value: duration(stats.movieTimeMinutes), accent: false },
    { label: "Completed", value: String(stats.completedTitles), accent: true }
  ];

  return (
    <div className="mx-auto max-w-[1300px] space-y-7">
      <ProfileHero
        name={displayName}
        username={user?.username}
        avatarUrl={user?.avatarUrl}
        level={badges.level}
        followerCount={social?.followerCount}
        followingCount={social?.followingCount}
        action={
          <Link href="/app/profile/edit" className={heroActionClass}>
            Edit profile
          </Link>
        }
        controls={
          <>
            <Link href="/app/people" aria-label="Find people" className={heroControlClass}>
              <HugeiconsIcon icon={UserAdd01Icon} className="size-[18px]" />
            </Link>
            <Link href="/app/settings" aria-label="Settings" className={heroControlClass}>
              <HugeiconsIcon icon={Settings01Icon} className="size-[18px]" />
            </Link>
          </>
        }
      />

      <Link
        href="/app/profile/stats"
        className="group surface block rounded-[16px] px-5 py-4 transition-colors hover:border-white/[0.14]"
      >
        <div className="flex items-center gap-3">
          <div className="grid min-w-0 flex-1 grid-cols-3 gap-y-4 sm:grid-cols-6 sm:gap-y-0">
            {statTiles.map((tile, i) => (
              <div key={tile.label} className={i > 0 ? "sm:border-l sm:border-white/[0.08] sm:pl-5" : ""}>
                <p className="eyebrow">{tile.label}</p>
                <p className="display mt-1 text-xl" style={{ color: tile.accent ? "var(--accent-text)" : "#fff" }}>
                  {tile.value}
                </p>
              </div>
            ))}
          </div>
          <HugeiconsIcon icon={ArrowRight01Icon} className="size-5 shrink-0 text-white/35 transition-transform group-hover:translate-x-0.5 group-hover:text-white/60" />
        </div>
      </Link>

      {allShows.length > 0 ? <Rail title="Shows" href="/app/library?type=show" items={allShows.map((i) => i.title)} /> : null}
      {favShows.length > 0 ? (
        <Rail title="Favorite shows" heart href="/app/library?type=show&favorite=true" items={favShows.map((i) => i.title)} />
      ) : null}
      {allMovies.length > 0 ? <Rail title="Movies" href="/app/library?type=movie" items={allMovies.map((i) => i.title)} /> : null}
      {favMovies.length > 0 ? (
        <Rail title="Favorite movies" heart href="/app/library?type=movie&favorite=true" items={favMovies.map((i) => i.title)} />
      ) : null}
      <ListsSection lists={listDetails} total={lists.length} />

      {!hasLibrary ? (
        <div className="surface rounded-[16px] p-8">
          <h2 className="display text-xl text-white">Your profile is empty.</h2>
          <p className="mt-2 max-w-md text-white/50">Track shows and movies to fill in your stats and favorites.</p>
          <Button asChild className="mt-5">
            <Link href="/app/explore">Explore titles</Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function ListsSection({ lists, total }: { lists: UserListDetail[]; total: number }) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <h2 className="display text-lg text-white">Lists</h2>
        <span className="rounded-full bg-white/8 px-2 py-0.5 text-[11px] font-bold text-white/45">{total}</span>
        <Link
          href="/app/lists/new"
          className="ml-auto grid size-8 place-items-center rounded-full border border-white/12 text-white/70 transition hover:bg-white/5 hover:text-white"
          aria-label="Create list"
        >
          <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
        </Link>
      </div>

      {lists.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2">
          {lists.map((list) => (
            <Link key={list.id} href={`/app/lists/${list.id}`} className="surface rounded-[14px] p-4 transition hover:bg-white/[0.04]">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-white">{list.name}</p>
                  <p className="mt-1 text-xs font-semibold text-white/40">{(list.itemCount ?? list.items.length).toLocaleString()} titles</p>
                </div>
                <HugeiconsIcon icon={ArrowRight01Icon} className="mt-0.5 size-5 shrink-0 text-white/30" />
              </div>
              {list.items.length > 0 ? (
                <div className="mt-3 flex -space-x-3">
                  {list.items.slice(0, 5).map((item) => (
                    <div key={item.id} className="w-[46px] overflow-hidden rounded-[8px] ring-2 ring-[#11100e]">
                      <Poster src={item.title.posterUrl} title={item.title.title} className="rounded-[8px]" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-white/45">No titles yet.</p>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="surface rounded-[14px] p-5">
          <p className="text-sm text-white/55">Create custom lists for themes, rankings, or watch plans.</p>
          <Button asChild className="mt-4">
            <Link href="/app/lists/new">Create list</Link>
          </Button>
        </div>
      )}
    </section>
  );
}

function Rail({
  title,
  items,
  heart = false,
  href
}: {
  title: string;
  items: { id: string; title: string; posterUrl?: string | null }[];
  heart?: boolean;
  href?: string;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        {heart ? <HugeiconsIcon icon={FavouriteIcon} className="size-4 fill-current" style={{ color: "var(--accent-text)" }} aria-hidden /> : null}
        <h2 className="display text-lg text-white">{title}</h2>
        {href ? (
          <Link href={href} className="ml-auto text-white/40 transition hover:text-white" aria-label={`All ${title}`}>
            <HugeiconsIcon icon={ArrowRight01Icon} className="size-5" />
          </Link>
        ) : null}
      </div>
      <div className="nos flex gap-3 overflow-x-auto pb-1">
        {items.map((item) => (
          <Link key={item.id} href={`/app/titles/${item.id}?returnTo=/app/profile`} className="w-[100px] shrink-0 overflow-hidden rounded-[12px] lift">
            <Poster src={item.posterUrl} title={item.title} className="rounded-[12px]" />
          </Link>
        ))}
      </div>
    </section>
  );
}
