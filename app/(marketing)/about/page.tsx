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
    "TV Cask was built by a solo developer and TV Time user to help people preserve their watch history before the July 15 shutdown.",
  alternates: {
    canonical: "/about"
  },
  openGraph: {
    title: "Why TV Cask Exists | TV Cask",
    description:
      "TV Cask was built by a solo developer and TV Time user to help people preserve their watch history before the July 15 shutdown.",
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
      "TV Cask was built by a solo developer and TV Time user to help people preserve their watch history before the July 15 shutdown.",
    images: ["/og.png"]
  }
};

const milestones = [
  ["Import first", "Preserve TV Time histories before anything else."],
  ["Web first", "Ship the migration workflow quickly, on every device."],
  ["iOS next", "Make everyday tracking feel native and fast."],
  ["Social later", "Add community once private libraries are solid."]
];

const timeline = [
  ["July 15", "Shutdown announced", "TV Time confirms it is closing."],
  ["Days later", "TV Cask built", "A solo, focused rebuild begins."],
  ["Today", "Web launch", "Accounts, import, and tracking live."],
  ["Next", "iOS and social", "Native app and community features."]
];

const proofPoints = [
  "Shows and movies matched",
  "Watched episodes restored",
  "Favorites preserved",
  "Custom lists imported"
];

const visualPosters = [trendingShows[0], trendingShows[4], moviePosters[3], moviePosters[4]];

export default function AboutPage() {
  return (
    <>
      <MarketingHeader />
      <main className="mx-auto max-w-6xl px-5 pb-16 pt-12 sm:pb-20 sm:pt-16">
        <div className="max-w-3xl">
          <p className="eyebrow" style={{ color: "var(--accent-text)" }}>
            Why TV Cask exists
          </p>
          <h1 className="display mt-4 text-4xl leading-[1.05] text-white sm:text-[44px] md:text-[52px]">
            Watch history should not vanish because an app does.
          </h1>

          <div className="mt-7 space-y-5 text-base leading-8 text-white/64 sm:mt-8 sm:text-[17px]">
            <p>
              I am a solo developer, and I used TV Time too. After the announcement that TV Time would end on July 15, I built TV Cask so people could move their history instead of losing it.
            </p>
            <p>
              That history is more than titles. It is <strong className="font-extrabold text-white">watched episodes, shows, movies, favorites, custom lists, and progress</strong>. TV Cask exists because rebuilding years of tracking by hand should not be the only option.
            </p>
            <p>
              The first version is web-first on purpose. A browser was the fastest way to ship accounts, ZIP uploads, catalog matching, and import progress before building the rest of the product.
            </p>
            <p>
              The goal is simple: <strong className="font-extrabold text-white">preserve your data and keep watching</strong>. Once that foundation is stable, TV Cask can grow into native iOS, better discovery, personal lists, social activity, episode reactions, comments, and sharing.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/import-tv-time" className="inline-flex h-12 items-center justify-center rounded-full px-6 text-[15px] font-bold" style={{ background: "var(--accent)", color: "var(--on-accent)" }}>
              Import TV Time <ArrowRight className="ml-2 size-4" />
            </Link>
            <Link href="/signup" className="inline-flex h-12 items-center justify-center rounded-full border border-white/12 px-6 text-[15px] font-bold text-white">
              Create account
            </Link>
          </div>
        </div>

        <section className="hero-glow relative mt-16 grid items-center gap-6 sm:mt-20 lg:grid-cols-[1fr_0.9fr]">
          <div className="min-w-0">
            <p className="eyebrow" style={{ color: "var(--accent-text)" }}>
              Migration proof
            </p>
            <h2 className="display mt-2 text-3xl text-white sm:text-4xl">A library worth saving.</h2>
            <p className="mt-3 max-w-md text-[15px] leading-7 text-white/60">
              The import is not a screenshot. Everything you tracked comes across as real, working data you can keep using.
            </p>
            <div className="mt-6 grid gap-2.5 sm:max-w-md">
              {proofPoints.map((item) => (
                <div key={item} className="card flex items-center gap-3 rounded-[12px] px-4 py-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full" style={{ background: "var(--accent)", color: "var(--on-accent)" }}>
                    <Check className="size-3.5" />
                  </span>
                  <span className="text-sm font-bold text-white/80">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="surface overflow-hidden rounded-[20px] p-3 shadow-2xl shadow-black/30">
            <div className="grid grid-cols-2 gap-3">
              {visualPosters.map((poster) => (
                <div key={poster.title} className="relative overflow-hidden rounded-[14px]">
                  <div className="relative aspect-[2/3]">
                    <Image src={poster.poster} alt="" fill sizes="(max-width: 640px) 44vw, 220px" className="object-cover" />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  </div>
                  <p className="absolute inset-x-3 bottom-3 text-[11px] font-extrabold uppercase leading-tight text-white drop-shadow-lg">
                    {poster.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-16 sm:mt-20">
          <p className="eyebrow" style={{ color: "var(--accent-text)" }}>
            How we got here
          </p>
          <h2 className="display mt-2 text-2xl text-white sm:text-3xl">From shutdown to a new home.</h2>
          <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {timeline.map(([when, title, copy], i) => (
              <li key={title} className="card relative rounded-[16px] p-5">
                <span className="absolute right-4 top-4 text-xs font-bold text-white/25">0{i + 1}</span>
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
