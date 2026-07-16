import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight02Icon, Tick02Icon } from '@hugeicons/core-free-icons';
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getToken } from "@/lib/api";
import { MarketingFooter } from "@/components/marketing/footer";
import { MarketingHeader } from "@/components/marketing/header";
import {
  moviePosters,
  trendingShows,
} from "@/components/marketing/product-showcase";

export const metadata: Metadata = {
  title: "Why tvcask Exists | tvcask",
  description:
    "tvcask was built by a solo developer and TV Time user to preserve watch history before the July 15, 2026 shutdown.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "Why tvcask Exists | tvcask",
    description:
      "tvcask was built by a solo developer and TV Time user to preserve watch history before the July 15, 2026 shutdown.",
    type: "website",
    url: "/about",
    images: [
      {
        url: "/og-brand.png",
        width: 1200,
        height: 630,
        alt: "tvcask watch history and TV Time import preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Why tvcask Exists | tvcask",
    description:
      "tvcask was built by a solo developer and TV Time user to preserve watch history before the July 15, 2026 shutdown.",
    images: ["/og-brand.png"],
  },
};

const milestones = [
  ["Import first", "Preserve TV Time histories before anything else."],
  ["Web first", "Ship the migration workflow quickly, on every device."],
  ["iOS next", "Make everyday tracking feel native and fast."],
  ["Social later", "Add community once private libraries are solid."],
];

const timeline = [
  ["July 15, 2026", "TV Time closes", "People need a safe home for years of history."],
  ["Days later", "tvcask built", "A solo, focused rebuild begins."],
  ["Today", "Web launch", "Accounts, import, and tracking live."],
  ["Next", "iOS and social", "Native app and community features."],
];

const proofPoints = [
  "Shows and movies matched",
  "Watched episodes restored",
  "Favorites preserved",
  "Custom lists imported",
];

const visualPosters = [
  trendingShows[0],
  trendingShows[4],
  moviePosters[3],
  moviePosters[4],
];

export default async function AboutPage() {
  const isAuthenticated = Boolean(await getToken());

  return (
    <>
      <MarketingHeader />
      <main className="mx-auto max-w-6xl px-5 pb-16 pt-12 sm:pb-20 sm:pt-16">
        <section className="grid items-start gap-10 lg:grid-cols-[1fr_0.78fr] lg:gap-14">
          <div className="min-w-0">
            <p className="eyebrow" style={{ color: "var(--accent-text)" }}>
              Why tvcask exists
            </p>
            <h1 className="display mt-4 text-4xl leading-[1.05] text-white sm:text-[44px] md:text-[52px]">
              Watch history should not vanish because an app does.
            </h1>

            <div className="mt-7 space-y-5 text-base leading-8 text-white/64 sm:mt-8 sm:text-[17px]">
              <p>
                I am a solo developer, and I used TV Time too. After the
                announcement that TV Time would end on July 15, 2026, I built tvcask
                so people could move their history instead of losing it.
              </p>
              <p>
                That history is more than titles. It is{" "}
                <strong className="font-extrabold text-white">
                  watched episodes, shows, movies, favorites, custom lists, and
                  progress
                </strong>
                . tvcask exists because rebuilding years of tracking by hand
                should not be the only option.
              </p>
              <p>
                The first version is web-first on purpose. A browser was the
                fastest way to ship accounts, ZIP uploads, catalog matching, and
                import progress before building the rest of the product.
              </p>
              <p>
                The goal is simple:{" "}
                <strong className="font-extrabold text-white">
                  preserve your data and keep watching
                </strong>
                . Once that foundation is stable, tvcask can grow into native
                iOS, better discovery, personal lists, social activity, episode
                reactions, comments, and sharing.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/import-tv-time"
                className="inline-flex h-12 items-center justify-center rounded-full px-6 text-[15px] font-bold"
                style={{
                  background: "var(--accent)",
                  color: "var(--on-accent)",
                }}
              >
                Import TV Time <HugeiconsIcon icon={ArrowRight02Icon} className="ml-2 size-4" />
              </Link>
              <Link
                href={isAuthenticated ? "/app/shows" : "/signup"}
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/12 px-6 text-[15px] font-bold text-white"
              >
                {isAuthenticated ? "Open app" : "Create account"}
              </Link>
            </div>
          </div>

          <div className="hero-glow relative lg:sticky lg:top-24">
            <div className="surface overflow-hidden rounded-[20px] p-3 shadow-2xl shadow-black/30">
              <div className="grid grid-cols-2 gap-3">
                {visualPosters.map((poster) => (
                  <div
                    key={poster.title}
                    className="relative overflow-hidden rounded-[14px]"
                  >
                    <div className="relative aspect-[2/3]">
                      <Image
                        src={poster.poster}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 44vw, 200px"
                        className="object-cover"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                    </div>
                    <p className="absolute inset-x-3 bottom-3 text-[11px] font-extrabold uppercase leading-tight text-white drop-shadow-lg">
                      {poster.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-3 text-center text-xs font-semibold text-white/45">
              A slice of a real imported library.
            </p>
          </div>
        </section>

        <section className="mt-14 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {proofPoints.map((item) => (
            <div
              key={item}
              className="card flex items-center gap-3 rounded-[12px] px-4 py-3"
            >
              <span
                className="grid size-6 shrink-0 place-items-center rounded-full"
                style={{
                  background: "var(--accent)",
                  color: "var(--on-accent)",
                }}
              >
                <HugeiconsIcon icon={Tick02Icon} className="size-3.5" />
              </span>
              <span className="text-sm font-bold text-white/80">{item}</span>
            </div>
          ))}
        </section>

        <section className="mt-16 sm:mt-20">
          <p className="eyebrow" style={{ color: "var(--accent-text)" }}>
            How we got here
          </p>
          <h2 className="display mt-2 text-2xl text-white sm:text-3xl">
            From shutdown to a new home.
          </h2>
          <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {timeline.map(([when, title, copy], i) => (
              <li key={title} className="card relative rounded-[16px] p-5">
                <span className="absolute right-4 top-4 text-xs font-bold text-white/25">
                  0{i + 1}
                </span>
                <p className="eyebrow" style={{ color: "var(--accent-text)" }}>
                  {when}
                </p>
                <p className="display mt-2 text-lg text-white">{title}</p>
                <p className="mt-1.5 text-sm leading-6 text-white/60">{copy}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-10 grid gap-3 sm:grid-cols-2">
          {milestones.map(([title, copy]) => (
            <div key={title} className="card rounded-[16px] p-5">
              <p className="text-sm font-extrabold text-white">{title}</p>
              <p className="mt-1.5 text-sm leading-6 text-white/60">{copy}</p>
            </div>
          ))}
        </section>
      </main>
      <MarketingFooter />
    </>
  );
}
