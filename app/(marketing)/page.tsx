import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { MarketingHeader } from "@/components/marketing/header";
import { Button } from "@/components/ui/button";
import { TmdbAttribution } from "@/components/tmdb-attribution";

const brings = ["Shows", "Movies", "Anime", "K-Dramas", "Episodes", "Favorites"];

const steps = [
  { n: "01", title: "Upload your export", copy: "Drop in your TV Time file. JSON and CSV are parsed on the spot." },
  { n: "02", title: "Preview the match", copy: "Every title matched to real metadata before a single row is saved." },
  { n: "03", title: "Keep watching", copy: "Confirm, and pick up the next episode right where you left off." }
];

const upNext = [
  { title: "Jujutsu Kaisen", tag: "S03 · E06", from: "#3b1d54", to: "#0e0b1a" },
  { title: "Severance", tag: "S02 · E03", from: "#123a52", to: "#0b1116" },
  { title: "The Bear", tag: "S03 · E05", from: "#5a2f1a", to: "#140d09" }
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
                <Link href="/login">Log in</Link>
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

          <div className="surface rounded-[18px] p-4">
            <p className="eyebrow mb-3 px-1">Up next</p>
            <div className="space-y-2.5">
              {upNext.map((show) => (
                <div key={show.title} className="flex items-center gap-3.5 rounded-[12px] bg-white/[0.03] p-2.5">
                  <div
                    className="h-14 w-24 shrink-0 rounded-[8px]"
                    style={{ background: `linear-gradient(140deg, ${show.from}, ${show.to})` }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="display truncate text-[15px] text-white">{show.title}</p>
                    <p className="mt-0.5 text-[13px] text-white/45">{show.tag}</p>
                  </div>
                  <span
                    className="grid size-9 shrink-0 place-items-center rounded-full"
                    style={{ boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.2)", color: "var(--accent-text)" }}
                  >
                    <Check className="size-4" />
                  </span>
                </div>
              ))}
            </div>
          </div>
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
      <footer className="mx-auto w-full max-w-6xl px-5 py-10">
        <div className="flex flex-col gap-3 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/40">© {new Date().getFullYear()} TV Cask</p>
          <TmdbAttribution />
        </div>
      </footer>
    </>
  );
}
