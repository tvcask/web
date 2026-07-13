import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons';
import Link from "next/link";
import { getStats } from "@/lib/data";
import { StatsInsights } from "@/components/stats/stats-insights";

function duration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  if (months > 0) return `${months}m ${days % 30}d`;
  if (days > 0) return `${days}d ${hours % 24}h`;
  return `${hours}h`;
}

export default async function StatsPage() {
  const stats = await getStats();

  const tiles = [
    { label: "TV time", value: duration(stats.tvTimeMinutes), accent: false },
    { label: "Episodes", value: stats.episodesWatched.toLocaleString(), accent: false },
    { label: "Movie time", value: duration(stats.movieTimeMinutes), accent: false },
    { label: "Movies", value: stats.moviesWatched.toLocaleString(), accent: false },
    { label: "Completed", value: stats.completedTitles.toLocaleString(), accent: false },
    { label: "Favorites", value: stats.favorites.toLocaleString(), accent: true }
  ];

  return (
    <div className="mx-auto max-w-[900px] space-y-8">
      <Link href="/app/profile" className="inline-flex items-center gap-1 text-sm font-semibold text-white/60 hover:text-white">
        <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" /> Profile
      </Link>

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

      <StatsInsights stats={stats} />
    </div>
  );
}
