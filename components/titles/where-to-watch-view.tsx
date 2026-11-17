"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { LinkSquare02Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { useMemo, useState } from "react";

import { ProviderChip } from "@/components/titles/provider-chip";
import { Button } from "@/components/ui/button";
import type { CountryProviders } from "@/lib/data";
import { regionFlag } from "@/lib/regions";
import { buildCountryRows, filterCountries, type Match } from "@/lib/watch-countries";

function CountrySection({ match }: { match: Match }) {
  const { row, providerIds } = match;
  return (
    <section className="py-3">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <h3 className="min-w-0 break-words text-[15px] font-bold text-white">
          <span aria-hidden className="mr-2">{regionFlag(row.region)}</span>
          {row.name}
        </h3>
        {row.link ? (
          <a
            href={row.link}
            target="_blank"
            rel="nofollow noreferrer"
            aria-label={`Open ${row.name} on JustWatch`}
            className="cask-focus -my-2 inline-flex min-h-11 items-center gap-1 rounded-full text-xs font-bold text-[var(--accent-text)] hover:underline"
          >
            JustWatch <HugeiconsIcon icon={LinkSquare02Icon} className="size-3.5" aria-hidden />
          </a>
        ) : null}
      </div>
      {row.providers.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {row.providers.map((provider) => (
            <ProviderChip key={provider.id} provider={provider} href={row.link} highlight={providerIds.has(provider.id)} />
          ))}
        </div>
      ) : (
        <p className="mt-2 text-sm text-white/55">Not streaming here right now.</p>
      )}
    </section>
  );
}

export function WhereToWatchView({
  regions,
  attribution,
  myRegion
}: {
  regions: CountryProviders[];
  attribution: string;
  /** The viewer's saved country. Null on public pages, which show one A to Z list. */
  myRegion: string | null;
}) {
  const [query, setQuery] = useState("");
  const rows = useMemo(() => buildCountryRows(regions, myRegion), [regions, myRegion]);
  const matches = useMemo(() => filterCountries(rows, query), [rows, query]);
  const mine = matches.filter((m) => m.row.mine);
  const others = matches.filter((m) => !m.row.mine);
  const count = matches.length;

  if (regions.length === 0) {
    return (
      <div>
        <p className="text-base font-bold text-white">Not streaming anywhere we can see right now.</p>
        <p className="mt-1.5 text-sm text-white/55">
          JustWatch doesn&apos;t list this title on any streaming service yet. That often changes after release.
        </p>
        <p className="mt-6 text-[11px] text-white/30">{attribution}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="sticky top-0 z-10 -mx-1 bg-[#0a0a0c] px-1 pb-2 pt-1">
        <div className="relative">
          <HugeiconsIcon icon={Search01Icon} aria-hidden className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/40" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape" && query) {
                e.preventDefault();
                e.stopPropagation();
                setQuery("");
              }
            }}
            aria-label="Search countries or services"
            placeholder="Search countries or services"
            className="cask-focus h-11 w-full rounded-full border border-[#241f19] bg-[#16130f] pl-10 pr-4 text-sm text-[#F3EDE4] outline-none transition placeholder:text-[#6f665c] focus:border-[#E0A960]"
          />
        </div>
        <p aria-live="polite" className="mt-2 text-xs text-white/55">
          {count === 1 ? "1 country" : `${count} countries`}
        </p>
      </div>

      {count === 0 ? (
        <div className="py-6">
          <p className="break-words text-sm text-white/55">No country or service matches &quot;{query}&quot;.</p>
          <Button variant="secondary" className="mt-3" onClick={() => setQuery("")}>
            Clear search
          </Button>
        </div>
      ) : (
        <>
          {mine.length > 0 ? (
            <div className="mt-2">
              <h2 className="eyebrow text-white/45">Your country</h2>
              {mine.map((m) => (
                <CountrySection key={m.row.region} match={m} />
              ))}
            </div>
          ) : null}
          {others.length > 0 ? (
            <div className="mt-2">
              {myRegion ? <h2 className="eyebrow text-white/45">Other countries</h2> : null}
              <div className="divide-y divide-white/[0.06]">
                {others.map((m) => (
                  <CountrySection key={m.row.region} match={m} />
                ))}
              </div>
            </div>
          ) : null}
        </>
      )}
      <p className="mt-6 text-[11px] text-white/30">{attribution}</p>
    </div>
  );
}
