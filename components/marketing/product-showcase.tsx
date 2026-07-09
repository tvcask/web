import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, ListChecks, Plus, Upload } from "lucide-react";

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

export function HeroProductPreview() {
  return (
    <div className="relative">
      <div className="surface overflow-hidden rounded-[20px] p-3 shadow-2xl shadow-black/30">
        <div className="rounded-[16px] border border-white/[0.08] bg-[#11100e] p-3">
          <div className="flex items-center justify-between px-1 pb-3">
            <div>
              <p className="eyebrow">Imported from TV Time</p>
              <p className="display mt-1 text-xl text-white">Your library</p>
            </div>
            <span className="rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ background: "rgba(211,158,94,0.14)", color: "var(--accent-text)" }}>
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
            Browse a poster-first catalog, open a title, and add it to your watchlist or personal lists.
          </p>
        </div>

        <CatalogRail title="Trending now" items={[...trendingShows.slice(0, 4), ...moviePosters.slice(0, 4)]} />

        <div className="mt-5 flex flex-col gap-3 border-t border-white/[0.06] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-white/45">Every poster becomes a title drawer, progress tracker, and list item in the app.</p>
          <Link href="/signup" className="inline-flex h-10 shrink-0 items-center justify-center rounded-full px-4 text-sm font-bold" style={{ background: "var(--accent)", color: "var(--on-accent)" }}>
            Start tracking <ArrowRight className="ml-2 size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function CatalogRail({ title, items }: { title: string; items: Poster[] }) {
  return (
    <div>
      <h3 className="display mb-3 text-lg text-white">{title}</h3>
      <PosterRail items={items} size="catalog" interactive />
    </div>
  );
}

function PosterRail({ items, size, interactive = false }: { items: Poster[]; size: "hero" | "catalog"; interactive?: boolean }) {
  return (
    <div className="nos flex gap-3 overflow-x-auto pb-1">
      {items.map((item, index) => (
        <div
          key={item.title}
          className={size === "hero" ? "w-[92px] shrink-0 overflow-hidden rounded-[12px] sm:w-[112px]" : "group relative w-[92px] shrink-0 overflow-hidden rounded-[12px] sm:w-[112px]"}
        >
          <PosterImage item={item} sizes={size === "hero" ? "(max-width: 640px) 92px, 112px" : "(max-width: 640px) 118px, 148px"} />
          {interactive ? (
            <span
              className="absolute right-2 top-2 grid size-7 place-items-center rounded-full border border-white/20 bg-black/35 text-white shadow-lg shadow-black/25 backdrop-blur"
              aria-hidden
            >
              {index % 3 === 1 ? <Check className="size-3.5" style={{ color: "var(--accent-text)" }} /> : <Plus className="size-3.5" />}
            </span>
          ) : null}
        </div>
      ))}
    </div>
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
