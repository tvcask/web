import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarketingHeader } from "@/components/marketing/header";
import { HeroProductPreview, MobileComingSoonBanner, TrendingCatalogBand } from "@/components/marketing/product-showcase";
import { Button } from "@/components/ui/button";
import { MarketingFooter } from "@/components/marketing/footer";

const brings = ["Shows", "Movies", "Anime", "K-Dramas", "Episodes", "Favorites", "Lists"];

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
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <span className="eyebrow" style={{ color: "var(--accent-text)" }}>
              For people leaving TV Time
            </span>
            <h1 className="display text-5xl leading-[1.05] md:text-6xl">Your watch history has a new home.</h1>
            <p className="max-w-lg text-lg leading-8 text-white/55">
              Track every show and movie, keep every episode, and continue where you left off.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild className="h-12 px-6 text-[15px]">
                <Link href="/signup">
                  Get started <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" className="h-12 px-6 text-[15px]">
                <Link href="/import-tv-time">Import TV Time</Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {brings.map((item) => (
                <span key={item} className="rounded-full bg-white/5 px-3 py-1 text-[13px] font-semibold text-white/60">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <HeroProductPreview />
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
                A focused import flow for people searching for a TV Time alternative.
              </p>
            </div>
            <span className="inline-flex h-11 shrink-0 items-center justify-center rounded-full border border-white/12 px-5 text-sm font-bold text-white">
              Learn more <ArrowRight className="ml-2 size-4" />
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
                <p className="mt-2 text-sm leading-6 text-white/50">{step.copy}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <MarketingFooter />
    </>
  );
}
