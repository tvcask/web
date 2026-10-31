import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon, FavouriteIcon, PlusSignIcon, Settings01Icon, UserAdd01Icon, ViewIcon } from '@hugeicons/core-free-icons';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TitleRail } from "@/components/titles/title-rail";
import { ListCard } from "@/components/lists/list-card";
import { ShareButton, type ShareBlocker } from "@/components/public-page/share-button";
import { enablePublicPageAction } from "@/app/actions";
import { publicPagePath } from "@/lib/public-page-paths";
import { getCurrentUser } from "@/lib/auth/session";
import { ProfileHero, heroActionClass, heroControlClass } from "@/components/social/profile-hero";
import { getBadges, getLibrary, getLibraryPage, getList, getLists, getSettings, getStats, type UserListDetail } from "@/lib/data";
import { duration } from "@/lib/dates";

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

  const settings = await getSettings();
  const shareBlocker: ShareBlocker | undefined = settings.privateProfile
    ? {
        title: "Your profile is private",
        message: "A private profile stays hidden from everyone, including on your public page. Turn it off in settings to share it.",
        href: "/app/settings",
        hrefLabel: "Privacy settings"
      }
    : settings.publicPage
      ? undefined
      : {
          title: "Turn on your public page?",
          message: "Anyone with the link will be able to see your name, bio, links and public lists. Never your history or stats.",
          confirmLabel: "Turn on and share",
          confirm: enablePublicPageAction
        };

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
        followerCount={user?.followerCount}
        followingCount={user?.followingCount}
        action={
          <Link href="/app/profile/edit" className={heroActionClass}>
            Edit profile
          </Link>
        }
        controls={
          <>
            {user?.username ? (
              <Link
                href={`/app/u/${user.username}?preview=1`}
                aria-label="See your profile as others see it"
                title="See your profile as others see it"
                className={heroControlClass}
              >
                <HugeiconsIcon icon={ViewIcon} className="size-[18px]" />
              </Link>
            ) : null}
            {user?.username ? (
              <ShareButton
                path={publicPagePath(user.username)}
                title={displayName}
                iconOnly
                className={heroControlClass}
                blocker={shareBlocker}
              />
            ) : null}
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

      {allShows.length > 0 ? <TitleRail returnTo="/app/profile" title="Shows" href="/app/library?type=show" items={allShows.map((i) => i.title)} /> : null}
      {favShows.length > 0 ? (
        <TitleRail returnTo="/app/profile" title="Favorite shows" heart href="/app/library?type=show&favorite=true" items={favShows.map((i) => i.title)} />
      ) : null}
      {allMovies.length > 0 ? <TitleRail returnTo="/app/profile" title="Movies" href="/app/library?type=movie" items={allMovies.map((i) => i.title)} /> : null}
      {favMovies.length > 0 ? (
        <TitleRail returnTo="/app/profile" title="Favorite movies" heart href="/app/library?type=movie&favorite=true" items={favMovies.map((i) => i.title)} />
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
        {total > lists.length ? (
          <Link href="/app/lists" className="text-white/40 transition hover:text-white" aria-label="All lists">
            <HugeiconsIcon icon={ArrowRight01Icon} className="size-5" />
          </Link>
        ) : null}
      </div>

      {lists.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2">
          {lists.map((list) => <ListCard key={list.id} list={list} />)}
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

