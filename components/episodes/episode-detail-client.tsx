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
  embedded = false,
  fromDetail = false,
  initial
}: {
  title: TitleDetail;
  episodeId: string;
  mode: "app" | "public";
  fromTitle?: boolean;
  returnTo?: string;
  embedded?: boolean;
  fromDetail?: boolean;
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
  if (fromDetail) query.set("fromDetail", "1");

  function step(target: Episode) {
    setSelectedId(target.id);
    setRevealed(undefined);
    const prefix = mode === "app" ? "/app" : "";
    const suffix = query.toString();
    window.history.replaceState(null, "", `${prefix}/titles/${title.id}/episodes/${target.id}${suffix ? `?${suffix}` : ""}`);
    const workspace = document.querySelector<HTMLElement>('[data-detail-scroll]');
    if (workspace) workspace.scrollTo({ top: 0, behavior: "smooth" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
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

  const showParams = new URLSearchParams();
  if (returnTo?.startsWith("/app/")) showParams.set("returnTo", returnTo);
  if (embedded) showParams.set("fromDetail", "1");
  const showQuery = showParams.toString();
  const showHref = mode === "public" ? `/titles/${title.id}` : `/app/titles/${title.id}${showQuery ? `?${showQuery}` : ""}`;
  const meta = [
    episode.airDate ? formatAirDate(episode.airDate) : null,
    episode.runtimeMinutes ? `${episode.runtimeMinutes} min` : null,
    episode.finaleType ? `${episode.finaleType} finale` : null
  ].filter(Boolean).join(" · ");

  return (
    <article data-episode-scroll className="mx-auto max-w-[1040px] px-5 py-6 sm:px-8 sm:py-8">
      <div className="grid items-start gap-6 md:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)] md:gap-8">
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[18px] bg-white/[0.04] ring-1 ring-white/[0.08] md:sticky md:top-8">
          {!hideFutureDetails && episode.stillUrl ? (
            <Image src={episode.stillUrl} alt="" fill sizes="(max-width: 767px) 100vw, 640px" className="object-cover" priority />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10" />
        </div>

        <div key={episode.id} className="episode-detail-enter min-w-0">
          {fromTitle && mode === "app" ? (
            embedded ? (
              <p className="mb-5 truncate text-xs font-extrabold uppercase tracking-[0.12em] text-white/35">{title.title}</p>
            ) : (
              <button type="button" onClick={() => router.back()} className="group mb-5 flex items-center gap-2 text-sm font-bold text-white/60 transition hover:text-white">
                <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4 transition-transform group-hover:-translate-x-0.5" /> Back to {title.title}
              </button>
            )
          ) : (
            <Link href={showHref} replace={mode === "app" && !embedded} className="group mb-5 inline-flex max-w-full items-center gap-2.5 rounded-full bg-white/[0.04] py-1.5 pl-1.5 pr-3 ring-1 ring-white/[0.08]">
              <Poster src={title.posterUrl} title={title.title} className="h-9 w-6 rounded-[4px]" />
              <span className="truncate text-xs font-bold text-white/60 transition group-hover:text-white">{title.title}</span>
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5 shrink-0 text-white/30" />
            </Link>
          )}

          <div className="flex items-center gap-3">
            <button type="button" onClick={() => previous && step(previous)} disabled={!previous} aria-label="Previous episode" className="grid size-9 place-items-center rounded-full bg-white/5 text-[var(--accent-text)] transition hover:bg-white/10 disabled:opacity-20">
              <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
            </button>
            <p className="min-w-16 text-center text-xs font-extrabold text-[var(--accent-text)]">S{episode.seasonNumber} · E{episode.episodeNumber}</p>
            <button type="button" onClick={() => next && step(next)} disabled={!next} aria-label="Next episode" className="grid size-9 place-items-center rounded-full bg-white/5 text-[var(--accent-text)] transition hover:bg-white/10 disabled:opacity-20">
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
            </button>
          </div>

          <h1 className="display mt-4 text-3xl leading-tight text-white">{hideFutureDetails ? "Upcoming episode" : episode.name || "Episode details"}</h1>
          {meta ? <p className="mt-2 text-sm text-white/45">{meta}</p> : null}

          {mode === "app" ? (
            <button
              type="button"
              onClick={toggleWatched}
              disabled={!trackable || pending}
              aria-pressed={isWatched}
              className={`mt-6 flex min-h-14 w-full items-center gap-3 rounded-[14px] border px-3.5 text-left transition ${isWatched ? "border-[var(--accent)] bg-[var(--accent)]/5" : "border-white/12 bg-white/[0.025]"} disabled:opacity-55`}
            >
              <span className={`grid size-8 shrink-0 place-items-center rounded-full border-2 ${isWatched ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--on-accent)]" : "border-white/20 text-transparent"}`}>
                <HugeiconsIcon icon={Tick02Icon} className="size-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-extrabold text-white">{future ? "Not aired yet" : episode.seasonNumber <= 0 ? "Special episode" : isWatched ? "Watched" : "Mark as watched"}</span>
                {future && episode.airDate ? <span className="mt-0.5 block text-xs text-white/45">Airs {formatAirDate(episode.airDate)}</span> : null}
              </span>
            </button>
          ) : null}

          <div className="my-6 h-px bg-white/[0.07]" />
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
            <a href={title.episodeMetadataUrl || "https://thetvdb.com"} target="_blank" rel="noreferrer" className="mt-6 inline-block text-xs font-bold text-[var(--accent-text)]">
              {title.episodeMetadataAttribution || "Episode metadata provided by TheTVDB"} ↗
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
