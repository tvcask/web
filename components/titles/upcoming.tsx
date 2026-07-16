"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Calendar } from "@/lib/data";
import { formatAirDate, groupCalendar } from "@/lib/dates";

/**
 * Client component on purpose: grouping needs the viewer's calendar date,
 * which the server doesn't know. The first paint uses the API's UTC groups
 * (what we always showed), then the browser regroups against its own date.
 * Deferring to an effect keeps the hydration render identical to the server's.
 */
export function Upcoming({ calendar }: { calendar: Calendar }) {
  const [inBrowser, setInBrowser] = useState(false);
  useEffect(() => setInBrowser(true), []);
  const grouped = useMemo(() => (inBrowser ? groupCalendar(calendar) : calendar), [inBrowser, calendar]);

  const groups = [
    ["Today", grouped.today],
    ["This week", grouped.thisWeek],
    ["Later", grouped.later]
  ] as const;
  const hasItems = groups.some(([, items]) => items.length > 0);

  if (!hasItems) {
    return <p className="surface rounded-[14px] p-6 text-white/50">No upcoming episodes for your shows yet.</p>;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {groups.map(([label, items]) =>
        items.length > 0 ? (
          <section key={label}>
            <div className="mb-4 text-center">
              <span
                className="section-pill"
                style={label === "Today" ? { background: "var(--accent)", color: "var(--on-accent)" } : undefined}
              >
                {label}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {items.map((episode) => (
                <Link href={`/app/titles/${episode.titleId}?returnTo=${encodeURIComponent("/app/shows?tab=upcoming")}#${encodeURIComponent(episode.id)}`} key={episode.id} className="group flex items-center gap-4 overflow-hidden rounded-[20px] bg-white/5 pr-4 transition hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]">
                  <div
                    className="relative h-[88px] w-[116px] shrink-0 self-stretch overflow-hidden"
                    style={{ background: episode.title?.backdropUrl ? undefined : "linear-gradient(140deg,#2a2f3a,#14110d)" }}
                  >
                    {episode.title?.backdropUrl ? (
                      <Image src={episode.title.backdropUrl} alt="" fill sizes="116px" className="object-cover" />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1 py-3.5">
                    <p className="truncate text-[16px] font-extrabold text-white">{episode.title?.title}</p>
                    <p className="mt-1 text-[13px] font-medium text-white/50">
                      S{episode.seasonNumber} · E{episode.episodeNumber}
                    </p>
                  </div>
                  {episode.airDate ? (
                    <span className="whitespace-nowrap text-[13px] font-bold text-white/55">{formatAirDate(episode.airDate)}</span>
                  ) : null}
                  <span className="text-lg text-white/25 transition group-hover:translate-x-0.5 group-hover:text-white/55" aria-hidden>›</span>
                </Link>
              ))}
            </div>
          </section>
        ) : null
      )}
    </div>
  );
}
