import { Check, Heart, Plus, Share2, X } from "lucide-react";
import {
  addTitleAction,
  markSeasonAction,
  removeTitleAction,
  toggleEpisodeWatchedAction,
  toggleFavoriteAction,
  updateTitleStatusAction
} from "@/app/actions";
import { getMyTitle, getTitleDetail } from "@/lib/data";
import type { Episode } from "@/lib/services/types";

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

export async function TitleDetail({ id }: { id: string }) {
  const detail = await getTitleDetail(id);
  if (!detail) {
    return <p className="p-10 text-white/60">Title not found.</p>;
  }

  const title = detail;
  const isMovie = title.type === "movie";
  const episodes: Episode[] = detail.episodes ?? [];

  const my = await getMyTitle(id);
  const userTitle = my.userTitle ?? null;
  const watchedKeys = new Set(my.watched);

  const meta = [title.year, isMovie ? "Movie" : "Series", title.genres[0]].filter(Boolean).join(" · ");
  // Count only watched episodes that exist in the ingested list, so progress
  // never exceeds the total.
  const watchedCount = episodes.filter((e) => watchedKeys.has(`${e.seasonNumber}-${e.episodeNumber}`)).length;
  const pct = episodes.length > 0 ? Math.min(100, Math.round((watchedCount / episodes.length) * 100)) : 0;

  const seasons = groupSeasons(episodes);
  const statuses = [
    { value: "watchlist", label: "Watch list" },
    { value: "watching", label: "Watching" },
    { value: "completed", label: isMovie ? "Watched" : "Completed" }
  ] as const;

  return (
    <div>
      {/* hero */}
      <div className="relative h-[280px] px-6 pt-6 sm:px-8">
        {title.backdropUrl ? (
          <img src={title.backdropUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0" style={{ background: seededGradient(title.title) }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-[#0a0a0c]/75 to-[#0a0a0c]" />
        <div className="relative flex h-full items-end gap-4">
          <div className="h-[168px] w-[112px] shrink-0 overflow-hidden rounded-[14px] ring-1 ring-white/10">
            {title.posterUrl ? (
              <img src={title.posterUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full" style={{ background: seededGradient(title.title) }} />
            )}
          </div>
          <div className="min-w-0 pb-1">
            <h1 className="display truncate text-3xl text-white sm:text-4xl">{title.title}</h1>
            <p className="mt-1.5 text-sm text-white/60">{meta}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6 px-6 pb-10 pt-5 sm:px-8">
        {/* primary actions */}
        <div className="flex items-center gap-3">
          {userTitle ? (
            <form action={removeTitleAction} className="group flex-1">
              <input type="hidden" name="titleId" value={title.id} />
              <button className="accent-fill flex h-[52px] w-full items-center justify-center gap-2 rounded-full text-[15px] font-extrabold">
                <Check className="size-5 group-hover:hidden" />
                <X className="hidden size-5 group-hover:block" />
                <span className="group-hover:hidden">Tracking</span>
                <span className="hidden group-hover:block">Untrack</span>
              </button>
            </form>
          ) : (
            <form action={addTitleAction} className="flex-1">
              <input
                type="hidden"
                name="payload"
                value={JSON.stringify({ title, status: isMovie ? "watchlist" : "watching", favorite: false })}
              />
              <button className="accent-fill flex h-[52px] w-full items-center justify-center gap-2 rounded-full text-[15px] font-extrabold">
                <Plus className="size-5" /> {isMovie ? "Add to watchlist" : "Track show"}
              </button>
            </form>
          )}

          <FavoriteButton titleId={title.id} favorite={Boolean(userTitle?.favorite)} disabled={!userTitle} />
          <button className="grid size-[52px] shrink-0 place-items-center rounded-full border border-white/12 text-white/80" aria-label="Share">
            <Share2 className="size-5" />
          </button>
        </div>

        {/* status pills */}
        {userTitle ? (
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <form key={status.value} action={updateTitleStatusAction}>
                <input type="hidden" name="titleId" value={title.id} />
                <input type="hidden" name="status" value={status.value} />
                <button
                  className={
                    userTitle.status === status.value
                      ? "accent-fill rounded-full px-4 py-2 text-[13px] font-bold"
                      : "rounded-full bg-white/5 px-4 py-2 text-[13px] font-bold text-white/70 hover:text-white"
                  }
                >
                  {status.label}
                </button>
              </form>
            ))}
          </div>
        ) : null}

        {/* progress */}
        {!isMovie && episodes.length > 0 ? (
          <div className="surface rounded-[14px] p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-white">Progress</span>
              <span className="font-semibold text-white/60">
                {watchedCount} / {episodes.length}
              </span>
            </div>
            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "var(--accent)" }} />
            </div>
          </div>
        ) : null}

        {/* about */}
        {title.overview ? (
          <div>
            <h2 className="display mb-2 text-base text-white">About</h2>
            <p className="text-[15px] leading-7 text-white/70">{title.overview}</p>
          </div>
        ) : null}

        {/* episodes */}
        {!isMovie ? (
          <div>
            <h2 className="display mb-3 text-base text-white">Episodes</h2>
            {seasons.length === 0 ? (
              <p className="surface rounded-[14px] p-5 text-white/50">Episode data isn&apos;t available yet.</p>
            ) : (
              <div className="space-y-5">
                {seasons.map(([seasonNumber, seasonEpisodes]) => {
                  const seasonWatched = seasonEpisodes.filter((e) => watchedKeys.has(`${e.seasonNumber}-${e.episodeNumber}`)).length;
                  const allWatched = seasonWatched === seasonEpisodes.length;
                  return (
                    <div key={seasonNumber}>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-bold text-white">Season {seasonNumber}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-white/45">
                            {seasonWatched}/{seasonEpisodes.length}
                          </span>
                          <form action={markSeasonAction}>
                            <input type="hidden" name="titleId" value={title.id} />
                            <input type="hidden" name="seasonNumber" value={seasonNumber} />
                            <input type="hidden" name="watched" value={String(allWatched)} />
                            <button
                              className="rounded-full bg-white/5 px-3 py-1 text-[11px] font-bold text-white/70 hover:text-white"
                              type="submit"
                            >
                              {allWatched ? "Clear season" : "Mark season"}
                            </button>
                          </form>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        {seasonEpisodes.map((episode) => {
                          const watched = watchedKeys.has(`${episode.seasonNumber}-${episode.episodeNumber}`);
                          return (
                            <div key={episode.id} className="flex items-center gap-3.5 border-b border-white/[0.06] py-2.5">
                              <div
                                className="h-[46px] w-[80px] shrink-0 overflow-hidden rounded-[7px]"
                                style={{ background: "linear-gradient(140deg,#2a2f3a,#14110d)" }}
                              />
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-white">
                                  E{pad(episode.episodeNumber)} · {episode.name ?? "TBA"}
                                </p>
                                <p className="mt-0.5 text-xs text-white/45">{episode.airDate ?? ""}</p>
                              </div>
                              <form action={toggleEpisodeWatchedAction}>
                                <input type="hidden" name="titleId" value={title.id} />
                                <input type="hidden" name="episodeId" value={episode.id} />
                                <input type="hidden" name="seasonNumber" value={episode.seasonNumber} />
                                <input type="hidden" name="episodeNumber" value={episode.episodeNumber} />
                                <input type="hidden" name="watched" value={String(watched)} />
                                <button
                                  className="grid size-7 shrink-0 place-items-center rounded-full transition"
                                  style={
                                    watched
                                      ? { background: "var(--accent)", color: "var(--on-accent)" }
                                      : { boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.22)", color: "transparent" }
                                  }
                                  aria-label={`Toggle S${pad(episode.seasonNumber)}E${pad(episode.episodeNumber)} watched`}
                                >
                                  <Check className="size-3.5" />
                                </button>
                              </form>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function FavoriteButton({ titleId, favorite, disabled }: { titleId: string; favorite: boolean; disabled: boolean }) {
  if (disabled) {
    return (
      <span className="grid size-[52px] shrink-0 place-items-center rounded-full border border-white/12 text-white/30">
        <Heart className="size-5" />
      </span>
    );
  }
  return (
    <form action={toggleFavoriteAction}>
      <input type="hidden" name="titleId" value={titleId} />
      <input type="hidden" name="favorite" value={String(favorite)} />
      <button
        className="grid size-[52px] shrink-0 place-items-center rounded-full border border-white/12 text-white transition hover:bg-white/5"
        style={favorite ? { color: "var(--accent-text)" } : undefined}
        aria-label="Favorite"
      >
        <Heart className={favorite ? "size-5 fill-current" : "size-5"} />
      </button>
    </form>
  );
}

function groupSeasons(episodes: Episode[]): [number, Episode[]][] {
  const bySeason = new Map<number, Episode[]>();
  for (const episode of episodes) {
    const arr = bySeason.get(episode.seasonNumber) ?? [];
    arr.push(episode);
    bySeason.set(episode.seasonNumber, arr);
  }
  return [...bySeason.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([season, list]) => [season, list.sort((a, b) => a.episodeNumber - b.episodeNumber)] as [number, Episode[]]);
}

function seededGradient(title: string) {
  let hash = 0;
  for (let i = 0; i < title.length; i += 1) hash = (hash * 31 + title.charCodeAt(i)) >>> 0;
  const hue = hash % 360;
  return `linear-gradient(140deg, hsl(${hue} 44% 34%), hsl(${(hue + 44) % 360} 46% 14%))`;
}
