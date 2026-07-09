import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { MarketingFooter } from "@/components/marketing/footer";
import { MarketingHeader } from "@/components/marketing/header";
import { moviePosters, trendingShows } from "@/components/marketing/product-showcase";

export const metadata: Metadata = {
  title: "Why TV Cask Exists | TV Cask",
  description:
    "TV Cask was built to help TV Time users preserve their watch history, then grow into a tracker with mobile and social features.",
  alternates: {
    canonical: "/about"
  },
  openGraph: {
    title: "Why TV Cask Exists | TV Cask",
    description:
      "TV Cask was built to help TV Time users preserve their watch history, then grow into a tracker with mobile and social features.",
    type: "website",
    url: "/about",
    images: [
      {
        url: "/og.png",
        width: 1731,
        height: 909,
        alt: "TV Cask watch history and TV Time import preview"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Why TV Cask Exists | TV Cask",
    description:
      "TV Cask was built to help TV Time users preserve their watch history, then grow into a tracker with mobile and social features.",
    images: ["/og.png"]
  }
};

const milestones = [
  ["Import first", "Preserve TV Time histories before anything else."],
  ["Web first", "Ship the migration workflow across devices quickly."],
  ["Mobile next", "Make everyday tracking feel native and fast."],
  ["Social later", "Bring back community once private libraries are solid."]
];

const visualPosters = [trendingShows[0], trendingShows[4], moviePosters[3], moviePosters[4]];

export default function AboutPage() {
  return (
    <>
      <MarketingHeader />
      <main className="mx-auto max-w-6xl px-5 pb-16 pt-12 sm:pb-20 sm:pt-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_390px] lg:items-start xl:gap-12">
          <article>
            <p className="eyebrow" style={{ color: "var(--accent-text)" }}>
              Why TV Cask exists
            </p>
            <h1 className="display mt-4 max-w-3xl text-4xl leading-[1.05] text-white sm:text-5xl md:text-6xl">
              Watch history should not vanish because an app does.
            </h1>

            <div className="mt-7 space-y-5 text-base leading-8 text-white/64 sm:mt-9 sm:space-y-7 sm:text-[17px]">
              <p>
                TV Cask started with a very practical problem: <strong className="font-extrabold text-white">TV Time users had years of history</strong> stored in one place, and suddenly needed a way to move it somewhere durable.
              </p>
              <p>
                That history is not just a list of titles. It is <strong className="font-extrabold text-white">watched episodes, shows, movies, favorites, custom lists, and progress</strong>. Rebuilding it by hand would be slow, frustrating, and easy to get wrong.
              </p>
              <p>
                So the first version of TV Cask is web-first on purpose. A browser is the fastest place to ship account creation, ZIP uploads, catalog matching, and import progress for everyone. The urgent work was not to build every feature at once. It was to make sure people could <strong className="font-extrabold text-white">preserve their data and keep watching</strong>.
              </p>
              <p>
                Once that foundation is stable, TV Cask can grow into the product it should become: <strong className="font-extrabold text-white">native mobile apps, better discovery, personal lists, social activity, episode reactions, comments, and sharing</strong>.
              </p>
            </div>

            <div className="mt-9 space-y-5 sm:mt-11 sm:space-y-7">
              {milestones.map(([title, copy]) => (
                <div key={title} className="grid gap-2 border-t border-white/[0.08] pt-5 sm:grid-cols-[150px_1fr]">
                  <p className="text-sm font-extrabold text-white">{title}</p>
                  <p className="text-sm leading-6 text-white/52">{copy}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:mt-12 sm:flex-row">
              <Link href="/import-tv-time" className="inline-flex h-12 items-center justify-center rounded-full px-6 text-[15px] font-bold" style={{ background: "var(--accent)", color: "var(--on-accent)" }}>
                Import TV Time <ArrowRight className="ml-2 size-4" />
              </Link>
              <Link href="/signup" className="inline-flex h-12 items-center justify-center rounded-full border border-white/12 px-6 text-[15px] font-bold text-white">
                Create account
              </Link>
            </div>
          </article>

          <aside className="lg:sticky lg:top-28">
            <div className="surface overflow-hidden rounded-[20px] p-4">
              <div className="rounded-[16px] border border-white/[0.08] bg-[#11100e] p-4">
                <p className="eyebrow">Migration proof</p>
                <p className="display mt-2 text-2xl text-white">A library worth saving.</p>
                <div className="mt-5 grid grid-cols-4 gap-2 lg:grid-cols-2 lg:gap-3">
                  {visualPosters.map((poster) => (
                    <div key={poster.title} className="overflow-hidden rounded-[12px]">
                      <div className="relative aspect-[2/3]">
                        <Image src={poster.poster} alt="" fill sizes="(max-width: 1024px) 22vw, 160px" className="object-cover" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 rounded-[16px] border border-white/[0.08] bg-white/[0.035] p-4">
                {[
                  "Shows and movies matched",
                  "Watched episodes restored",
                  "Favorites preserved",
                  "Custom lists imported"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 border-b border-white/[0.06] py-2.5 last:border-b-0">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full" style={{ background: "var(--accent)", color: "var(--on-accent)" }}>
                      <Check className="size-3.5" />
                    </span>
                    <span className="text-sm font-bold text-white/72">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
      <MarketingFooter />
    </>
  );
}
