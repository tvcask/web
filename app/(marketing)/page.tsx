import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight02Icon, Tick02Icon } from '@hugeicons/core-free-icons';
import Link from "next/link";
import { AiConversation } from "@/components/marketing/ai-conversation";
import { MarketingHeader } from "@/components/marketing/header";
import { HeroProductPreview, MobileAppSection, TrendingCatalogBand } from "@/components/marketing/product-showcase";
import { AppStoreBadge } from "@/components/marketing/app-store-badge";
import { Reveal } from "@/components/marketing/reveal";
import { Button } from "@/components/ui/button";
import { MarketingFooter } from "@/components/marketing/footer";

const aiHighlights = [
  "Recommendations that skip what you've already seen",
  "Sort your library into lists from a chat",
  "Read-only unless you allow changes"
];

const worksToday = [
  "Track shows and movies episode by episode",
  "iPhone app on the App Store",
  "Favorites and unlimited custom lists",
  "Watch next and unwatched sections",
  "Upcoming release calendar",
  "Full TV Time import"
];

export default function HomePage() {
  return (
    <>
      <MarketingHeader />
      <main>
        <section className="mx-auto max-w-6xl px-5 pb-16 pt-8 sm:pb-20 sm:pt-12">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow" style={{ color: "var(--accent-text)" }}>
              Now on web and iPhone
            </span>
            <h1 className="display mt-4 text-4xl leading-[1.05] sm:text-5xl md:text-[58px] xl:text-[64px]">
              Your watch history, kept.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-white/55">
              Track every show and movie, see what airs next, and pick up exactly where you left off.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild className="h-12 px-6 text-[15px]">
                <Link href="/signup">
                  Get started <HugeiconsIcon icon={ArrowRight02Icon} className="size-4" />
                </Link>
              </Button>
              <AppStoreBadge />
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-5xl">
            <HeroProductPreview />
          </div>
        </section>

        <Reveal className="mx-auto max-w-6xl px-5 pb-16">
          <div className="max-w-2xl">
            <p className="eyebrow" style={{ color: "var(--accent-text)" }}>
              Why tvcask
            </p>
            <h2 className="display mt-3 text-3xl leading-tight text-white md:text-4xl">
              Your history is the foundation.
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/60">
              tvcask started with one promise: your years of tracking should move with you. That history now lives in the web app and the iPhone app, on one account.
            </p>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {worksToday.map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm font-semibold text-white/62">
                <HugeiconsIcon icon={Tick02Icon} className="size-4 shrink-0 text-emerald-300" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <MobileAppSection />
        </Reveal>

        <Reveal>
          <section className="mx-auto max-w-6xl px-5 pb-10">
            <div className="surface relative overflow-hidden rounded-[18px] p-5 sm:p-8">
              <div
                className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(211,158,94,0.14),transparent_38%)]"
                aria-hidden
              />
              <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)] lg:items-center">
                <div className="min-w-0">
                  <p className="eyebrow" style={{ color: "var(--accent-text)" }}>
                    Works with ChatGPT
                  </p>
                  <h2 className="display mt-2 max-w-xl text-2xl leading-tight text-white md:text-3xl">
                    Your history, in the conversation.
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-white/52">
                    Connect tvcask and your assistant can check what you&apos;ve actually watched before it answers.
                  </p>
                  <div className="mt-5 space-y-2.5">
                    {aiHighlights.map((item) => (
                      <div key={item} className="flex items-center gap-3 text-sm font-semibold text-white/62">
                        <HugeiconsIcon icon={Tick02Icon} className="size-4 shrink-0" style={{ color: "var(--accent-text)" }} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/ai" className="mt-6 inline-flex items-center text-sm font-bold text-white transition hover:text-white/70">
                    See how it works <HugeiconsIcon icon={ArrowRight02Icon} className="ml-1.5 size-4" />
                  </Link>
                </div>
                <AiConversation />
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <TrendingCatalogBand />
        </Reveal>

        <Reveal className="mx-auto max-w-6xl px-5 pb-24">
          <Link
            href="/import-tv-time"
            className="flex flex-col gap-2 rounded-[14px] border border-white/[0.07] px-5 py-4 text-sm transition hover:bg-white/[0.03] sm:flex-row sm:items-center sm:justify-between"
          >
            <span className="text-white/55">
              <span className="font-bold text-white/80">Coming from TV Time?</span> If you exported your data before the shutdown, you can still import it.
            </span>
            <span className="inline-flex shrink-0 items-center font-bold text-white">
              Import your export <HugeiconsIcon icon={ArrowRight02Icon} className="ml-1.5 size-4" />
            </span>
          </Link>
        </Reveal>
      </main>
      <MarketingFooter />
    </>
  );
}
