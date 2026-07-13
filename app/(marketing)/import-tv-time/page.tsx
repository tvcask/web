import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Chrome,
  Download,
  FileUp,
  ListChecks,
  Lock,
  Search,
} from "lucide-react";
import { MarketingFooter } from "@/components/marketing/footer";
import { MarketingHeader } from "@/components/marketing/header";
import { Button } from "@/components/ui/button";

const title = "Move your TV Time watch history to tvcask";
const description =
  "Import your official TV Time GDPR ZIP or TV Time Out export into tvcask. Keep shows, movies, watched episodes, favorites, and custom lists.";

export const metadata: Metadata = {
  title: "TV Time Alternative: Import Your Watch History | tvcask",
  description,
  alternates: {
    canonical: "/import-tv-time",
  },
  openGraph: {
    title: "TV Time alternative with watch history import",
    description,
    type: "website",
    url: "/import-tv-time",
    images: [
      {
        url: "/og-brand.png",
        width: 1200,
        height: 630,
        alt: "tvcask TV Time import preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TV Time alternative with watch history import",
    description,
    images: ["/og-brand.png"],
  },
};

const features = [
  {
    icon: FileUp,
    title: "Official TV Time import",
    copy: "Upload the GDPR ZIP downloaded from TV Time. TV Time Out ZIP files are supported too.",
  },
  {
    icon: Check,
    title: "Watched episodes",
    copy: "Keep season and episode progress attached to your account.",
  },
  {
    icon: ListChecks,
    title: "Custom lists",
    copy: "Bring over user lists and the titles inside them.",
  },
  {
    icon: CalendarDays,
    title: "Up next and calendar",
    copy: "Continue from your local tvcask library after import.",
  },
];

const steps = [
  {
    n: "01",
    title: "Export from TV Time",
    copy: "Request your data from the official TV Time GDPR page and keep the downloaded ZIP intact.",
  },
  {
    n: "02",
    title: "Upload to tvcask",
    copy: "tvcask reads shows, movies, episodes, favorites, and lists from the file.",
  },
  {
    n: "03",
    title: "Match real titles",
    copy: "TVDB and IMDb identifiers are resolved to TMDB catalog entries.",
  },
  {
    n: "04",
    title: "Keep watching",
    copy: "Your imported library becomes your watchlist, progress, lists, and profile.",
  },
];

const exportOptions = [
  {
    icon: Download,
    label: "Recommended",
    title: "Official TV Time GDPR export",
    copy: "Request your data directly from TV Time, then upload the gdpr-data.zip file without extracting it.",
    details: ["Shows and movies", "Watched episodes", "Favorites and custom lists"],
  },
  {
    icon: Chrome,
    label: "Also supported",
    title: "TV Time Out Chrome extension",
    copy: "Already exported with TV Time Out? Upload the ZIP created by the extension. There is no need to export again.",
    details: ["Chrome and Edge", "One ZIP upload", "Existing exports keep working"],
  },
];

const faqs = [
  {
    q: "How do I export my data from TV Time?",
    a: "Open the official TV Time GDPR self-service page, sign in, request your data, and download gdpr-data.zip when it is ready. Keep the ZIP intact and upload it to tvcask.",
  },
  {
    q: "Can I import my TV Time custom lists?",
    a: "Yes. tvcask imports TV Time custom lists and the titles inside each list when they can be matched to the catalog.",
  },
  {
    q: "Do watched episodes carry over from TV Time?",
    a: "Yes. tvcask imports watched episode progress for shows, including season and episode numbers from the export.",
  },
  {
    q: "What file do I upload?",
    a: "Upload the official gdpr-data.zip downloaded from TV Time. tvcask also supports ZIP files created by the TV Time Out Chrome extension.",
  },
  {
    q: "Can I import a ZIP created by the TV Time Out extension?",
    a: "Yes. tvcask supports ZIP files created by the TV Time Out Chrome extension as well as the official TV Time GDPR export.",
  },
  {
    q: "Is tvcask a TV Time alternative?",
    a: "tvcask is built as a watch history and tracking home for shows and movies, with TV Time import support for users moving over.",
  },
  {
    q: "Is my TV Time data private?",
    a: "tvcask reads only the watch history files it needs. Account credentials, tokens, IP addresses, and device files in the official archive are ignored. The ZIP is not stored after it is parsed.",
  },
  {
    q: "What happens when a title cannot be matched?",
    a: "TV Time and tvcask rely on different catalog identifiers. tvcask uses the identifiers and title details available in the export. Titles with incomplete or conflicting source data may remain unmatched and are skipped instead of being linked to the wrong title.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a,
    },
  })),
};

