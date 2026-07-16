"use client";

import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon, FavouriteIcon, PlusSignIcon, Share01Icon, Tick02Icon } from '@hugeicons/core-free-icons';

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import { celebrate } from "@/lib/celebrate";
import { TitleListMembership } from "@/components/lists/title-list-membership";
import { mutate } from "@/lib/mutate";
import { useSetTracked } from "@/lib/query/tracking";
import { toast } from "@/lib/toast";
import type { TitleDetail } from "@/lib/data";
import { formatAirDate, localDate } from "@/lib/dates";
import type { Episode } from "@/lib/services/types";
import { Poster } from "@/components/titles/poster";

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const key = (s: number, e: number) => `${s}-${e}`;

// An episode counts as aired if it has no date or its date is today or
// earlier in the viewer's timezone. Unaired episodes can't be marked watched.
const hasAired = (e: Episode) => !e.airDate || e.airDate <= localDate();

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
  title: TitleDetail;
  episodes: Episode[];
  initial: TitleTracking;
}) {
  const queryClient = useQueryClient();
  const syncTracked = useSetTracked();
  const isMovie = title.type === "movie";
  const [tracked, setTrackedState] = useState(initial.tracked);

  // Every tracked change also updates the shared library-ids Set, so poster
  // buttons for this title stay in sync. Done in the setter, not an effect.
  const setTracked = useCallback(
    (value: boolean) => {
      setTrackedState(value);
      syncTracked(title.id, value);
    },
    [syncTracked, title.id]
  );
  const [status, setStatus] = useState(initial.status || (isMovie ? "watchlist" : "watching"));
  const [favorite, setFavorite] = useState(initial.favorite);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [openSeason, setOpenSeason] = useState<number | null>(() => episodes[0]?.seasonNumber ?? null);
  const [watched, setWatched] = useState<Set<string>>(() => new Set(initial.watched));

  // Keep the cached library lists in sync with the drawer — debounced so rapid
  // toggles trigger a single refetch.
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  function scheduleRefresh() {
    clearTimeout(refreshTimer.current);
    refreshTimer.current = setTimeout(() => queryClient.invalidateQueries({ queryKey: ["library"] }), 600);
  }

  const airedEpisodes = episodes.filter(hasAired);
  const watchedCount = airedEpisodes.filter((e) => watched.has(key(e.seasonNumber, e.episodeNumber))).length;
  const pct = airedEpisodes.length > 0 ? Math.min(100, Math.round((watchedCount / airedEpisodes.length) * 100)) : 0;
  const seasons = groupSeasons(episodes);
  const meta = [title.year, isMovie ? "Movie" : "Series", title.genres[0]].filter(Boolean).join(" · ");
  const hasRating = typeof title.rating === "number" && title.rating > 0;
  const providers = title.watchProviders ?? [];

  const statuses = [
    { value: "watchlist", label: "Watch list" },
    { value: "watching", label: "Watching" },
    { value: "completed", label: isMovie ? "Watched" : "Completed" }
  ] as const;

  // Completion needs every episode, not just aired ones — a series still to air can't be finished.
  const isComplete = (set: Set<string>) =>
    !isMovie && episodes.length > 0 && episodes.every((e) => set.has(key(e.seasonNumber, e.episodeNumber)));

  function toggleEpisode(ep: Episode) {
    const k = key(ep.seasonNumber, ep.episodeNumber);
    const willWatch = !watched.has(k);
    if (willWatch && !hasAired(ep)) return;
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
      setWatched(new Set(airedEpisodes.map((e) => key(e.seasonNumber, e.episodeNumber))));
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
          <Image src={title.backdropUrl} alt="" fill sizes="(max-width: 640px) 100vw, 560px" className="object-cover" />
        ) : (
          <div className="absolute inset-0" style={{ background: seededGradient(title.title) }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-[#0a0a0c]/75 to-[#0a0a0c]" />
        <div className="relative flex h-full items-end gap-4">
          <div className="relative h-[168px] w-[112px] shrink-0 overflow-hidden rounded-[14px] ring-1 ring-white/10">
            <Poster src={title.posterUrl} title={title.title} className="h-full rounded-[14px]" />
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
              <HugeiconsIcon icon={Tick02Icon} className="size-5 group-hover:hidden" />
              <HugeiconsIcon icon={Cancel01Icon} className="hidden size-5 group-hover:block" />
              <span className="group-hover:hidden">Tracking</span>
              <span className="hidden group-hover:block">Untrack</span>
            </button>
          ) : (
            <button
              onClick={track}
              className="accent-fill flex h-[52px] flex-1 items-center justify-center gap-2 rounded-full text-[15px] font-extrabold"
            >
              <HugeiconsIcon icon={PlusSignIcon} className="size-5" /> {isMovie ? "Add to watchlist" : "Track show"}
            </button>
          )}

          <button
            onClick={toggleFavorite}
            className="grid size-[52px] shrink-0 place-items-center rounded-full border border-white/12 text-white transition hover:bg-white/5"
            style={favorite ? { color: "var(--accent-text)" } : undefined}
            aria-label="Favorite"
          >
            <HugeiconsIcon icon={FavouriteIcon} className={favorite ? "size-5 fill-current" : "size-5"} />
          </button>
          <button
            onClick={share}
            className="grid size-[52px] shrink-0 place-items-center rounded-full border border-white/12 text-white/80 transition hover:bg-white/5"
            aria-label="Share"
          >
            <HugeiconsIcon icon={Share01Icon} className="size-5" />
          </button>
        </div>

        <TitleListMembership titleId={title.id} />

        {hasRating || providers.length > 0 ? (
          <div className="surface flex flex-col gap-4 rounded-[14px] p-4 sm:flex-row sm:items-center">
            {hasRating ? (
              <div className="shrink-0 sm:min-w-24">
                <p className="display text-3xl text-white">{title.rating!.toFixed(1)}</p>
                <p className="mt-0.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-white/40">
                  Rating{title.ratingCount ? ` · ${formatVotes(title.ratingCount)}` : ""}
                </p>
              </div>
            ) : null}
            {hasRating && providers.length > 0 ? <div className="hidden h-12 w-px bg-white/10 sm:block" /> : null}
            {providers.length > 0 ? (
              <div className="min-w-0 flex-1">
                <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-white/45">Where to watch</p>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {providers.map((provider) => {
                    const chip = (
                      <>
                        {provider.logoUrl ? (
                          <Image src={provider.logoUrl} alt="" width={24} height={24} className="size-6 rounded-[5px] object-cover" />
                        ) : null}
                        <span className="whitespace-nowrap text-xs font-bold text-white/80">{provider.name}</span>
                      </>
                    );
                    return title.watchProviderLink ? (
                      <a
                        key={provider.id}
                        href={title.watchProviderLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex shrink-0 items-center gap-2 rounded-full bg-white/[0.06] py-1.5 pl-1.5 pr-3 transition hover:bg-white/10"
                      >
                        {chip}
                      </a>
                    ) : (
                      <span key={provider.id} className="flex shrink-0 items-center gap-2 rounded-full bg-white/[0.06] py-1.5 pl-1.5 pr-3">
                        {chip}
                      </span>
                    );
                  })}
                </div>
                <p className="mt-2 text-[10px] text-white/30">{title.watchProviderAttribution || "Powered by JustWatch"}</p>
              </div>
            ) : null}
          </div>
        ) : null}

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

        {title.cast?.length ? (
          <div>
            <h2 className="display mb-3 text-base text-white">Cast</h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {title.cast.map((person) => (
                <div key={person.id} className="w-[82px] shrink-0 text-center">
                  <div className="relative mx-auto size-16 overflow-hidden rounded-full bg-white/[0.06] ring-1 ring-white/10">
                    {person.profileUrl ? (
                      <Image src={person.profileUrl} alt="" fill sizes="64px" className="object-cover" />
                    ) : (
                      <div className="grid h-full place-items-center text-lg font-extrabold text-white/45">
                        {(person.name.trim()[0] ?? "?").toUpperCase()}
                      </div>
                    )}
                  </div>
                  <p className="mt-2 truncate text-xs font-bold text-white/80">{person.name}</p>
                  {person.character ? <p className="mt-0.5 truncate text-[11px] text-white/40">{person.character}</p> : null}
                </div>
              ))}
            </div>
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
                  const airedSeason = seasonEpisodes.filter(hasAired);
                  const seasonWatched = airedSeason.filter((e) => watched.has(key(e.seasonNumber, e.episodeNumber))).length;
                  const allWatched = airedSeason.length > 0 && seasonWatched === airedSeason.length;
                  return (
                    <div key={seasonNumber}>
                      <div className="mb-2 flex items-center justify-between rounded-[12px] bg-white/[0.035] px-3 py-2">
                        <button type="button" onClick={() => setOpenSeason(openSeason === seasonNumber ? null : seasonNumber)} className="flex flex-1 items-center gap-2 text-left text-sm font-bold text-white" aria-expanded={openSeason === seasonNumber}>
                          <span className={`text-white/40 transition ${openSeason === seasonNumber ? "rotate-90" : ""}`}>›</span>
                          Season {seasonNumber}
                        </button>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-white/45">
                            {seasonWatched}/{airedSeason.length}
                          </span>
                          <button
                            onClick={() => toggleSeason(seasonNumber, airedSeason, allWatched)}
                            disabled={airedSeason.length === 0}
                            className="rounded-full bg-white/5 px-3 py-1 text-[11px] font-bold text-white/70 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
                          >
                            {allWatched ? "Clear season" : "Mark season"}
                          </button>
                        </div>
                      </div>
                      {openSeason === seasonNumber ? <div className="flex flex-col">
                        {seasonEpisodes.map((episode) => {
                          const isWatched = watched.has(key(episode.seasonNumber, episode.episodeNumber));
                          const future = !hasAired(episode);
                          return (
                            <div key={episode.id} className={`flex items-center gap-3.5 border-b border-white/[0.06] py-2.5 ${future && !isWatched ? "opacity-55" : ""}`}>
                              <div
                                className="relative h-[46px] w-[80px] shrink-0 overflow-hidden rounded-[7px]"
                                style={{ background: "linear-gradient(140deg,#2a2f3a,#14110d)" }}
                              >
                                {episode.stillUrl ? (
                                  <Image src={episode.stillUrl} alt="" fill sizes="80px" className="object-cover" />
                                ) : null}
                              </div>
                              <button type="button" onClick={() => setSelectedEpisode(episode)} className="min-w-0 flex-1 text-left" aria-label={`View details for ${episode.name || `episode ${episode.episodeNumber}`}`}>
                                <p className="truncate text-sm font-semibold text-white">
                                  E{pad(episode.episodeNumber)} · {episode.name ?? "TBA"}
                                </p>
                                <p className="mt-0.5 text-xs text-white/45">{future ? "Airs " : ""}{episode.airDate ? formatAirDate(episode.airDate) : ""}</p>
                              </button>
                              <button
                                onClick={() => toggleEpisode(episode)}
                                disabled={future && !isWatched}
                                className="grid size-7 shrink-0 place-items-center rounded-full transition"
                                style={
                                  isWatched
                                    ? { background: "var(--accent)", color: "var(--on-accent)" }
                                    : { boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.22)", color: "transparent" }
                                }
                                aria-label={future ? `S${pad(episode.seasonNumber)}E${pad(episode.episodeNumber)} has not aired yet` : `Toggle S${pad(episode.seasonNumber)}E${pad(episode.episodeNumber)} watched`}
                              >
                                <HugeiconsIcon icon={Tick02Icon} className="size-3.5" />
                              </button>
                            </div>
                          );
                        })}
                      </div> : null}
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
          {title.episodeMetadataAttribution ? (
            <>
              {" "}{title.episodeMetadataAttribution}. See{" "}
              <a href={title.episodeMetadataUrl || "https://thetvdb.com"} target="_blank" rel="noreferrer" className="underline transition hover:text-white/55">TheTVDB</a>.
            </>
          ) : null}
        </p>
      </div>

      {selectedEpisode ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70" role="dialog" aria-modal="true" aria-labelledby="episode-detail-title" onClick={() => setSelectedEpisode(null)}>
          <div className="mt-auto max-h-[88dvh] w-full overflow-y-auto rounded-t-[24px] border border-white/10 bg-[#11100e] shadow-2xl sm:mt-0 sm:h-full sm:max-h-none sm:max-w-[480px] sm:rounded-none sm:border-y-0 sm:border-r-0" onClick={(event) => event.stopPropagation()}>
            <div className="sticky top-0 z-10 flex justify-end bg-gradient-to-b from-black/55 to-transparent p-4 pb-8"><button type="button" onClick={() => setSelectedEpisode(null)} className="grid size-10 place-items-center rounded-full bg-black/55 text-white/80 backdrop-blur" aria-label="Close episode details"><HugeiconsIcon icon={Cancel01Icon} className="size-4" /></button></div>
            {selectedEpisode.stillUrl ? <div className="relative -mt-20 aspect-video w-full"><Image src={selectedEpisode.stillUrl} alt="" fill sizes="(max-width: 640px) 100vw, 480px" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#11100e] via-transparent to-black/20" /></div> : null}
            <div className="p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div><p className="text-xs font-bold text-[var(--accent)]">S{pad(selectedEpisode.seasonNumber)}E{pad(selectedEpisode.episodeNumber)}</p><h2 id="episode-detail-title" className="display mt-2 text-2xl text-white">{selectedEpisode.name || "Episode details"}</h2></div>
              </div>
              <p className="mt-3 text-sm text-white/45">{[selectedEpisode.airDate ? formatAirDate(selectedEpisode.airDate) : null, selectedEpisode.runtimeMinutes ? `${selectedEpisode.runtimeMinutes} min` : null, selectedEpisode.finaleType ? `${selectedEpisode.finaleType} finale` : null].filter(Boolean).join(" · ")}</p>
              <div className="my-6 h-px bg-white/[0.07]" />
              <h3 className="text-sm font-bold text-white">About this episode</h3>
              <p className="mt-3 text-[15px] leading-7 text-white/65">{selectedEpisode.overview?.trim() || "No synopsis is available yet."}</p>
              {selectedEpisode.metadataSource === "tvdb" ? <a href="https://thetvdb.com" target="_blank" rel="noreferrer" className="mt-8 inline-block text-xs font-bold text-[var(--accent)]">Episode metadata provided by TheTVDB ↗</a> : null}
            </div>
          </div>
        </div>
      ) : null}
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

function formatVotes(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1)}M votes`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(value >= 10_000 ? 0 : 1)}K votes`;
  return `${value} votes`;
}
