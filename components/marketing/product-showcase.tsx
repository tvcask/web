import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, ListChecks, Plus, Smartphone, Upload } from "lucide-react";

type Poster = {
  title: string;
  poster: string;
};

export const trendingShows: Poster[] = [
  { title: "House of the Dragon", poster: "https://image.tmdb.org/t/p/w342/t9XkeE7HzOsdQcDDDapDYh8Rrmt.jpg" },
  { title: "The Bear", poster: "https://image.tmdb.org/t/p/w342/sHFlbKS3WLqMnp9t2ghADIJFnuQ.jpg" },
  { title: "Severance", poster: "https://image.tmdb.org/t/p/w342/pPHpeI2X1qEd1CS1SeyrdhZ4qnT.jpg" },
  { title: "The Last of Us", poster: "https://image.tmdb.org/t/p/w342/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg" },
  { title: "Jujutsu Kaisen", poster: "https://image.tmdb.org/t/p/w342/fHpKWq9ayzSk8nSwqRuaAUemRKh.jpg" },
  { title: "Demon Slayer", poster: "https://image.tmdb.org/t/p/w342/xUfRZu2mi8jH6SzQEJGP6tjBuYj.jpg" }
];

export const moviePosters: Poster[] = [
  { title: "Dune: Part Two", poster: "https://image.tmdb.org/t/p/w342/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg" },
  { title: "The Social Network", poster: "https://image.tmdb.org/t/p/w342/n0ybibhJtQ5icDqTp8eRytcIHJx.jpg" },
  { title: "Interstellar", poster: "https://image.tmdb.org/t/p/w342/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg" },
  { title: "John Wick: Chapter 4", poster: "https://image.tmdb.org/t/p/w342/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg" },
  { title: "Knives Out", poster: "https://image.tmdb.org/t/p/w342/pThyQovXQrw2m0s9x82twj48Jq4.jpg" },
  { title: "The Lord of the Rings", poster: "https://image.tmdb.org/t/p/w342/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg" }
];

const importedPosters = [
  trendingShows[4],
  trendingShows[5],
  moviePosters[3],
  moviePosters[4]
];

const catalogPosters = [...trendingShows.slice(0, 5), ...moviePosters.slice(0, 5)];