export default function ImportTvTimePage() {
  return (
    <>
      <MarketingHeader />
      <main>
        <section className="hero-glow relative mx-auto grid max-w-6xl items-center gap-10 px-5 pb-14 pt-12 sm:pb-16 sm:pt-14 lg:grid-cols-[1fr_0.95fr]">
          <div className="space-y-6">
            <span className="eyebrow" style={{ color: "var(--accent-text)" }}>
              TV Time alternative and import
            </span>
            <h1 className="display max-w-3xl text-4xl leading-[1.05] text-white sm:text-5xl md:text-6xl">
              {title}
            </h1>
            <p className="max-w-xl text-lg leading-8 text-white/58">
              Import your official TV Time GDPR export or TV Time Out ZIP.
              Keep your shows, movies, watched episodes, favorites, and custom
              lists in a tracker you can continue using.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild className="h-12 px-6 text-[15px]">
                <a href="https://gdpr.tvtime.com/gdpr/self-service" target="_blank" rel="noreferrer">
                  Get TV Time export <ArrowRight className="size-4" />
                </a>
              </Button>
              <Button
                asChild
                variant="secondary"
                className="h-12 px-6 text-[15px]"
              >
                <Link href="/signup?returnTo=%2Fapp%2Fimport">Import into tvcask</Link>
              </Button>
            </div>
            <p className="text-sm font-semibold text-white/48">
              TV Time shuts down on July 15, 2026. Save a local copy before then.
            </p>
            <p className="text-sm text-white/48">
              Prefer the browser extension?{" "}
              <a
                href="https://chromewebstore.google.com/detail/tv-time-out-by-refract/pmejpdpjbkjklfceogdkolmgclldogbi"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-[color:var(--accent-text)] underline underline-offset-2"
              >
                Open TV Time Out
              </a>
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {["Shows", "Movies", "Episodes", "Favorites", "Custom lists"].map(
                (item) => (
                  <span
                    key={item}
                    className="whitespace-nowrap rounded-full bg-white/5 px-3 py-1 text-[13px] font-semibold text-white/60"
                  >
                    {item}
                  </span>
                ),
              )}
            </div>
          </div>

          <div className="surface overflow-hidden rounded-[18px] p-4">
            <div className="rounded-[14px] border border-white/[0.08] bg-[#11100e] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="eyebrow">Import preview</p>
                  <p className="display mt-2 text-2xl text-white">
                    TV Time export
                  </p>
                </div>
                <div
                  className="grid size-11 place-items-center rounded-full"
                  style={{
                    background: "var(--accent)",
                    color: "var(--on-accent)",
                  }}
                >
                  <FileUp className="size-5" />
                </div>
              </div>
              <div className="mt-5 space-y-2.5">
                {[
                  ["Shows matched", "428"],
                  ["Movies matched", "96"],
                  ["Watched episodes", "3,812"],
                  ["Custom lists", "12"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-[10px] bg-white/[0.04] px-3 py-2.5"
                  >
                    <span className="text-sm font-semibold text-white/58">
                      {label}
                    </span>
                    <span className="display text-base text-white">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {["Watching", "Favorites", "Lists"].map((item) => (
                <div
                  key={item}
                  className="rounded-[12px] bg-white/[0.04] px-3 py-3"
                >
                  <Check
                    className="size-4"
                    style={{ color: "var(--accent-text)" }}
                  />
                  <p className="mt-2 truncate text-xs font-bold text-white/70">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-16">
          <div className="mb-6 max-w-3xl">
            <span className="eyebrow" style={{ color: "var(--accent-text)" }}>
              Choose your export
            </span>
            <h2 className="display mt-2 text-3xl text-white">
              Two ways to import your TV Time data.
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/58">
              The official GDPR export is the simplest option. If you already
              used the TV Time Out browser extension, that ZIP works too.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {exportOptions.map((option) => {
              const Icon = option.icon;
              return (
                <article key={option.title} className="surface rounded-[16px] p-6">
                  <div className="flex items-center justify-between gap-4">
                    <span
                      className="grid size-10 place-items-center rounded-full"
                      style={{ background: "rgba(211,158,94,0.12)" }}
                    >
                      <Icon className="size-5" style={{ color: "var(--accent-text)" }} />
                    </span>
                    <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs font-bold text-white/55">
                      {option.label}
                    </span>
                  </div>
                  <h3 className="display mt-5 text-xl text-white">{option.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/58">{option.copy}</p>
                  <ul className="mt-5 space-y-2.5">
                    {option.details.map((detail) => (
                      <li key={detail} className="flex items-center gap-2.5 text-sm font-semibold text-white/62">
                        <Check className="size-4 shrink-0" style={{ color: "var(--accent-text)" }} />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-16">
          <div className="mb-6 max-w-2xl">
            <span className="eyebrow" style={{ color: "var(--accent-text)" }}>
              What transfers
            </span>
            <h2 className="display mt-2 text-3xl text-white">
              Keep the TV Time history that matters.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="surface rounded-[16px] p-5">
                  <span
                    className="grid size-9 place-items-center rounded-full"
                    style={{ background: "rgba(211,158,94,0.12)" }}
                  >
                    <Icon
                      className="size-4"
                      style={{ color: "var(--accent-text)" }}
                    />
                  </span>
                  <h3 className="display mt-4 text-lg text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-white/58">
                    {feature.copy}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-16">
          <div className="surface rounded-[16px] p-6 sm:p-8">
            <div className="max-w-3xl">
              <span className="eyebrow" style={{ color: "var(--accent-text)" }}>
                How matching works
              </span>
              <h2 className="display mt-2 text-3xl text-white">
                Your TV Time history is matched carefully.
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/62">
                TV Time exports TVDB and IMDb identifiers for many titles.
                tvcask uses those identifiers first, then checks the title and
                release year when the official export does not provide a usable
                catalog ID. Matched entries become normal tvcask library data,
                so you can keep tracking after the import.
              </p>
              <p className="mt-3 text-sm leading-7 text-white/52">
                Catalogs are not identical. Some titles may remain
                unmatched when the export is incomplete or the source catalogs
                disagree. Those titles are skipped instead of being linked to
                the wrong show or movie.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-16">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <span className="eyebrow" style={{ color: "var(--accent-text)" }}>
                How it works
              </span>
              <h2 className="display mt-2 text-3xl text-white">
                From TV Time export to tvcask library.
              </h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {steps.map((step) => (
              <div key={step.n} className="card rounded-[16px] p-5">
                <span
                  className="display text-sm"
                  style={{ color: "var(--accent-text)" }}
                >
                  {step.n}
                </span>
                <h3 className="display mt-4 text-lg text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/58">
                  {step.copy}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-4 px-5 pb-20 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="surface rounded-[16px] p-6">
            <Search
              className="size-5"
              style={{ color: "var(--accent-text)" }}
            />
            <h2 className="display mt-4 text-2xl text-white">
              A TV Time alternative built around your history.
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/62">
              Your imported TV Time data becomes working tvcask data: profile
              counts, episode progress, title details, lists, and continued
              tracking across the web app and the upcoming iOS app.
            </p>
            <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-white/58">
              <Lock
                className="size-4"
                style={{ color: "var(--accent-text)" }}
              />{" "}
              Account-based import
            </div>
          </div>

          <div className="surface rounded-[16px] p-6">
            <h2 className="display text-2xl text-white">TV Time import FAQ</h2>
            <div className="mt-4 divide-y divide-white/[0.1]">
              {faqs.map((faq) => (
                <details key={faq.q} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-white [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <span
                      className="text-lg leading-none text-white/40 transition group-open:rotate-45"
                      style={{ color: "var(--accent-text)" }}
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-white/62">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
        <p className="mx-auto max-w-6xl px-5 pb-10 text-xs font-semibold text-white/35">
          Updated July 13, 2026. tvcask is not affiliated with TV Time or Whip Media.
        </p>
      </main>
      <MarketingFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd),
        }}
      />
    </>
  );
}
