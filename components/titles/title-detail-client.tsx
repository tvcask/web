"use client";

import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon, Cancel01Icon, FavouriteIcon, PlusSignIcon, Search01Icon, Share01Icon, Tick02Icon } from '@hugeicons/core-free-icons';

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { DetailDrawerTitle } from "@/components/ui/detail-drawer";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { celebrate } from "@/lib/celebrate";
import { TitleListMembership } from "@/components/lists/title-list-membership";
import { mutate } from "@/lib/mutate";
import { useSetTracked } from "@/lib/query/tracking";
import { useTitleCast } from "@/lib/query/titles";
import { clearTitleView, peekTitleView, saveTitleView, type TitleView } from "@/lib/title-view";
import { toast } from "@/lib/toast";
import Link from "next/link";
import type { TitleDetail } from "@/lib/data";
import { formatAirDate, localDate } from "@/lib/dates";
import type { Episode, Title } from "@/lib/services/types";
import { Poster } from "@/components/titles/poster";

const EPISODES_PER_PAGE = 50;
const OFFER_MS = 7000;
const DRAWER_HEADER_PX = 56;
const WATCH_FILTERS = [["all", "All"], ["unwatched", "Unwatched"], ["watched", "Watched"]] as const;
// Past this, a single season is split into collapsible air years.
const LONG_SEASON = 100;

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

export type TitleTracking = { tracked: boolean; status: string; favorite: boolean; watched: string[]; rating?: number | null };