export function HeroProductPreview() {
  return (
    <div className="hero-glow relative min-w-0">
      <div className="surface overflow-hidden rounded-[20px] p-3 shadow-2xl shadow-black/30">
        <div className="rounded-[16px] border border-white/[0.08] bg-[#11100e] p-3">
          <div className="flex items-start justify-between gap-4 px-1 pb-3">
            <div>
              <p className="eyebrow whitespace-nowrap">Imported from TV Time</p>
              <p className="display mt-1 text-xl text-white">Your library</p>
            </div>
            <span className="whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ background: "rgba(211,158,94,0.14)", color: "var(--accent-text)" }}>
              3,812 episodes
            </span>
          </div>
          <PosterRail items={trendingShows.slice(0, 5)} size="hero" />
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_0.86fr]">
          <div className="rounded-[16px] border border-white/[0.08] bg-white/[0.035] p-3">
            <div className="mb-3 flex items-center gap-2">
              <ListChecks className="size-4" style={{ color: "var(--accent-text)" }} />
              <p className="text-sm font-bold text-white">Animes</p>
              <span className="ml-auto text-xs font-semibold text-white/38">19 titles</span>
            </div>
            <div className="flex -space-x-4 overflow-hidden pb-1">
              {importedPosters.map((item) => (
                <div key={item.title} className="w-[54px] shrink-0 overflow-hidden rounded-[9px] ring-2 ring-[#11100e]">
                  <PosterImage item={item} sizes="54px" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[16px] border border-white/[0.08] bg-white/[0.035] p-3">
            <div className="flex items-center gap-2">
              <Upload className="size-4" style={{ color: "var(--accent-text)" }} />
              <p className="text-sm font-bold text-white">Import complete</p>
            </div>
            <div className="mt-3 space-y-2">
              {[
                ["Shows", "428"],
                ["Movies", "96"],
                ["Lists", "12"]
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <span className="text-white/45">{label}</span>
                  <span className="font-bold text-white">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute -bottom-5 left-6 hidden rounded-full border border-white/[0.08] bg-[#15120f] px-4 py-2 text-sm font-bold text-white shadow-xl shadow-black/30 sm:flex">
        <Check className="mr-2 size-4" style={{ color: "var(--accent-text)" }} />
        Progress restored
      </div>
    </div>
  );
}

export function TrendingCatalogBand() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-14">
      <div className="surface overflow-hidden rounded-[18px] p-5 sm:p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow" style={{ color: "var(--accent-text)" }}>
              Browse what to watch next
            </p>
            <h2 className="display mt-2 text-3xl text-white">Track shows and movies visually.</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-white/48">
            Browse a poster-first catalog with the same actions people use every day: track, favorite, and save titles to personal lists.
          </p>
        </div>

        <MovingPosterRail items={catalogPosters} />

        <div className="mt-5 flex flex-col gap-3 border-t border-white/[0.06] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-white/45">Every poster opens the real title drawer in the app, with progress, favorites, and lists in one place.</p>
          <Link href="/signup" className="inline-flex h-10 shrink-0 items-center justify-center rounded-full px-4 text-sm font-bold" style={{ background: "var(--accent)", color: "var(--on-accent)" }}>
            Start tracking <ArrowRight className="ml-2 size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function MobileComingSoonBanner() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-10">
      <div className="surface relative overflow-hidden rounded-[18px] p-5 sm:p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(211,158,94,0.14),transparent_38%)]" aria-hidden />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="eyebrow" style={{ color: "var(--accent-text)" }}>
              Coming next
            </p>
            <h2 className="display mt-2 max-w-2xl text-2xl leading-tight text-white md:text-3xl">
              tvcask for iPhone is on the way.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/52">
              The same history, progress, favorites, and lists will move with you from the web to a native everyday tracking experience.
            </p>
            <Link href="/about" className="mt-5 inline-flex h-10 items-center justify-center rounded-full border border-white/12 px-4 text-sm font-bold text-white">
              Why I built this <ArrowRight className="ml-2 size-4" />
            </Link>
          </div>

          <div className="sm:w-[250px]">
            <div className="rounded-[18px] border border-white/[0.08] bg-black/18 p-5">
              <div className="flex items-center gap-3">
                <div className="grid size-12 place-items-center rounded-full bg-white/[0.06] text-white/70">
                  <Smartphone className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-white">iOS app</p>
                  <p className="text-xs font-bold uppercase text-white/45">Coming soon</p>
                </div>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                <div className="h-full w-2/3 rounded-full" style={{ background: "var(--accent)" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PosterRail({ items, size, interactive = false }: { items: Poster[]; size: "hero" | "catalog"; interactive?: boolean }) {
  return (
    <div className="nos flex gap-3 overflow-x-auto pb-1">
      {items.map((item, index) => (
        <div
          key={item.title}
          className={size === "hero" ? "relative w-[92px] shrink-0 overflow-hidden rounded-[12px] sm:w-[112px]" : "group relative w-[92px] shrink-0 overflow-hidden rounded-[12px] sm:w-[112px]"}
        >
          <PosterImage item={item} sizes={size === "hero" ? "(max-width: 640px) 92px, 112px" : "(max-width: 640px) 118px, 148px"} />
          {interactive ? <PosterBadge checked={index % 3 === 1} /> : null}
          {size === "hero" ? (
            <p className="absolute inset-x-2 bottom-2 line-clamp-2 text-[9px] font-extrabold uppercase leading-[1.05] text-white drop-shadow-lg">
              {item.title}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function MovingPosterRail({ items }: { items: Poster[] }) {
  const loop = [...items, ...items];
  return (
    <div>
      <h3 className="display mb-3 text-lg text-white">Trending now</h3>
      <div className="relative overflow-hidden">
        <div className="poster-marquee flex w-max gap-3 pb-1">
          {loop.map((item, index) => (
            <div key={`${item.title}-${index}`} className="relative w-[92px] shrink-0 overflow-hidden rounded-[12px] sm:w-[112px]">
              <PosterImage item={item} sizes="(max-width: 640px) 92px, 112px" />
              <PosterBadge checked={index % 4 === 1} />
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#11100e] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#11100e] to-transparent" />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {["Poster-first browsing", "Title drawers", "Progress tracking", "Personal lists"].map((item) => (
          <span key={item} className="rounded-full bg-white/[0.06] px-3 py-1.5 text-xs font-bold text-white/52">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function PosterBadge({ checked }: { checked: boolean }) {
  return (
    <span className="absolute right-2 top-2 grid size-7 place-items-center rounded-full border border-white/20 bg-black/35 text-white shadow-lg shadow-black/25 backdrop-blur" aria-hidden>
      {checked ? <Check className="size-3.5" style={{ color: "var(--accent-text)" }} /> : <Plus className="size-3.5" />}
    </span>
  );
}

function PosterImage({ item, sizes }: { item: Poster; sizes: string }) {
  return (
    <div className="relative aspect-[2/3] w-full overflow-hidden bg-white/5">
      <Image src={item.poster} alt="" fill sizes={sizes} className="object-cover" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
    </div>
  );
}
