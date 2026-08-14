"use client";

import { HugeiconsIcon } from '@hugeicons/react';
import { Loading03Icon, Search01Icon } from '@hugeicons/core-free-icons';

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { apiGet } from "@/lib/query/client";
import type { Title } from "@/lib/services/types";
import type { Person } from "@/lib/data";
import { Poster } from "@/components/titles/poster";

type SearchResults = { titles: Title[]; actors: Person[] };

export function SearchBox({
  initialQuery = "",
  size = "lg",
  align = "left",
  className
}: {
  initialQuery?: string;
  size?: "md" | "lg";
  align?: "left" | "right";
  className?: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);
  const [debounced, setDebounced] = useState(initialQuery.trim());
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  // Debounce the input; React Query handles dedup, caching and out-of-order.
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value.trim()), 250);
    return () => clearTimeout(timer);
  }, [value]);

  const enabled = debounced.length >= 2;
  const { data, isFetching: loading } = useQuery({
    queryKey: ["search", "all", debounced],
    queryFn: ({ signal }) =>
      apiGet<SearchResults>(`/api/search?q=${encodeURIComponent(debounced)}`, { signal }),
    enabled,
    staleTime: 60_000
  });
  const titles = data?.titles ?? [];
  const actors = data?.actors ?? [];
  const hasResults = titles.length > 0 || actors.length > 0;

  // Reveal the dropdown once a fresh query settles with results.
  useEffect(() => {
    if (enabled && hasResults) {
      setOpen(true);
    }
  }, [enabled, hasResults]);

  // Close on outside click.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const compact = size === "md";
  const inputCls = compact
    ? "h-10 pl-10 pr-9 text-[13px]"
    : "h-12 pl-11 pr-10 text-sm";
  const iconCls = compact ? "left-3.5 size-4" : "left-4 size-4";
  const spinnerCls = compact ? "right-3" : "right-4";
  const wrapperCls =
    className ?? (compact ? "w-[220px] transition-[width] duration-300 ease-out focus-within:w-[340px]" : "max-w-xl");
  const dropdownCls = align === "right" ? "right-0 w-[min(380px,88vw)]" : "w-full";

  return (
    <div ref={boxRef} className={`relative ${wrapperCls}`}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (value.trim()) router.push(`/app/explore?q=${encodeURIComponent(value.trim())}`);
          setOpen(false);
        }}
      >
        <HugeiconsIcon icon={Search01Icon} className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-white/40 ${iconCls}`} />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => hasResults && setOpen(true)}
          autoComplete="off"
          placeholder={compact ? "Search" : "Search shows, movies, anime, K-dramas"}
          className={`cask-focus w-full rounded-full bg-white/5 text-white outline-none placeholder:text-white/40 ${inputCls}`}
        />
        {loading ? (
          <HugeiconsIcon icon={Loading03Icon} className={`absolute top-1/2 size-4 -translate-y-1/2 animate-spin text-white/40 ${spinnerCls}`} />
        ) : null}
      </form>

      {open && hasResults ? (
        <div className={`absolute z-40 mt-2 overflow-hidden rounded-[14px] border border-white/10 bg-[#14110d] shadow-2xl ${dropdownCls}`}>
          <div className="nos max-h-[min(520px,72vh)] overflow-y-auto py-1.5">
            {titles.length > 0 ? <p className="px-3 pb-1 pt-2 text-[10px] font-extrabold uppercase tracking-[0.12em] text-white/35">Shows &amp; movies</p> : null}
            <ul>
              {titles.slice(0, 5).map((t) => (
                <li key={t.id}>
                  <Link
                    href={`/app/titles/${t.id}?returnTo=/app/explore`}
                    onClick={() => setOpen(false)}
                    className="flex w-full items-center gap-3 px-3 py-2 text-left transition hover:bg-white/[0.05]"
                  >
                    <div className="relative h-[54px] w-[38px] shrink-0 overflow-hidden rounded-[6px] bg-white/5">
                      <Poster src={t.posterUrl} title={t.title} className="h-full rounded-[6px] p-1" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-white">{t.title}</p>
                      <p className="mt-0.5 text-xs font-medium text-white/45">
                        {[t.year || null, t.type === "movie" ? "Movie" : "Series"].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            {actors.length > 0 ? <p className="border-t border-white/[0.06] px-3 pb-1 pt-3 text-[10px] font-extrabold uppercase tracking-[0.12em] text-white/35">Actors</p> : null}
            <ul>
              {actors.slice(0, 5).map((actor) => (
                <li key={actor.id}>
                  <Link
                    href={`/app/people/${actor.id}?returnTo=/app/explore`}
                    onClick={() => setOpen(false)}
                    className="flex w-full items-center gap-3 px-3 py-2 text-left transition hover:bg-white/[0.05]"
                  >
                    <div className="relative size-[46px] shrink-0 overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10">
                      {actor.profileUrl ? (
                        <Image src={actor.profileUrl} alt="" fill sizes="46px" className="object-cover" />
                      ) : (
                        <div className="grid h-full place-items-center text-sm font-extrabold text-white/45">{(actor.name.trim()[0] ?? "?").toUpperCase()}</div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-white">{actor.name}</p>
                      <p className="mt-0.5 text-xs font-medium text-white/45">Actor</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}
