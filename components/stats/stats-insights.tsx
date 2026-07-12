"use client";

import { useMemo, useState } from "react";
import type { Stats } from "@/lib/data";

type GenreMode = "count" | "shows" | "movies";

export function StatsInsights({ stats }: { stats: Stats }) {
  const [genreMode, setGenreMode] = useState<GenreMode>("count");
  const genres = useMemo(
    () => [...(stats.topGenres ?? [])].sort((a, b) => b[genreMode] - a[genreMode]).slice(0, 5),
    [genreMode, stats.topGenres]
  );

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <ChartCard title="Top genres" subtitle="Based on what you watch">
        <div className="mb-5 mt-4 inline-flex rounded-full bg-white/[0.05] p-1">
          {([[
            "count", "All"
          ], ["shows", "Shows"], ["movies", "Movies"]] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setGenreMode(value)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${genreMode === value ? "bg-[color:var(--accent)] text-[color:var(--on-accent)]" : "text-white/50 hover:text-white"}`}
            >
              {label}
            </button>
          ))}
        </div>
        <HorizontalBars items={genres.map((genre) => ({ label: genre.name, value: genre[genreMode] }))} />
      </ChartCard>

      <ChartCard title="Library breakdown" subtitle="Everything you have saved">
        <StatusBreakdown items={stats.libraryStatus ?? []} />
      </ChartCard>

      <div className="md:col-span-2">
        <ChartCard title="Your eras" subtitle="Based on what you watch">
          <DecadeChart items={stats.releaseDecades ?? []} />
        </ChartCard>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="surface h-full rounded-[16px] p-5 sm:p-6">
      <h2 className="display text-lg text-white">{title}</h2>
      <p className="mt-1 text-xs font-medium text-white/40">{subtitle}</p>
      {children}
    </section>
  );
}

function HorizontalBars({ items }: { items: { label: string; value: number }[] }) {
  const max = Math.max(...items.map((item) => item.value), 1);
  if (items.length === 0) return <Empty>Track titles to discover your top genres.</Empty>;
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.label} className="grid grid-cols-[88px_minmax(0,1fr)_32px] items-center gap-3">
          <span className="truncate text-xs font-semibold text-white/70">{item.label}</span>
          <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
            <div className="h-full rounded-full bg-[color:var(--accent)]" style={{ width: `${(item.value / max) * 100}%` }} />
          </div>
          <span className="text-right text-xs font-bold text-white/45">{item.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

const statusMeta: Record<string, { label: string; color: string }> = {
  watching: { label: "Watching", color: "var(--accent-text)" },
  completed: { label: "Completed", color: "var(--accent)" },
  watchlist: { label: "Watchlist", color: "rgba(202,154,101,0.42)" },
  dropped: { label: "Dropped", color: "rgba(255,255,255,0.2)" }
};

function StatusBreakdown({ items }: { items: { status: string; count: number }[] }) {
  const order = ["watching", "completed", "watchlist", "dropped"];
  const rank = (status: string) => {
    const index = order.indexOf(status);
    return index === -1 ? order.length : index;
  };
  const visible = items.filter((item) => item.count > 0).sort((a, b) => rank(a.status) - rank(b.status));
  const total = visible.reduce((sum, item) => sum + item.count, 0);
  if (total === 0) return <Empty>Your library breakdown will appear here.</Empty>;
  return (
    <div className="mt-6">
      <div className="flex h-3.5 overflow-hidden rounded-full bg-white/[0.06]">
        {visible.map((item) => (
          <div key={item.status} style={{ width: `${(item.count / total) * 100}%`, background: statusMeta[item.status]?.color ?? "rgba(255,255,255,0.3)" }} />
        ))}
      </div>
      <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-3">
        {visible.map((item) => {
          const meta = statusMeta[item.status] ?? { label: item.status, color: "rgba(255,255,255,0.3)" };
          return (
            <div key={item.status} className="flex items-center gap-2 text-xs">
              <span className="size-2 rounded-full" style={{ background: meta.color }} />
              <span className="text-white/50">{meta.label}</span>
              <span className="ml-auto font-bold text-white/80">{item.count.toLocaleString()}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DecadeChart({ items }: { items: { decade: number; count: number }[] }) {
  const selected = [...items].sort((a, b) => b.count - a.count).slice(0, 8).sort((a, b) => a.decade - b.decade);
  const max = Math.max(...selected.map((item) => item.count), 1);
  if (selected.length === 0) return <Empty>Your viewing eras will appear as your library grows.</Empty>;
  return (
    <div className="mt-6 flex h-44 items-end gap-3 sm:gap-5">
      {selected.map((item) => (
        <div key={item.decade} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end">
          <span className="mb-2 text-[11px] font-bold text-white/45">{item.count.toLocaleString()}</span>
          <div
            className="w-full max-w-14 rounded-t-[8px] bg-gradient-to-t from-[#9f673d] to-[color:var(--accent)]"
            style={{ height: `${Math.max(8, (item.count / max) * 118)}px` }}
          />
          <span className="mt-2 text-[11px] font-semibold text-white/45">{String(item.decade).slice(2)}s</span>
        </div>
      ))}
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="mt-5 text-sm text-white/40">{children}</p>;
}
