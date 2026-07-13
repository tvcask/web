import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight02Icon, CircleIcon, Tick02Icon } from '@hugeicons/core-free-icons';
import Link from "next/link";
import { MarketingHeader } from "@/components/marketing/header";
import { HeroProductPreview, MobileComingSoonBanner, TrendingCatalogBand } from "@/components/marketing/product-showcase";
import { Button } from "@/components/ui/button";
import { MarketingFooter } from "@/components/marketing/footer";

const brings = ["Shows", "Movies", "Anime", "K-Dramas", "Episodes", "Favorites", "Lists"];

const worksToday = [
  "Track shows and movies episode by episode",
  "Favorites and unlimited custom lists",
  "Watch next and unwatched sections",
  "Upcoming release calendar",
  "Full TV Time import"
];

const comingNext = [
  "Native iOS app",
  "Social feed, groups, and friend activity",
  "Public profiles and following",
  "Episode reactions, comments, and sharing"
];

const steps = [
  { n: "01", title: "Upload your export", copy: "Drop in your TV Time ZIP export and keep the files intact." },
  { n: "02", title: "Match your history", copy: "Shows, movies, episodes, favorites, and lists are matched to real metadata." },
  { n: "03", title: "Keep watching", copy: "Confirm, and pick up the next episode right where you left off." }
];

export default function HomePage() {
  return (
    <>
      <MarketingHeader />
      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-12 sm:gap-12 sm:pb-20 sm:pt-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(460px,0.95fr)]">
          <div className="min-w-0 space-y-6">
            <span className="eyebrow" style={{ color: "var(--accent-text)" }}>
              Your history. Your next episode.
            </span>
            <h1 className="display max-w-[680px] text-4xl leading-[1.05] sm:text-5xl md:text-[58px] xl:text-[64px]">
              Your watch history, kept.
            </h1>
            <p className="max-w-lg text-lg leading-8 text-white/55">
              Bring your TV Time history with you, track every show and movie, and pick up exactly where you left off.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild className="h-12 px-6 text-[15px]">
                <Link href="/signup">
                  Get started <HugeiconsIcon icon={ArrowRight02Icon} className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" className="h-12 px-6 text-[15px]">
                <Link href="/import-tv-time">Import TV Time</Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {brings.map((item) => (
                <span key={item} className="whitespace-nowrap rounded-full bg-white/5 px-3 py-1 text-[13px] font-semibold text-white/60">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <HeroProductPreview />
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-16">
          <div className="mb-7 max-w-2xl">
            <p className="eyebrow" style={{ color: "var(--accent-text)" }}>
              Why tvcask
            </p>
            <h2 className="display mt-3 text-3xl leading-tight text-white md:text-4xl">
              Your history is the foundation.
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/60">
              tvcask started with one promise: your years of tracking should move with you. The web app protects that history today, while native mobile and social experiences build on the same library.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="surface rounded-[16px] p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <span className="grid size-7 place-items-center rounded-full bg-emerald-500/12 text-emerald-300">
                  <HugeiconsIcon icon={Tick02Icon} className="size-4" />
                </span>
                <h3 className="display text-lg text-white">Works today</h3>
              </div>
              <div className="space-y-3">
                {worksToday.map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm font-semibold text-white/62">
                    <HugeiconsIcon icon={Tick02Icon} className="size-4 shrink-0 text-emerald-300" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface rounded-[16px] p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <span className="grid size-7 place-items-center rounded-full" style={{ background: "rgba(211,158,94,0.12)", color: "var(--accent-text)" }}>
                  <HugeiconsIcon icon={CircleIcon} className="size-3.5" />
                </span>
                <h3 className="display text-lg text-white">Coming next</h3>
              </div>
              <div className="space-y-3">
                {comingNext.map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm font-semibold text-white/60">
                    <HugeiconsIcon icon={CircleIcon} className="size-3.5 shrink-0" style={{ color: "var(--accent-text)", opacity: 0.5 }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <TrendingCatalogBand />
        <MobileComingSoonBanner />

        <section className="mx-auto max-w-6xl px-5 pb-10">
          <Link href="/import-tv-time" className="surface flex flex-col gap-4 rounded-[16px] p-5 transition hover:bg-white/[0.04] sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <p className="eyebrow" style={{ color: "var(--accent-text)" }}>
                TV Time import
              </p>
              <h2 className="display mt-2 text-2xl text-white">Move your TV Time history, episodes, favorites, and custom lists.</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">
                Preserve years of tracking and continue with one library across web and mobile.
              </p>
            </div>
            <span className="inline-flex h-11 shrink-0 items-center justify-center rounded-full border border-white/12 px-5 text-sm font-bold text-white">
              Learn more <HugeiconsIcon icon={ArrowRight02Icon} className="ml-2 size-4" />
            </span>
          </Link>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-24">
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.n} className="surface rounded-[16px] p-6">
                <span className="display text-sm" style={{ color: "var(--accent-text)" }}>
                  {step.n}
                </span>
                <h3 className="display mt-3 text-lg text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/60">{step.copy}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <MarketingFooter />
    </>
  );
}
