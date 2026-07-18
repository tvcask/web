"use client";

import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon, Cancel01Icon, FavouriteIcon, PlusSignIcon, Share01Icon, Tick02Icon } from '@hugeicons/core-free-icons';

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import { celebrate } from "@/lib/celebrate";
import { TitleListMembership } from "@/components/lists/title-list-membership";
import { mutate } from "@/lib/mutate";
import { useSetTracked } from "@/lib/query/tracking";
import { toast } from "@/lib/toast";
import type { Person, TitleDetail } from "@/lib/data";
import { formatAirDate, localDate } from "@/lib/dates";
import type { CastMember, Episode } from "@/lib/services/types";
import { Poster } from "@/components/titles/poster";

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const key = (s: number, e: number) => `${s}-${e}`;

// An episode counts as aired if it has no date or its date is today or
// earlier in the viewer's timezone. Unaired episodes can't be marked watched.
const hasAired = (e: Episode) => !e.airDate || e.airDate <= localDate();

function formatPersonDates(person: Person): string {
  const format = (value: string) => new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
  if (!person.birthday) return "";
  return person.deathday ? `${format(person.birthday)} – ${format(person.deathday)}` : `Born ${format(person.birthday)}`;
}

export function PersonDialog({
  castMember,
  person,
  error,
  titleName,
  onClose
}: {
  castMember: CastMember;
  person: Person | null;
  error: boolean;
  titleName?: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose]);

  const profileURL = person?.profileUrl || castMember.profileUrl;
  return createPortal(
    <div
      className="actor-dialog-backdrop pointer-events-auto fixed inset-0 z-[100] grid place-items-end bg-black/80 backdrop-blur-md sm:place-items-center sm:p-6"
      role="presentation"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="person-name"
        className="actor-dialog-panel flex max-h-[94dvh] w-full flex-col overflow-hidden rounded-t-[28px] border border-white/10 bg-[#111114] shadow-2xl sm:max-h-[min(780px,90dvh)] sm:max-w-3xl sm:rounded-[28px]"
      >
        <header className="flex shrink-0 items-center justify-between border-b border-white/[0.07] px-4 py-3 sm:px-5">
          <button
            type="button"
            className="cask-focus group inline-flex min-w-0 items-center gap-2 rounded-full px-2 py-2 text-sm font-bold text-white/60 transition hover:bg-white/5 hover:text-white"
            onPointerDown={(event) => {
              event.stopPropagation();
              onClose();
            }}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4 shrink-0 transition-transform group-hover:-translate-x-0.5" />
            <span className="truncate">{titleName ? `Back to ${titleName}` : "Back to title"}</span>
          </button>
          <button
            autoFocus
            type="button"
            aria-label="Close cast details"
            className="grid size-9 place-items-center rounded-full bg-white/[0.07] text-white/60 transition hover:bg-white/10 hover:text-white"
            onPointerDown={(event) => {
              event.stopPropagation();
              onClose();
            }}
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} />
          </button>
        </header>

        <div className="nos min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="grid gap-7 p-5 pb-10 sm:grid-cols-[190px_minmax(0,1fr)] sm:gap-8 sm:p-8">
            <aside className="sm:sticky sm:top-8 sm:self-start">
              <div className="flex gap-5 sm:block">
                <div className="relative h-36 w-28 shrink-0 overflow-hidden rounded-[20px] bg-white/[0.06] shadow-xl shadow-black/25 ring-1 ring-white/10 sm:aspect-[4/5] sm:h-auto sm:w-full">
              {profileURL ? (
                    <Image src={profileURL} alt="" fill sizes="(min-width: 640px) 190px, 112px" className="object-cover" priority />
              ) : (
                <div className="grid h-full place-items-center text-3xl font-extrabold text-white/45">{(castMember.name.trim()[0] ?? "?").toUpperCase()}</div>
              )}
                </div>
                <div className="min-w-0 pt-1 sm:pt-5">
                  <p className="eyebrow">Cast member</p>
                  <h2 id="person-name" className="display mt-1 text-2xl leading-tight text-white sm:text-3xl">{person?.name || castMember.name}</h2>
                  {castMember.character ? <p className="mt-2 text-sm font-bold leading-5 text-[var(--accent-text)]">as {castMember.character}</p> : null}
                  {person?.knownFor ? <p className="mt-2 text-sm text-white/50">{person.knownFor}</p> : null}
                </div>
              </div>

              {person ? (
                <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-white/[0.07] pt-5 text-xs sm:grid-cols-1">
                  {formatPersonDates(person) ? <div><dt className="text-white/35">Life</dt><dd className="mt-1 leading-5 text-white/65">{formatPersonDates(person)}</dd></div> : null}
                  {person.placeOfBirth ? <div><dt className="text-white/35">From</dt><dd className="mt-1 leading-5 text-white/65">{person.placeOfBirth}</dd></div> : null}
                </dl>
              ) : null}
            </aside>

            <main className="min-w-0 sm:border-l sm:border-white/[0.07] sm:pl-8">
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px w-7 bg-[var(--accent)]/70" aria-hidden />
                <p className="eyebrow">Biography</p>
              </div>
              {error ? (
                <div className="rounded-2xl border border-red-300/15 bg-red-300/[0.05] p-4 text-sm text-red-200">Biography unavailable. Please close this view and try again.</div>
              ) : person ? (
                <p className="max-w-[68ch] whitespace-pre-line text-[15px] leading-7 text-white/70 sm:text-base sm:leading-8">{person.biography?.trim() || "No biography is available yet."}</p>
              ) : (
                <div className="space-y-4 pt-1" aria-label="Loading biography">
                  {["w-full", "w-11/12", "w-full", "w-4/5"].map((width, index) => <div key={index} className={`h-3 animate-pulse rounded-full bg-white/[0.06] ${width}`} />)}
                </div>
              )}
            </main>
            </div>
        </div>
      </section>
    </div>,
    document.body
  );
}

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
  const [selectedPerson, setSelectedPerson] = useState<CastMember | null>(null);
  const [person, setPerson] = useState<Person | null>(null);
  const [personError, setPersonError] = useState(false);
  const personCache = useRef(new Map<number, Person>());
  const personTrigger = useRef<HTMLButtonElement | null>(null);
  const closePerson = useCallback(() => {
    setSelectedPerson(null);
    requestAnimationFrame(() => personTrigger.current?.focus());
  }, []);

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

  useEffect(() => {
    const episodeID = decodeURIComponent(window.location.hash.slice(1));
    const target = episodes.find((episode) => episode.id === episodeID);
    if (!target) return;
    setOpenSeason(target.seasonNumber);
    requestAnimationFrame(() => document.getElementById(target.id)?.scrollIntoView({ block: "center", behavior: "smooth" }));
  }, [episodes]);

  useEffect(() => {
    if (!selectedPerson) return;
    const cached = personCache.current.get(selectedPerson.id);
    if (cached) {
      setPerson(cached);
      setPersonError(false);
      return;
    }
    const controller = new AbortController();
    setPerson(null);
    setPersonError(false);
    fetch(`/api/v1/people/${selectedPerson.id}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("person request failed");
        const result = (await response.json()) as Person;
        personCache.current.set(selectedPerson.id, result);
        setPerson(result);
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) setPersonError(true);
      });
    return () => controller.abort();
  }, [selectedPerson]);
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
                <button
                  type="button"
                  key={person.id}
                  className="w-[82px] shrink-0 text-center"
                  onClick={(event) => {
                    personTrigger.current = event.currentTarget;
                    setSelectedPerson(person);
                  }}
                  aria-label={`View ${person.name}'s biography`}
                >
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
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {selectedPerson ? <PersonDialog castMember={selectedPerson} person={person} error={personError} titleName={title.title} onClose={closePerson} /> : null}

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
                            <div id={episode.id} key={episode.id} className={`scroll-mt-24 flex items-center gap-3.5 border-b border-white/[0.06] py-2.5 ${future && !isWatched ? "opacity-55" : ""}`}>
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
