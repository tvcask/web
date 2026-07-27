import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight02Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import Image from "next/image";
import Link from "next/link";
import { AppStoreBadge } from "@/components/marketing/app-store-badge";
import { PhoneFan } from "@/components/marketing/phone-fan";

type Poster = {
  title: string;
  poster: string;
};

export const trendingShows: Poster[] = [
  {
    title: "House of the Dragon",
    poster: "https://image.tmdb.org/t/p/w342/t9XkeE7HzOsdQcDDDapDYh8Rrmt.jpg",
  },
  {
    title: "The Bear",
    poster: "https://image.tmdb.org/t/p/w342/sHFlbKS3WLqMnp9t2ghADIJFnuQ.jpg",
  },
  {
    title: "Severance",
    poster: "https://image.tmdb.org/t/p/w342/pPHpeI2X1qEd1CS1SeyrdhZ4qnT.jpg",
  },
  {
    title: "The Last of Us",
    poster: "https://image.tmdb.org/t/p/w342/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg",
  },
  {
    title: "Jujutsu Kaisen",
    poster: "https://image.tmdb.org/t/p/w342/fHpKWq9ayzSk8nSwqRuaAUemRKh.jpg",
  },
  {
    title: "Demon Slayer",
    poster: "https://image.tmdb.org/t/p/w342/xUfRZu2mi8jH6SzQEJGP6tjBuYj.jpg",
  },
];

export const moviePosters: Poster[] = [
  {
    title: "Dune: Part Two",
    poster: "https://image.tmdb.org/t/p/w342/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
  },
  {
    title: "The Social Network",
    poster: "https://image.tmdb.org/t/p/w342/n0ybibhJtQ5icDqTp8eRytcIHJx.jpg",
  },
  {
    title: "Interstellar",
    poster: "https://image.tmdb.org/t/p/w342/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
  },
  {
    title: "John Wick: Chapter 4",
    poster: "https://image.tmdb.org/t/p/w342/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg",
  },
  {
    title: "Knives Out",
    poster: "https://image.tmdb.org/t/p/w342/pThyQovXQrw2m0s9x82twj48Jq4.jpg",
  },
  {
    title: "The Lord of the Rings",
    poster: "https://image.tmdb.org/t/p/w342/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg",
  },
];

// One rail, shows and movies interleaved. A single row shows about as many
// posters as we have, so nothing visibly repeats; stacking rows would put the
// same twelve titles on screen three times over.
const catalogPosters: Poster[] = [
  trendingShows[0], moviePosters[0],
  trendingShows[2], moviePosters[2],
  trendingShows[4], moviePosters[4],
  trendingShows[1], moviePosters[1],
  trendingShows[3], moviePosters[3],
  trendingShows[5], moviePosters[5],
];

export function HeroProductPreview() {
  return (
    <div className="hero-glow relative">
      <div className="surface overflow-hidden rounded-[18px] p-2 shadow-2xl shadow-black/40">
        <div className="relative aspect-[1966/1240] overflow-hidden rounded-[12px] bg-black">
          <Image
            src="/screens/web-library.jpg"
            alt="A tvcask profile on the web with rows of tracked shows, favorite shows, and movies"
            fill
            sizes="(max-width: 1024px) 100vw, 990px"
            className="object-cover"
            priority
          />
        </div>
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
            <h2 className="display mt-2 text-3xl text-white">
              Track shows and movies visually.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-white/48">
            Browse a poster-first catalog with the same actions people use every
            day: track, favorite, and save titles to personal lists.
          </p>
        </div>

        <div className="relative">
          <MovingPosterRail items={catalogPosters} />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#11100e] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#11100e] to-transparent" />
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-white/[0.06] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-white/45">
            Shows, movies, anime, and K-dramas, with progress, favorites, and
            lists in one place.
          </p>
          <Link
            href="/signup"
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-full px-4 text-sm font-bold"
            style={{ background: "var(--accent)", color: "var(--on-accent)" }}
          >
            Start tracking{" "}
            <HugeiconsIcon icon={ArrowRight02Icon} className="ml-2 size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

const iosHighlights = [
  "Watch next and upcoming episodes",
  "Full catalog, search, and title pages",
  "Badges, levels, and profile stats",
  "Same account and library as the web",
];

const iosScreens = [
  {
    src: "/screens/ios-detail.jpg",
    alt: "tvcask on iPhone showing a show page with rating, where to watch, and cast",
  },
  {
    src: "/screens/ios-shows.jpg",
    alt: "tvcask on iPhone showing the watch list with the next episode for each show",
  },
  {
    src: "/screens/ios-explore.jpg",
    alt: "tvcask on iPhone showing trending shows and movies",
  },
];

export function MobileAppSection() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-10">
      <div className="surface relative overflow-hidden rounded-[18px] p-5 sm:p-8">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(211,158,94,0.14),transparent_38%)]"
          aria-hidden
        />
        <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:items-center">
          <div className="min-w-0">
            <p className="eyebrow" style={{ color: "var(--accent-text)" }}>
              Now on iPhone
            </p>
            <h2 className="display mt-2 max-w-xl text-2xl leading-tight text-white md:text-3xl">
              tvcask for iPhone is out.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/52">
              Same account, same library. Mark episodes on the couch, see what
              airs this week, and browse the catalog from your phone.
            </p>

            <div className="mt-5 space-y-2.5">
              {iosHighlights.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-sm font-semibold text-white/62"
                >
                  <HugeiconsIcon
                    icon={Tick02Icon}
                    className="size-4 shrink-0"
                    style={{ color: "var(--accent-text)" }}
                  />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <AppStoreBadge />
              <Link
                href="/signup"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/12 px-5 text-sm font-bold text-white"
              >
                Start on the web{" "}
                <HugeiconsIcon
                  icon={ArrowRight02Icon}
                  className="ml-2 size-4"
                />
              </Link>
            </div>
          </div>

          <PhoneFan screens={iosScreens} />
        </div>
      </div>
    </section>
  );
}

function MovingPosterRail({ items }: { items: Poster[] }) {
  const loop = [...items, ...items];
  return (
    <div className="relative overflow-hidden">
      <div className="poster-marquee flex w-max gap-3">
        {loop.map((item, index) => (
          <div
            key={`${item.title}-${index}`}
            className="relative w-[92px] shrink-0 overflow-hidden rounded-[12px] sm:w-[112px]"
          >
            <PosterImage item={item} sizes="(max-width: 640px) 92px, 112px" />
          </div>
        ))}
      </div>
    </div>
  );
}

function PosterImage({ item, sizes }: { item: Poster; sizes: string }) {
  return (
    <div className="relative aspect-[2/3] w-full overflow-hidden bg-white/5">
      <Image
        src={item.poster}
        alt=""
        fill
        sizes={sizes}
        className="object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
    </div>
  );
}
