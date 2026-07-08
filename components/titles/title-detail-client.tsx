"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Heart, Plus, Share2, X } from "lucide-react";
import { celebrate } from "@/lib/celebrate";
import { mutate } from "@/lib/mutate";
import { toast } from "@/lib/toast";
import type { Episode, Title } from "@/lib/services/types";

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const key = (s: number, e: number) => `${s}-${e}`;

// Roll back an optimistic change and tell the user it didn't stick.
function onSaveError(revert: () => void) {
  return () => {
    revert();
    toast("Couldn't save your change. Try again.");
  };
}

export type TitleTracking = { tracked: boolean; status: string; favorite: boolean; watched: string[] };

export function TitleDetailClient({
  title,
  episodes,
  initial
}: {
  title: Title;
  episodes: Episode[];
  initial: TitleTracking;
}) {
  const router = useRouter();
  const isMovie = title.type === "movie";
  const [tracked, setTracked] = useState(initial.tracked);
  const [status, setStatus] = useState(initial.status || (isMovie ? "watchlist" : "watching"));
  const [favorite, setFavorite] = useState(initial.favorite);
  const [watched, setWatched] = useState<Set<string>>(() => new Set(initial.watched));

  // Keep the page behind the drawer in sync — debounced so rapid toggles
  // trigger a single re-fetch of the underlying server components.
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  function scheduleRefresh() {
    clearTimeout(refreshTimer.current);
    refreshTimer.current = setTimeout(() => router.refresh(), 600);
  }

  const watchedCount = episodes.filter((e) => watched.has(key(e.seasonNumber, e.episodeNumber))).length;
  const pct = episodes.length > 0 ? Math.min(100, Math.round((watchedCount / episodes.length) * 100)) : 0;
  const seasons = groupSeasons(episodes);
  const meta = [title.year, isMovie ? "Movie" : "Series", title.genres[0]].filter(Boolean).join(" · ");

  const statuses = [
    { value: "watchlist", label: "Watch list" },
    { value: "watching", label: "Watching" },
    { value: "completed", label: isMovie ? "Watched" : "Completed" }
  ] as const;

  const isComplete = (set: Set<string>) =>
    !isMovie && episodes.length > 0 && episodes.every((e) => set.has(key(e.seasonNumber, e.episodeNumber)));

  function toggleEpisode(ep: Episode) {
    const k = key(ep.seasonNumber, ep.episodeNumber);
    const willWatch = !watched.has(k);
    const nextWatched = new Set(watched);
    if (willWatch) nextWatched.add(k);
    else nextWatched.delete(k);

    const prev = { watched, tracked };
    setWatched(nextWatched);
    setTracked(true);
    if (willWatch && !isComplete(watched) && isComplete(nextWatched)) celebrate(title.title);
    scheduleRefresh();

    mutate(`me/titles/${title.id}/episodes`, "POST", {
      season: ep.seasonNumber,
      episode: ep.episodeNumber,
      episodeId: ep.id,
      watched: willWatch
    }).catch(onSaveError(() => {
      setWatched(prev.watched);
      setTracked(prev.tracked);
    }));
  }

  function toggleSeason(seasonNumber: number, seasonEpisodes: Episode[], allWatched: boolean) {
    const willWatch = !allWatched;
    const nextWatched = new Set(watched);
    for (const e of seasonEpisodes) {
      const k = key(e.seasonNumber, e.episodeNumber);
      if (willWatch) nextWatched.add(k);
      else nextWatched.delete(k);
    }

    const prev = { watched, tracked };
    setWatched(nextWatched);
    setTracked(true);
    if (willWatch && !isComplete(watched) && isComplete(nextWatched)) celebrate(title.title);
    scheduleRefresh();

    mutate(`me/titles/${title.id}/seasons/${seasonNumber}`, "POST", { watched: willWatch }).catch(onSaveError(() => {
      setWatched(prev.watched);
      setTracked(prev.tracked);
    }));
  }

  function changeStatus(next: string) {
    const prev = { status, watched, tracked };
    setStatus(next);
    setTracked(true);
    if (next === "completed") {
      setWatched(new Set(episodes.map((e) => key(e.seasonNumber, e.episodeNumber))));
      if (prev.status !== "completed") celebrate(title.title);
    }
    scheduleRefresh();

    mutate(`me/titles/${title.id}`, "PATCH", { status: next }).catch(onSaveError(() => {
      setStatus(prev.status);
      setWatched(prev.watched);
      setTracked(prev.tracked);
    }));
  }

  function toggleFavorite() {
    const prev = { favorite, tracked };
    setFavorite(!favorite);
    setTracked(true);
    scheduleRefresh();
    mutate(`me/titles/${title.id}`, "PATCH", { favorite: !favorite }).catch(onSaveError(() => {
      setFavorite(prev.favorite);
      setTracked(prev.tracked);
    }));
  }

  function track() {
    const prev = tracked;
    setTracked(true);
    scheduleRefresh();
    mutate(`me/titles`, "POST", { titleId: title.id, status }).catch(onSaveError(() => setTracked(prev)));
  }

  function untrack() {
    const prev = { tracked, status, favorite, watched };
    setTracked(false);
    setFavorite(false);
    setWatched(new Set());
    scheduleRefresh();
    mutate(`me/titles/${title.id}`, "DELETE").catch(onSaveError(() => {
      setTracked(prev.tracked);
      setFavorite(prev.favorite);
      setWatched(prev.watched);
    }));
  }

  function share() {
    const url = `${window.location.origin}/app/titles/${title.id}`;
    if (navigator.share) navigator.share({ title: title.title, url }).catch(() => {});
    else navigator.clipboard?.writeText(url).catch(() => {});
  }

  return (
    <div>
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
        <div className="flex items-center gap-3">
          {tracked ? (
            <button
              onClick={untrack}
              className="accent-fill group flex h-[52px] flex-1 items-center justify-center gap-2 rounded-full text-[15px] font-extrabold"
            >
              <Check className="size-5 group-hover:hidden" />
              <X className="hidden size-5 group-hover:block" />
              <span className="group-hover:hidden">Tracking</span>
              <span className="hidden group-hover:block">Untrack</span>
            </button>
          ) : (
            <button
              onClick={track}
              className="accent-fill flex h-[52px] flex-1 items-center justify-center gap-2 rounded-full text-[15px] font-extrabold"
            >
              <Plus className="size-5" /> {isMovie ? "Add to watchlist" : "Track show"}
            </button>
          )}

          <button
            onClick={toggleFavorite}
            className="grid size-[52px] shrink-0 place-items-center rounded-full border border-white/12 text-white transition hover:bg-white/5"
            style={favorite ? { color: "var(--accent-text)" } : undefined}
            aria-label="Favorite"
          >
            <Heart className={favorite ? "size-5 fill-current" : "size-5"} />
          </button>
          <button
            onClick={share}
            className="grid size-[52px] shrink-0 place-items-center rounded-full border border-white/12 text-white/80 transition hover:bg-white/5"
            aria-label="Share"
          >
            <Share2 className="size-5" />
          </button>
        </div>

        {tracked ? (
          <div className="flex flex-wrap gap-2">
            {statuses.map((s) => (
              <button
                key={s.value}
                onClick={() => changeStatus(s.value)}
                className={
                  status === s.value
                    ? "accent-fill rounded-full px-4 py-2 text-[13px] font-bold"
                    : "rounded-full bg-white/5 px-4 py-2 text-[13px] font-bold text-white/70 transition hover:text-white"
                }
              >
                {s.label}
              </button>
            ))}
          </div>
        ) : null}

        {!isMovie && episodes.length > 0 ? (
          <div className="surface rounded-[14px] p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-white">Progress</span>
              <span className="font-semibold text-white/60">
                {watchedCount} / {episodes.length}
              </span>
            </div>
            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: "var(--accent)" }} />
            </div>
          </div>
        ) : null}

        {title.overview ? (
          <div>
            <h2 className="display mb-2 text-base text-white">About</h2>
            <p className="text-[15px] leading-7 text-white/70">{title.overview}</p>
          </div>
        ) : null}

        {!isMovie ? (
          <div>
            <h2 className="display mb-3 text-base text-white">Episodes</h2>
            {seasons.length === 0 ? (
              <p className="surface rounded-[14px] p-5 text-white/50">Episode data isn&apos;t available yet.</p>
            ) : (
              <div className="space-y-5">
                {seasons.map(([seasonNumber, seasonEpisodes]) => {
                  const seasonWatched = seasonEpisodes.filter((e) => watched.has(key(e.seasonNumber, e.episodeNumber))).length;
                  const allWatched = seasonWatched === seasonEpisodes.length;
                  return (
                    <div key={seasonNumber}>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-bold text-white">Season {seasonNumber}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-white/45">
                            {seasonWatched}/{seasonEpisodes.length}
                          </span>
                          <button
                            onClick={() => toggleSeason(seasonNumber, seasonEpisodes, allWatched)}
                            className="rounded-full bg-white/5 px-3 py-1 text-[11px] font-bold text-white/70 transition hover:text-white"
                          >
                            {allWatched ? "Clear season" : "Mark season"}
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        {seasonEpisodes.map((episode) => {
                          const isWatched = watched.has(key(episode.seasonNumber, episode.episodeNumber));
                          return (
                            <div key={episode.id} className="flex items-center gap-3.5 border-b border-white/[0.06] py-2.5">
                              <div
                                className="h-[46px] w-[80px] shrink-0 overflow-hidden rounded-[7px]"
                                style={{ background: "linear-gradient(140deg,#2a2f3a,#14110d)" }}
                              >
                                {episode.stillUrl ? (
                                  <img src={episode.stillUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
                                ) : null}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-white">
                                  E{pad(episode.episodeNumber)} · {episode.name ?? "TBA"}
                                </p>
                                <p className="mt-0.5 text-xs text-white/45">{episode.airDate ?? ""}</p>
                              </div>
                              <button
                                onClick={() => toggleEpisode(episode)}
                                className="grid size-7 shrink-0 place-items-center rounded-full transition"
                                style={
                                  isWatched
                                    ? { background: "var(--accent)", color: "var(--on-accent)" }
                                    : { boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.22)", color: "transparent" }
                                }
                                aria-label={`Toggle S${pad(episode.seasonNumber)}E${pad(episode.episodeNumber)} watched`}
                              >
                                <Check className="size-3.5" />
                              </button>
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

        <p className="mt-8 border-t border-white/[0.06] pt-4 text-[11px] leading-5 text-white/30">
          Metadata and artwork from{" "}
          <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer" className="underline transition hover:text-white/55">
            TMDB
          </a>
          . This product is not endorsed or certified by TMDB.
        </p>
      </div>
    </div>
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
