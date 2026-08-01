import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { StatsInsights } from "@/components/stats/stats-insights";
import { duration } from "@/lib/dates";
import type { Stats } from "@/lib/data";

// The stats screen, for your own numbers and for anyone else's. Only the back
// link and the heading differ.
export function StatsView({
  stats,
  backHref,
  backLabel = "Profile",
  heading,
  owner = true
}: {
  stats: Stats;
  backHref: string;
  backLabel?: string;
  heading?: string;
  owner?: boolean;
}) {
  // Grouped by medium: television first, then film. Shows was missing
  // entirely, which made the movie count look arbitrary next to it.
  const tiles = [
    { label: "Shows", value: stats.showsWatched.toLocaleString(), accent: false },
    { label: "Episodes", value: stats.episodesWatched.toLocaleString(), accent: false },
    { label: "TV time", value: duration(stats.tvTimeMinutes), accent: false },
    { label: "Movies", value: stats.moviesWatched.toLocaleString(), accent: false },
    { label: "Movie time", value: duration(stats.movieTimeMinutes), accent: false },
    { label: "Completed", value: stats.completedTitles.toLocaleString(), accent: true }
  ];

  return (
    <div className="mx-auto max-w-[900px] space-y-8">
      <Link href={backHref} className="inline-flex items-center gap-1 text-sm font-semibold text-white/60 hover:text-white">
        <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" /> {backLabel}
      </Link>

      {heading ? <h1 className="display text-2xl text-white">{heading}</h1> : null}

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {tiles.map((tile) => (
          <div key={tile.label} className="surface rounded-[14px] px-5 py-4">
            <p className="eyebrow">{tile.label}</p>
            <p className="display mt-2 text-[22px]" style={{ color: tile.accent ? "var(--accent-text)" : "#fff" }}>
              {tile.value}
            </p>
          </div>
        ))}
      </section>

      <StatsInsights stats={stats} owner={owner} />
    </div>
  );
}
