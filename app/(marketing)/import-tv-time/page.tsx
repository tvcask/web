import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, Check, FileUp, ListChecks, Lock, Search } from "lucide-react";
import { MarketingHeader } from "@/components/marketing/header";
import { Button } from "@/components/ui/button";
import { TmdbAttribution } from "@/components/tmdb-attribution";

const title = "Import your TV Time history into TV Cask";
const description =
  "Move your TV Time export to TV Cask with shows, movies, watched episodes, favorites, and custom lists preserved.";

export const metadata: Metadata = {
  title: "Import TV Time Data | TV Cask",
  description,
  alternates: {
    canonical: "/import-tv-time"
  },
  openGraph: {
    title,
    description,
    type: "website",
    url: "/import-tv-time"
  }
};

const features = [
  { icon: FileUp, title: "TV Time ZIP import", copy: "Upload the export file you downloaded from TV Time." },
  { icon: Check, title: "Watched episodes", copy: "Keep season and episode progress attached to your account." },
  { icon: ListChecks, title: "Custom lists", copy: "Bring over user lists and the titles inside them." },
  { icon: CalendarDays, title: "Up next and calendar", copy: "Continue from your local TV Cask library after import." }
];

const steps = [
  { n: "01", title: "Export from TV Time", copy: "Download your TV Time data export and keep the ZIP intact." },
  { n: "02", title: "Upload to TV Cask", copy: "TV Cask reads shows, movies, episodes, favorites, and lists from the file." },
  { n: "03", title: "Match real titles", copy: "TVDB and IMDb identifiers are resolved to TMDB catalog entries." },
  { n: "04", title: "Keep watching", copy: "Your imported library becomes your watchlist, progress, lists, and profile." }
];

const faqs = [
  {
    q: "Can I import my TV Time custom lists?",
    a: "Yes. TV Cask imports TV Time custom lists and the titles inside each list when they can be matched to the catalog."
  },
  {
    q: "Do watched episodes carry over from TV Time?",
    a: "Yes. TV Cask imports watched episode progress for shows, including season and episode numbers from the export."
  },
  {
    q: "What file do I upload?",
    a: "Upload the ZIP export you downloaded from TV Time. TV Cask reads the series, movies, and lists files inside it."
  },
  {
    q: "Is TV Cask a TV Time alternative?",
    a: "TV Cask is built as a watch history and tracking home for shows and movies, with TV Time import support for users moving over."
  },
  {
    q: "Is my TV Time data private?",
    a: "Imports are attached to your TV Cask account. Your library and lists are not public unless you choose public list settings later."
  }
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a
    }
  }))
};

export default function ImportTvTimePage() {
  return (
    <>
      <MarketingHeader />
      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-14 lg:grid-cols-[1fr_0.95fr]">
          <div className="space-y-6">
            <span className="eyebrow" style={{ color: "var(--accent-text)" }}>
              TV Time import
            </span>
            <h1 className="display max-w-3xl text-5xl leading-[1.05] text-white md:text-6xl">{title}</h1>
            <p className="max-w-xl text-lg leading-8 text-white/58">
              Move your watch history without starting over. TV Cask imports shows, movies, watched episodes, favorites, and custom lists from your TV Time export.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild className="h-12 px-6 text-[15px]">
                <Link href="/signup">
                  Create account <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" className="h-12 px-6 text-[15px]">
                <Link href="/login">Import now</Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {["Shows", "Movies", "Episodes", "Favorites", "Custom lists"].map((item) => (
                <span key={item} className="rounded-full bg-white/5 px-3 py-1 text-[13px] font-semibold text-white/60">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="surface overflow-hidden rounded-[18px] p-4">
            <div className="rounded-[14px] border border-white/[0.08] bg-[#11100e] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="eyebrow">Import preview</p>
                  <p className="display mt-2 text-2xl text-white">TV Time export</p>
                </div>
                <div className="grid size-11 place-items-center rounded-full" style={{ background: "var(--accent)", color: "var(--on-accent)" }}>
                  <FileUp className="size-5" />
                </div>
              </div>
              <div className="mt-5 space-y-2.5">
                {[
                  ["Shows matched", "428"],
                  ["Movies matched", "96"],
                  ["Watched episodes", "3,812"],
                  ["Custom lists", "12"]
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded-[10px] bg-white/[0.04] px-3 py-2.5">
                    <span className="text-sm font-semibold text-white/58">{label}</span>
                    <span className="display text-base text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {["Watching", "Favorites", "Lists"].map((item) => (
                <div key={item} className="rounded-[12px] bg-white/[0.04] px-3 py-3">
                  <Check className="size-4" style={{ color: "var(--accent-text)" }} />
                  <p className="mt-2 truncate text-xs font-bold text-white/70">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-16">
          <div className="grid gap-4 md:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="surface rounded-[16px] p-5">
                  <Icon className="size-5" style={{ color: "var(--accent-text)" }} />
                  <h2 className="display mt-4 text-lg text-white">{feature.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-white/50">{feature.copy}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-16">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <span className="eyebrow" style={{ color: "var(--accent-text)" }}>
                How it works
              </span>
              <h2 className="display mt-2 text-3xl text-white">From TV Time export to TV Cask library.</h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {steps.map((step) => (
              <div key={step.n} className="rounded-[16px] border border-white/[0.08] bg-white/[0.025] p-5">
                <span className="display text-sm" style={{ color: "var(--accent-text)" }}>
                  {step.n}
                </span>
                <h3 className="display mt-4 text-lg text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/50">{step.copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-4 px-5 pb-20 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="surface rounded-[16px] p-6">
            <Search className="size-5" style={{ color: "var(--accent-text)" }} />
            <h2 className="display mt-4 text-2xl text-white">A TV Time alternative built around your history.</h2>
            <p className="mt-3 text-sm leading-7 text-white/55">
              The import is not a one-time vanity metric. Your TV Time data becomes working TV Cask data: profile counts, progress, title detail, lists, and continued tracking.
            </p>
            <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-white/50">
              <Lock className="size-4" /> Account-based import
            </div>
          </div>

          <div className="surface rounded-[16px] p-6">
            <h2 className="display text-2xl text-white">TV Time import FAQ</h2>
            <div className="mt-4 divide-y divide-white/[0.06]">
              {faqs.map((faq) => (
                <details key={faq.q} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-white [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <span className="text-white/30 transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-white/52">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="mx-auto w-full max-w-6xl px-5 py-10">
        <div className="flex flex-col gap-3 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/40">© {new Date().getFullYear()} TV Cask</p>
          <TmdbAttribution />
        </div>
      </footer>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd)
        }}
      />
    </>
  );
}