export function TitleDetailClient({
  title,
  episodes,
  related = [],
  initial
}: {
  title: TitleDetail;
  episodes: Episode[];
  related?: Title[];
  initial: TitleTracking;
}) {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const syncTracked = useSetTracked();
  const titleCast = useTitleCast(title.id);
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
  const [status, setStatus] = useState(initial.status || "watchlist");
  const [favorite, setFavorite] = useState(initial.favorite);
  const [personalRating, setPersonalRating] = useState(initial.rating);
  const [savedView] = useState(() => peekTitleView(title.id));
  useEffect(() => {
    clearTitleView(title.id);
  }, [title.id]);
  const [tab, setTab] = useState<TitleView["tab"]>(savedView?.tab ?? "overview");
  const [watched, setWatched] = useState<Set<string>>(() => new Set(savedView?.watched ?? initial.watched));
  const sections = useMemo(() => episodeSections(episodes), [episodes]);
  // Open where the viewer actually is: the first section with something left to
  // watch, or the last one if they've finished the show. Fixed at mount, so
  // finishing a section doesn't collapse it under them.
  const isNextUp = (e: Episode) => hasAired(e) && !watched.has(key(e.seasonNumber, e.episodeNumber));
  const [openSection, setOpenSection] = useState<string | null>(
    () => savedView ? savedView.openSection : (sections.find((s) => s.episodes.some(isNextUp)) ?? sections.at(-1))?.id ?? null
  );
  const savingEpisodes = useRef(new Set<string>());
  // Shown inside the panel rather than as a toast: the open drawer traps focus and
  // hides everything outside it from assistive tech, so a toast's button would be
  // mouse-only.
  const [episodeOffer, setEpisodeOffer] = useState<{ message: string; label: string; onClick: () => void } | null>(null);
  useEffect(() => {
    if (!episodeOffer) return;
    const timer = setTimeout(() => setEpisodeOffer(null), OFFER_MS);
    return () => clearTimeout(timer);
  }, [episodeOffer]);
  const hero = useRef<HTMLDivElement>(null);
  const [episodeFilter, setEpisodeFilter] = useState(savedView?.filter ?? "all");
  const [episodeQuery, setEpisodeQuery] = useState(savedView?.query ?? "");
  const [episodePages, setEpisodePages] = useState<Record<string, number>>(() => {
    if (savedView) return savedView.pages;
    const nextUp = sections.find((s) => s.id === openSection)?.episodes.findIndex(isNextUp) ?? -1;
    return openSection && nextUp > 0 ? { [openSection]: Math.floor(nextUp / EPISODES_PER_PAGE) } : {};
  });
  const returnTo = searchParams.get("returnTo");
  const detailQuery = returnTo?.startsWith("/app/") ? `&returnTo=${encodeURIComponent(returnTo)}` : "";
  const rememberView = () =>
    saveTitleView(title.id, { tab, openSection, pages: episodePages, filter: episodeFilter, query: episodeQuery, watched: [...watched] });

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

  useEffect(() => {
    const episodeID = decodeURIComponent(window.location.hash.slice(1));
    const target = episodes.find((episode) => episode.id === episodeID);
    if (!target) return;
    const section = sections.find((s) => s.episodes.includes(target));
    if (!section) return;
    setTab("episodes");
    setOpenSection(section.id);
    setEpisodeFilter("all");
    setEpisodeQuery("");
    setEpisodePages({ [section.id]: Math.floor(section.episodes.indexOf(target) / EPISODES_PER_PAGE) });
    requestAnimationFrame(() => document.getElementById(target.id)?.scrollIntoView({ block: "center", behavior: "smooth" }));
  }, [episodes, sections]);

  const query = episodeQuery.trim().toLowerCase();
  const filtering = Boolean(query) || episodeFilter !== "all";
  const matchingEpisodes = (section: EpisodeSection) =>
    section.episodes.filter((e) => {
      const seen = watched.has(key(e.seasonNumber, e.episodeNumber));
      return (episodeFilter === "all" || (episodeFilter === "watched" ? seen : !seen)) && (!query || (/^\d+$/.test(query) ? e.episodeNumber === Number(query) : e.name?.toLowerCase().includes(query)));
    });
  const visibleSections = sections.map((section) => ({ section, matching: matchingEpisodes(section) })).filter(({ matching }) => !filtering || matching.length > 0);
  // A filter can hide the open section, so fall through to the first one left.
  const expandedSection = openSection !== null && !visibleSections.some(({ section }) => section.id === openSection) ? (visibleSections[0]?.section.id ?? null) : openSection;

  const meta = [title.year, isMovie ? "Movie" : "Series", title.genres[0]].filter(Boolean).join(" · ");
  const hasRating = typeof title.rating === "number" && title.rating > 0;
  const providers = title.watchProviders ?? [];
  const cast = titleCast.data?.status === "ready" ? titleCast.data.items : (title.cast ?? []);
  const castPending = cast.length === 0 && (titleCast.isPending || titleCast.data?.status === "pending");

  // Ordered as a title moves through a library: queued, started, finished, or
  // abandoned. Dropped sits last because it is the exit, not a step.
  const statuses = [
    { value: "watchlist", label: "Watch list" },
    { value: "watching", label: "Watching" },
    { value: "completed", label: isMovie ? "Watched" : "Completed" },
    { value: "dropped", label: "Dropped" }
  ] as const;

  // Completion needs every episode, not just aired ones — a series still to air can't be finished.
  const isComplete = (set: Set<string>) =>
    !isMovie && episodes.length > 0 && episodes.every((e) => set.has(key(e.seasonNumber, e.episodeNumber)));

  // Ticks stay usable while a save is in flight, so rollbacks only touch the keys
  // they changed. A second click on the same episode waits for its save to land.
  function setKeysWatched(keys: string[], value: boolean) {
    setWatched((current) => {
      const next = new Set(current);
      for (const k of keys) {
        if (value) next.add(k);
        else next.delete(k);
      }
      return next;
    });
  }

  function toggleEpisode(ep: Episode) {
    const k = key(ep.seasonNumber, ep.episodeNumber);
    if (savingEpisodes.current.has(k)) return;
    const willWatch = !watched.has(k);
    if (willWatch && !hasAired(ep)) return;
    savingEpisodes.current.add(k);

    // Mark the one that was clicked, then offer the earlier ones. Unchecking only
    // ever affects the selected episode.
    const earlier = willWatch
      ? airedEpisodes.filter((e) => isAtOrBefore(e, ep) && e.id !== ep.id && !watched.has(key(e.seasonNumber, e.episodeNumber)))
      : [];

    const nextWatched = new Set(watched);
    if (willWatch) nextWatched.add(k);
    else nextWatched.delete(k);

    const wasTracked = tracked;
    setKeysWatched([k], willWatch);
    setTracked(true);
    if (willWatch && status === "watchlist") setStatus("watching");
    if (willWatch && !isComplete(watched) && isComplete(nextWatched)) celebrate(title.title);
    scheduleRefresh();

    mutate(`me/titles/${title.id}/episodes`, "POST", {
      season: ep.seasonNumber,
      episode: ep.episodeNumber,
      episodeId: ep.id,
      watched: willWatch
    })
      .then(() => {
        if (earlier.length === 0) return;
        const others = earlier.length === 1 ? "1 earlier episode" : `${earlier.length} earlier episodes`;
        setEpisodeOffer({ message: `Also mark ${others}?`, label: "Mark", onClick: () => markEarlier(ep, earlier, nextWatched) });
      })
      .catch(onSaveError(() => {
        setKeysWatched([k], !willWatch);
        setTracked(wasTracked);
      }))
      .finally(() => savingEpisodes.current.delete(k));
  }

  function markEarlier(ep: Episode, earlier: Episode[], base: Set<string>) {
    const keys = earlier.map((e) => key(e.seasonNumber, e.episodeNumber));
    setEpisodeOffer(null);
    setKeysWatched(keys, true);
    if (!isComplete(base) && isComplete(new Set([...base, ...keys]))) celebrate(title.title);
    scheduleRefresh();
    mutate(`me/titles/${title.id}/episodes/through`, "POST", {
      season: ep.seasonNumber,
      episode: ep.episodeNumber
    })
      .then(() => {
        const message = `Marked ${earlier.length} earlier ${earlier.length === 1 ? "episode" : "episodes"}`;
        // Avoid hundreds of individual requests for a large bulk undo.
        if (earlier.length <= 50) setEpisodeOffer({ message, label: "Undo", onClick: () => undoMarkEarlier(earlier) });
        else toast(message);
      })
      .catch(onSaveError(() => setKeysWatched(keys, false)));
  }

  // There's no bulk-unmark endpoint, so clear the run episode by episode.
  function undoMarkEarlier(earlier: Episode[]) {
    const keys = earlier.map((e) => key(e.seasonNumber, e.episodeNumber));
    setEpisodeOffer(null);
    setKeysWatched(keys, false);
    scheduleRefresh();
    Promise.all(
      earlier.map((e) =>
        mutate(`me/titles/${title.id}/episodes`, "POST", {
          season: e.seasonNumber,
          episode: e.episodeNumber,
          episodeId: e.id,
          watched: false
        })
      )
    ).catch(onSaveError(() => setKeysWatched(keys, true)));
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
    if (willWatch && status === "watchlist") setStatus("watching");
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

  function rate(value: number) {
    const previous = personalRating;
    setPersonalRating(value);
    setTracked(true);
    scheduleRefresh();
    mutate(`me/titles/${title.id}`, "PATCH", { rating: value }).catch(onSaveError(() => setPersonalRating(previous)));
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

  // Past the hero the tabs are stuck, so a new tab should start at its top rather
  // than wherever the last one was scrolled to.
  function selectTab(next: TitleView["tab"]) {
    setTab(next);
    const scroller = hero.current?.closest("[data-detail-scroll]");
    const stuckAt = (hero.current?.offsetHeight ?? 0) - DRAWER_HEADER_PX;
    if (scroller && scroller.scrollTop > stuckAt) scroller.scrollTop = stuckAt;
  }

  const tabs: [TitleView["tab"], string][] = [
    ["overview", "Overview"],
    ...(!isMovie ? [["episodes", episodes.length ? `Episodes · ${episodes.length}` : "Episodes"] as [TitleView["tab"], string]] : []),
    ["cast", "Cast"]
  ];

  function share() {
    const url = `${window.location.origin}/titles/${title.id}`;
    if (navigator.share) navigator.share({ title: title.title, url }).catch(() => {});
    else navigator.clipboard?.writeText(url).catch(() => {});
  }

  return (
    <div>
      <DetailDrawerTitle>{title.title}</DetailDrawerTitle>
      <div ref={hero} className="relative h-[280px] px-6 pt-6 sm:px-8">
        {title.backdropUrl ? (
          <Image src={title.backdropUrl} alt="" fill sizes="(max-width: 640px) 100vw, 720px" className="object-cover" />
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

      <div role="tablist" aria-label="Title sections" className="nos sticky top-14 z-10 flex gap-2 overflow-x-auto bg-[#0a0a0c] px-6 py-3 sm:px-8">
        {tabs.map(([value, label]) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={tab === value}
            onClick={() => selectTab(value)}
            className={`cask-focus whitespace-nowrap rounded-full px-4 py-2 text-sm font-extrabold transition ${tab === value ? "accent-fill" : "bg-white/5 text-white/70 hover:text-white"}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-6 px-6 pb-10 pt-3 sm:px-8">
        {tab === "overview" ? <div className="space-y-6">
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

        <section>
          <div className="mb-3 flex items-end justify-between gap-3">
            <div><h2 className="display text-base text-white">Your rating</h2><p className="mt-1 text-xs text-white/40">Private to you until you choose to share it.</p></div>
            {personalRating ? <span className="display text-xl text-[var(--accent-text)]">{personalRating}/10</span> : null}
          </div>
          <div className="nos flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Rate this title out of 10">
            {Array.from({ length: 10 }, (_, index) => index + 1).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => rate(value)}
                aria-pressed={personalRating === value}
                className={`grid size-10 shrink-0 place-items-center rounded-full text-xs font-extrabold transition ${personalRating === value ? "bg-[var(--accent)] text-[var(--on-accent)]" : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"}`}
              >
                {value}
              </button>
            ))}
          </div>
        </section>

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
        </div> : null}

        {tab !== "cast" ? null : cast.length > 0 ? (
          <div>
            <h2 className="sr-only">Cast</h2>
            <div className="grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-5">
              {cast.map((person) => (
                <Link
                  key={person.id}
                  href={`/app/people/${person.id}?titleId=${encodeURIComponent(title.id)}&character=${encodeURIComponent(person.character ?? "")}${detailQuery}`}
                  onClick={rememberView}
                  className="min-w-0 text-center"
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
                </Link>
              ))}
            </div>
          </div>
        ) : castPending ? (
          <div aria-label="Loading cast" aria-busy="true">
            <div className="flex gap-4 overflow-hidden pb-2" aria-hidden="true">
              {[0, 1, 2, 3].map((item) => (
                <div key={item} className="w-[82px] shrink-0 animate-pulse">
                  <div className="mx-auto size-16 rounded-full bg-white/[0.06]" />
                  <div className="mx-auto mt-2 h-3 w-14 rounded bg-white/[0.05]" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="surface rounded-[14px] p-5 text-sm text-white/50">Cast details aren&apos;t available yet.</p>
        )}

        {tab === "episodes" && !isMovie ? (
          <div>
            <h2 className="sr-only">Episodes</h2>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <div className="relative min-w-[200px] flex-1">
                <HugeiconsIcon icon={Search01Icon} className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/35" />
                <Input
                  aria-label="Find episode by number or name"
                  placeholder="Number or name"
                  value={episodeQuery}
                  onChange={(e) => { setEpisodeQuery(e.target.value); setEpisodePages({}); }}
                  className="pl-10"
                />
              </div>
              <div role="group" aria-label="Episode watch status" className="flex gap-1 rounded-full bg-white/[0.04] p-1">
                {WATCH_FILTERS.map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={episodeFilter === value}
                    onClick={() => { setEpisodeFilter(value); setEpisodePages({}); }}
                    className={`cask-focus rounded-full px-3.5 py-1.5 text-[13px] font-bold transition ${episodeFilter === value ? "accent-fill" : "text-white/60 hover:text-white"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {sections.length === 0 ? (
              <p className="surface rounded-[14px] p-5 text-white/50">Episode data isn&apos;t available yet.</p>
            ) : visibleSections.length === 0 ? (
              <p className="py-4 text-sm text-white/50">No episodes match this filter.</p>
            ) : (
              <div className="space-y-2">
                {visibleSections.map(({ section, matching }) => {
                  const aired = section.episodes.filter(hasAired);
                  const seenCount = aired.filter((e) => watched.has(key(e.seasonNumber, e.episodeNumber))).length;
                  const allWatched = aired.length > 0 && seenCount === aired.length;
                  const expanded = Boolean(query) || expandedSection === section.id;
                  // A weekly show's year is 52 episodes: not worth a pager for 2 leftover rows.
                  const paged = matching.length > LONG_SEASON;
                  const page = paged ? Math.min(episodePages[section.id] ?? 0, Math.ceil(matching.length / EPISODES_PER_PAGE) - 1) : 0;
                  const visible = paged ? matching.slice(page * EPISODES_PER_PAGE, (page + 1) * EPISODES_PER_PAGE) : matching;
                  return (
                    <div key={section.id}>
                      <div className="overflow-hidden rounded-[12px] bg-white/[0.035]">
                        <div className="flex items-center gap-2 pr-2">
                          <button type="button" disabled={Boolean(query)} onClick={() => setOpenSection(expanded ? null : section.id)} className="cask-focus flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-[12px] pl-3 pr-1 text-left text-sm font-bold text-white transition hover:bg-white/[0.02]" aria-expanded={expanded}>
                            <HugeiconsIcon icon={ArrowRight01Icon} className={`size-3.5 shrink-0 text-white/40 transition-transform duration-150 ${expanded ? "rotate-90" : ""}`} />
                            {section.label}
                            <span className={`ml-auto text-xs font-semibold ${allWatched ? "text-[var(--accent-text)]" : "text-white/45"}`}>
                              {seenCount}/{aired.length}
                            </span>
                          </button>
                          {section.wholeSeason ? (
                            <button
                              onClick={() => toggleSeason(section.seasonNumber, aired, allWatched)}
                              disabled={aired.length === 0}
                              className="cask-focus rounded-full bg-white/5 px-3 py-1 text-[11px] font-bold text-white/70 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
                            >
                              {allWatched ? "Clear season" : "Mark season"}
                            </button>
                          ) : null}
                        </div>
                        {/* The rule doubles as the section's progress bar, like the app. */}
                        <div className="h-0.5 bg-white/[0.05]" aria-hidden>
                          <div className="h-full bg-[var(--accent)]" style={{ width: `${aired.length ? (seenCount / aired.length) * 100 : 0}%` }} />
                        </div>
                      </div>
                      {expanded ? <div className="mb-3 mt-1 flex flex-col">
                        {paged && <nav aria-label={`${section.label} episode pages`} className="flex items-center justify-between py-3 text-sm text-white/70">
                          <button disabled={page === 0} onClick={() => setEpisodePages(p => ({...p,[section.id]:page-1}))} className="disabled:opacity-30">Previous</button>
                          <span>{page * EPISODES_PER_PAGE + 1}–{Math.min((page + 1) * EPISODES_PER_PAGE,matching.length)} of {matching.length}</span>
                          <button disabled={(page + 1) * EPISODES_PER_PAGE >= matching.length} onClick={() => setEpisodePages(p => ({...p,[section.id]:page+1}))} className="disabled:opacity-30">Next</button>
                        </nav>}
                        {visible.map((episode) => {
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
                              <Link
                                href={`/app/titles/${title.id}/episodes/${episode.id}?fromTitle=1${detailQuery}`}
                                onClick={rememberView}
                                className="min-w-0 flex-1 text-left"
                                aria-label={`View details for ${episode.name || `episode ${episode.episodeNumber}`}`}
                              >
                                <p className="truncate text-sm font-semibold text-white">
                                  E{pad(episode.episodeNumber)} · {episode.name ?? "TBA"}
                                </p>
                                <p className="mt-0.5 text-xs text-white/45">{future ? "Airs " : ""}{episode.airDate ? formatAirDate(episode.airDate) : ""}</p>
                              </Link>
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
            <div role="status" className="pointer-events-none sticky bottom-4 z-10 mt-3 flex justify-center">
              {episodeOffer ? (
                <div className="pointer-events-auto flex items-stretch rounded-full border border-white/10 bg-[#14110d] text-sm font-bold text-white shadow-2xl shadow-black/50">
                  <span className="py-3 pl-5 pr-3">{episodeOffer.message}</span>
                  <button
                    type="button"
                    onClick={episodeOffer.onClick}
                    className="cask-focus rounded-r-full border-l border-white/10 px-4 font-extrabold text-[var(--accent-text)] transition hover:bg-white/5"
                  >
                    {episodeOffer.label}
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {tab === "overview" && related.length > 0 ? (
          <section>
            <h2 className="display mb-3 text-base text-white">More like this</h2>
            <div className="nos flex gap-3 overflow-x-auto pb-2">
              {related.slice(0, 12).map((item) => (
                <Link
                  key={item.id}
                  href={`/app/titles/${item.id}?fromDetail=1${detailQuery}`}
                  onClick={rememberView}
                  className="lift w-[112px] shrink-0"
                >
                  <Poster src={item.posterUrl} title={item.title} className="rounded-[12px]" />
                  <p className="mt-2 truncate text-xs font-bold text-white/85">{item.title}</p>
                </Link>
              ))}
            </div>
          </section>
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
    </div>
  );
}

function isAtOrBefore(candidate: Episode, target: Episode): boolean {
  // Specials (Season 0) sit outside the main chronology — marking a regular
  // episode shouldn't sweep up earlier specials.
  if (target.seasonNumber > 0 && candidate.seasonNumber <= 0) return false;
  return (
    candidate.seasonNumber < target.seasonNumber ||
    (candidate.seasonNumber === target.seasonNumber && candidate.episodeNumber <= target.episodeNumber)
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

// A section is a real season, or one air year of a very long one. `wholeSeason`
// marks which, because the season-wide watched action can't target just a year.
type EpisodeSection = { id: string; seasonNumber: number; label: string; wholeSeason: boolean; episodes: Episode[] };

// Some long-running shows are catalogued as one season of hundreds of episodes.
function episodeSections(episodes: Episode[]): EpisodeSection[] {
  const seasons = groupSeasons(episodes);
  return seasons.flatMap(([seasonNumber, list]) => {
    const season = { id: String(seasonNumber), seasonNumber, label: `Season ${seasonNumber}`, wholeSeason: true, episodes: list };
    if (list.length <= LONG_SEASON) return [season];
    const years: EpisodeSection[] = [];
    let year: string | undefined;
    for (const episode of list) {
      // An undated episode stays with the one before it, usually a just-announced one.
      const episodeYear = episode.airDate?.slice(0, 4) ?? year;
      if (episodeYear !== year || years.length === 0) {
        year = episodeYear;
        const yearLabel = year ?? "Undated";
        years.push({
          id: `${seasonNumber}-${years.length}`,
          seasonNumber,
          label: seasons.length > 1 ? `Season ${seasonNumber} · ${yearLabel}` : yearLabel,
          wholeSeason: false,
          episodes: []
        });
      }
      years[years.length - 1].episodes.push(episode);
    }
    return years.length > 1 ? years : [season];
  });
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
