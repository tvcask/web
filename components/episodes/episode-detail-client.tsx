"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Poster } from "@/components/titles/poster";
import type { TitleDetail } from "@/lib/data";
import { formatAirDate, localDate } from "@/lib/dates";
import { mutate } from "@/lib/mutate";
import { toast } from "@/lib/toast";
import type { Episode } from "@/lib/services/types";

const episodeKey = (episode: Episode) => `${episode.seasonNumber}-${episode.episodeNumber}`;
const hasAired = (episode: Episode) => !episode.airDate || episode.airDate <= localDate();

type EpisodeTracking = { tracked: boolean; watched: string[] };

export function EpisodeDetailClient({
  title,
  episodeId,
  mode,
  fromTitle = false,
  returnTo,
  initial
}: {
  title: TitleDetail;
  episodeId: string;
  mode: "app" | "public";
  fromTitle?: boolean;
  returnTo?: string;
  initial?: EpisodeTracking;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState(episodeId);
  const [watched, setWatched] = useState(() => new Set(initial?.watched ?? []));
  const [pending, setPending] = useState(false);
  const [revealed, setRevealed] = useState<string>();

  const episodes = useMemo(
    () => [...title.episodes].sort((left, right) => left.seasonNumber - right.seasonNumber || left.episodeNumber - right.episodeNumber),
    [title.episodes]
  );
  const episode = episodes.find((candidate) => candidate.id === selectedId);
  if (!episode) return <p className="p-8 text-white/55">This episode is no longer available.</p>;

  const regular = episodes.filter((candidate) => candidate.seasonNumber > 0);
  const index = regular.findIndex((candidate) => candidate.id === episode.id);
  const previous = index > 0 ? regular[index - 1] : undefined;
  const next = index >= 0 && index < regular.length - 1 ? regular[index + 1] : undefined;
  const future = !hasAired(episode);
  const trackable = mode === "app" && episode.seasonNumber > 0 && !future;
  const isWatched = watched.has(episodeKey(episode));
  const hideFutureDetails = future && revealed !== episode.id;
  const query = new URLSearchParams();
  if (fromTitle) query.set("fromTitle", "1");
  if (returnTo?.startsWith("/app/")) query.set("returnTo", returnTo);

  function step(target: Episode) {
    setSelectedId(target.id);
    setRevealed(undefined);
    const prefix = mode === "app" ? "/app" : "";
    const suffix = query.toString();
    window.history.replaceState(null, "", `${prefix}/titles/${title.id}/episodes/${target.id}${suffix ? `?${suffix}` : ""}`);
    document.querySelector('[data-episode-scroll]')?.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toggleWatched() {
    if (!episode || !trackable || pending) return;
    const key = episodeKey(episode);
    const nextWatched = new Set(watched);
    if (isWatched) nextWatched.delete(key);
    else nextWatched.add(key);
    setWatched(nextWatched);
    setPending(true);

    mutate(`me/titles/${title.id}/episodes`, "POST", {
      season: episode.seasonNumber,
      episode: episode.episodeNumber,
      episodeId: episode.id,
      watched: !isWatched
    })
      .then(() => {
        toast(isWatched ? "Marked unwatched" : "Marked watched");
        void queryClient.invalidateQueries({ queryKey: ["library"] });
      })
      .catch(() => {
        setWatched(watched);
        toast("Couldn't update this episode. Try again.");
      })
      .finally(() => setPending(false));
  }

  const showHref = mode === "public"
    ? `/titles/${title.id}`
    : `/app/titles/${title.id}${returnTo?.startsWith("/app/") ? `?returnTo=${encodeURIComponent(returnTo)}` : ""}`;
  const meta = [
    episode.airDate ? formatAirDate(episode.airDate) : null,
    episode.runtimeMinutes ? `${episode.runtimeMinutes} min` : null,
    episode.finaleType ? `${episode.finaleType} finale` : null
  ].filter(Boolean).join(" · ");

  return (
    <article data-episode-scroll className="min-h-0 overflow-y-auto overscroll-contain">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-white/[0.04]">
        {!hideFutureDetails && episode.stillUrl ? (
          <Image src={episode.stillUrl} alt="" fill sizes="(max-width: 640px) 100vw, 560px" className="object-cover" priority />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-black/20" />
      </div>

      <div key={episode.id} className="episode-detail-enter px-5 pb-10 sm:px-8">
        {fromTitle && mode === "app" ? (
          <button type="button" onClick={() => router.back()} className="group mx-auto -mt-4 mb-5 flex max-w-[90%] items-center gap-2 rounded-full bg-[#0a0a0c] px-3 py-2 text-sm font-bold text-white/65 ring-1 ring-white/10 transition hover:text-white">
            <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4 transition-transform group-hover:-translate-x-0.5" /> Back to {title.title}
          </button>
        ) : (
          <Link href={showHref} replace={mode === "app"} className="group mx-auto -mt-4 mb-5 flex max-w-[90%] items-center justify-center gap-2 rounded-full bg-[#0a0a0c] px-3 py-2 ring-1 ring-white/10">
            <Poster src={title.posterUrl} title={title.title} className="h-10 w-7 rounded-[5px]" />
            <span className="truncate text-sm font-bold text-white/65 transition group-hover:text-white">{title.title}</span>
            <HugeiconsIcon icon={ArrowRight01Icon} className="size-4 text-white/35" />
          </Link>
        )}

        <div className="flex items-center justify-center gap-4">
          <button type="button" onClick={() => previous && step(previous)} disabled={!previous} aria-label="Previous episode" className="grid size-9 place-items-center rounded-full bg-white/5 text-[var(--accent-text)] transition hover:bg-white/10 disabled:opacity-20">
            <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
          </button>
          <p className="min-w-20 text-center text-xs font-extrabold text-[var(--accent-text)]">S{episode.seasonNumber} · E{episode.episodeNumber}</p>
          <button type="button" onClick={() => next && step(next)} disabled={!next} aria-label="Next episode" className="grid size-9 place-items-center rounded-full bg-white/5 text-[var(--accent-text)] transition hover:bg-white/10 disabled:opacity-20">
            <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
          </button>
        </div>

        <h1 className="display mt-3 text-center text-3xl leading-tight text-white">{hideFutureDetails ? "Upcoming episode" : episode.name || "Episode details"}</h1>
        {meta ? <p className="mt-2 text-center text-sm text-white/45">{meta}</p> : null}

        {mode === "app" ? (
          <button
            type="button"
            onClick={toggleWatched}
            disabled={!trackable || pending}
            aria-pressed={isWatched}
            className={`mt-7 flex min-h-16 w-full items-center gap-3 rounded-full border-2 px-4 text-left transition ${isWatched ? "border-[var(--accent)]" : "border-white/15"} disabled:opacity-55`}
          >
            <span className={`grid size-9 shrink-0 place-items-center rounded-full border-2 ${isWatched ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--on-accent)]" : "border-white/20 text-transparent"}`}>
              <HugeiconsIcon icon={Tick02Icon} className="size-4" />
            </span>
            <span className="min-w-0">
              <span className="block font-extrabold text-white">{future ? "Not aired yet" : episode.seasonNumber <= 0 ? "Special episode" : isWatched ? "Watched" : "Mark as watched"}</span>
              {future && episode.airDate ? <span className="mt-0.5 block text-xs text-white/45">Airs {formatAirDate(episode.airDate)}</span> : null}
            </span>
          </button>
        ) : null}

        <div className="my-7 h-px bg-white/[0.07]" />
        <h2 className="display text-lg text-white">About this episode</h2>
        {hideFutureDetails ? (
          <div className="mt-3 rounded-[14px] border border-white/[0.08] bg-white/[0.03] p-4">
            <p className="text-sm leading-6 text-white/55">Artwork, title, and synopsis are hidden until this episode airs.</p>
            <button type="button" onClick={() => setRevealed(episode.id)} className="mt-3 rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-extrabold text-[var(--on-accent)]">Reveal details</button>
          </div>
        ) : (
          <p className="mt-3 text-[15px] leading-7 text-white/65">{episode.overview?.trim() || "No synopsis is available yet."}</p>
        )}
        {!hideFutureDetails && episode.metadataSource === "tvdb" ? (
          <a href={title.episodeMetadataUrl || "https://thetvdb.com"} target="_blank" rel="noreferrer" className="mt-7 inline-block text-xs font-bold text-[var(--accent-text)]">
            {title.episodeMetadataAttribution || "Episode metadata provided by TheTVDB"} ↗
          </a>
        ) : null}
      </div>
    </article>
  );
}
