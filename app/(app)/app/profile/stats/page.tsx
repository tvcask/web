import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { BadgeMedallion } from "@/components/badges/badge-medallion";
import { getBadges, getStats } from "@/lib/data";

function duration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  if (months > 0) return `${months}m ${days % 30}d`;
  if (days > 0) return `${days}d ${hours % 24}h`;
  return `${hours}h`;
}

export default async function StatsPage() {
  const [stats, badges] = await Promise.all([getStats(), getBadges()]);

  const tiles = [
    { label: "TV time", value: duration(stats.tvTimeMinutes), accent: false },
    { label: "Episodes", value: stats.episodesWatched.toLocaleString(), accent: false },
    { label: "Film time", value: duration(stats.movieTimeMinutes), accent: false },
    { label: "Movies", value: stats.moviesWatched.toLocaleString(), accent: false },
    { label: "Completed", value: stats.completedTitles.toLocaleString(), accent: false },
    { label: "Favorites", value: stats.favorites.toLocaleString(), accent: true }
  ];

  const closest = badges.badges
    .filter((b) => !b.earned)
    .sort((a, b) => b.progress / b.target - a.progress / a.target)[0];
  const pct = badges.total > 0 ? (badges.earned / badges.total) * 100 : 0;

  return (
    <div className="mx-auto max-w-[900px] space-y-8">
      <Link href="/app/profile" className="inline-flex items-center gap-1 text-sm font-semibold text-white/60 hover:text-white">
        <ChevronLeft className="size-4" /> Profile
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

      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="display text-lg text-white">Badges</h2>
          <p className="text-sm font-bold" style={{ color: "var(--accent-text)" }}>
            {badges.earned} of {badges.total} earned
          </p>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
          <div className="h-2 rounded-full" style={{ width: `${pct}%`, background: "var(--accent)" }} />
        </div>
        {closest ? <p className="text-[13px] font-medium text-white/55">Closest · {closest.name}</p> : null}

        <div className="grid grid-cols-3 gap-x-4 gap-y-7 pt-2 sm:grid-cols-4">
          {badges.badges.map((badge) => (
            <div
              key={badge.key}
              className="flex flex-col items-center text-center"
              title={badge.earned ? `${badge.name} — earned` : `${badge.name} — ${badge.progress} / ${badge.target}`}
            >
              <BadgeMedallion badge={badge} size={72} />
              <p className={`mt-2.5 text-[13px] font-bold ${badge.earned ? "text-white" : "text-white/55"}`}>
                {badge.name}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
