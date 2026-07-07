import Link from "next/link";
import { ChevronRight, Heart, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Poster } from "@/components/titles/poster";
import { getCurrentUser } from "@/lib/auth/session";
import { Avatar } from "@/components/ui/avatar";
import { getLibrary, getLibraryPage, getStats } from "@/lib/data";

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
  const [user, stats, showsPage, moviesPage, favorites] = await Promise.all([
    getCurrentUser(),
    getStats(),
    getLibraryPage({ type: "show", limit: 40 }),
    getLibraryPage({ type: "movie", limit: 40 }),
    getLibrary({ favorite: true, limit: 40 })
  ]);

  const displayName = user?.name || user?.email?.split("@")[0] || "you";
  const allShows = showsPage.items;
  const allMovies = moviesPage.items;
  const favShows = favorites.filter((item) => item.title.type !== "movie");
  const favMovies = favorites.filter((item) => item.title.type === "movie");
  const showCount = showsPage.total;
  const movieCount = moviesPage.total;
  const hasLibrary = showsPage.total + moviesPage.total > 0;

  const statTiles = [
    { label: "TV time", value: duration(stats.tvTimeMinutes), accent: false },
    { label: "Episodes", value: stats.episodesWatched.toLocaleString(), accent: false },
    { label: "Movie time", value: duration(stats.movieTimeMinutes), accent: false },
    { label: "Completed", value: String(stats.completedTitles), accent: true }
  ];

  return (
    <div className="mx-auto max-w-[1300px] space-y-7">
      <section className="relative overflow-hidden rounded-[18px]" style={{ background: "linear-gradient(120deg,#2a2016,#14110d 52%,#3a2418)" }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <Link
          href="/app/settings"
          aria-label="Settings"
          className="absolute right-4 top-4 z-10 grid size-9 place-items-center rounded-full bg-black/40 text-white"
        >
          <Settings className="size-[18px]" />
        </Link>
        <div className="relative flex flex-col gap-4 px-5 pb-5 pt-16 sm:flex-row sm:items-end sm:px-6 sm:pt-24">
          <div className="flex min-w-0 flex-1 items-end gap-4">
            <Avatar src={user?.avatarUrl} size={78} className="shrink-0 ring-[3px] ring-white/90" />
            <div className="min-w-0 flex-1">
              <p className="display truncate text-[22px] leading-tight text-white sm:text-[26px]">{displayName}</p>
              {user?.username ? <p className="truncate text-sm font-semibold text-white/50">@{user.username}</p> : null}
              <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[13px] font-semibold text-white/70">
                <span><b className="text-white">{showCount}</b> Shows</span>
                <span><b className="text-white">{movieCount}</b> Movies</span>
              </div>
            </div>
          </div>
          <Button asChild variant="secondary" className="w-full border-white/50 sm:w-auto sm:shrink-0">
            <Link href="/app/profile/edit">Edit profile</Link>
          </Button>
        </div>
      </section>

      <section className="surface grid grid-cols-2 items-center gap-4 rounded-[14px] px-5 py-4 sm:grid-cols-4">
        {statTiles.map((tile) => (
          <div key={tile.label}>
            <p className="eyebrow">{tile.label}</p>
            <p className="display mt-2 text-[22px]" style={{ color: tile.accent ? "var(--accent-text)" : "#fff" }}>
              {tile.value}
            </p>
          </div>
        ))}
      </section>

      {allShows.length > 0 ? <Rail title="Shows" href="/app/shows" items={allShows.map((i) => i.title)} /> : null}
      {favShows.length > 0 ? <Rail title="Favorite shows" heart items={favShows.map((i) => i.title)} /> : null}
      {allMovies.length > 0 ? <Rail title="Movies" href="/app/movies" items={allMovies.map((i) => i.title)} /> : null}
      {favMovies.length > 0 ? <Rail title="Favorite movies" heart items={favMovies.map((i) => i.title)} /> : null}

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
        {heart ? <Heart className="size-4 fill-current" style={{ color: "var(--accent-text)" }} aria-hidden /> : null}
        <h2 className="display text-lg text-white">{title}</h2>
        {href ? (
          <Link href={href} className="ml-auto text-white/40 transition hover:text-white" aria-label={`All ${title}`}>
            <ChevronRight className="size-5" />
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
