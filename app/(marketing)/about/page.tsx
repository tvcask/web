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
  ["Web first", "Ship the migration workflow quickly, on every device."],
  ["iOS next", "Make everyday tracking feel native and fast."],
  ["Social later", "Add community once private libraries are solid."]
];

const visualPosters = [trendingShows[0], trendingShows[4], moviePosters[3], moviePosters[4]];

export default function AboutPage() {
  return (
    <>
      <MarketingHeader />
      <main className="mx-auto max-w-6xl px-5 pb-14 pt-10 sm:pb-16 sm:pt-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start xl:gap-10">
          <article>
            <p className="eyebrow" style={{ color: "var(--accent-text)" }}>
              Why TV Cask exists
            </p>
            <h1 className="display mt-4 max-w-3xl text-4xl leading-[1.05] text-white sm:text-5xl md:text-[56px]">
              Watch history should not vanish because an app does.
            </h1>

            <div className="mt-7 space-y-5 text-base leading-8 text-white/64 sm:text-[17px]">
              <p>
                TV Cask started with a practical problem: <strong className="font-extrabold text-white">TV Time users had years of watch history</strong> stored in one place, and needed somewhere durable to move it.
              </p>
              <p>
                That history is more than titles. It is <strong className="font-extrabold text-white">watched episodes, shows, movies, favorites, custom lists, and progress</strong>. Rebuilding that by hand is slow and easy to get wrong.
              </p>
              <p>
                The first version is web-first because that was the fastest way to ship accounts, ZIP uploads, catalog matching, and imports. The goal is simple: <strong className="font-extrabold text-white">preserve your data and keep watching</strong>. iOS and social features come after that foundation is stable.
              </p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {milestones.map(([title, copy]) => (
                <div key={title} className="rounded-[14px] border border-white/[0.08] bg-white/[0.025] p-4">
                  <p className="text-sm font-extrabold text-white">{title}</p>
                  <p className="mt-1.5 text-sm leading-6 text-white/52">{copy}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/import-tv-time" className="inline-flex h-12 items-center justify-center rounded-full px-6 text-[15px] font-bold" style={{ background: "var(--accent)", color: "var(--on-accent)" }}>
                Import TV Time <ArrowRight className="ml-2 size-4" />
              </Link>
              <Link href="/signup" className="inline-flex h-12 items-center justify-center rounded-full border border-white/12 px-6 text-[15px] font-bold text-white">
                Create account
              </Link>
            </div>
          </article>

          <aside className="lg:sticky lg:top-28">
            <div className="surface overflow-hidden rounded-[20px] p-3">
              <div className="rounded-[16px] border border-white/[0.08] bg-[#11100e] p-4">
                <p className="eyebrow">Migration proof</p>
                <p className="display mt-2 text-2xl text-white">A library worth saving.</p>
                <div className="mt-5 grid grid-cols-4 gap-2">
                  {visualPosters.map((poster) => (
                    <div key={poster.title} className="overflow-hidden rounded-[12px]">
                      <div className="relative aspect-[2/3]">
                        <Image src={poster.poster} alt="" fill sizes="(max-width: 1024px) 22vw, 76px" className="object-cover" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 rounded-[16px] border border-white/[0.08] bg-white/[0.035] p-3">
                {[
                  "Shows and movies matched",
                  "Watched episodes restored",
                  "Favorites preserved",
                  "Custom lists imported"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 border-b border-white/[0.06] py-2 last:border-b-0">
                    <span className="grid size-5 shrink-0 place-items-center rounded-full" style={{ background: "var(--accent)", color: "var(--on-accent)" }}>
                      <Check className="size-3" />
                    </span>
                    <span className="text-xs font-bold text-white/72 sm:text-sm">{item}</span>
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
