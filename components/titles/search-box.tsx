"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search } from "lucide-react";
import type { Title } from "@/lib/services/types";

export function SearchBox({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);
  const [results, setResults] = useState<Title[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  // Debounced fetch. A ref guards against out-of-order responses.
  const latest = useRef(0);
  useEffect(() => {
    const q = value.trim();
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const token = ++latest.current;
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = (await res.json()) as { results: Title[] };
        if (token === latest.current) {
          setResults(data.results ?? []);
          setOpen(true);
        }
      } catch {
        if (token === latest.current) setResults([]);
      } finally {
        if (token === latest.current) setLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [value]);

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

  function goto(id: string) {
    setOpen(false);
    router.push(`/app/titles/${id}?returnTo=/app/explore`);
  }

  return (
    <div ref={boxRef} className="relative max-w-xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (value.trim()) router.push(`/app/explore?q=${encodeURIComponent(value.trim())}`);
          setOpen(false);
        }}
      >
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/40" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          autoComplete="off"
          placeholder="Search shows, movies, anime, K-dramas"
          className="cask-focus h-12 w-full rounded-full bg-white/5 pl-11 pr-10 text-sm text-white outline-none placeholder:text-white/40"
        />
        {loading ? <Loader2 className="absolute right-4 top-1/2 size-4 -translate-y-1/2 animate-spin text-white/40" /> : null}
      </form>

      {open && results.length > 0 ? (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-[14px] border border-white/10 bg-[#14110d] shadow-2xl">
          <ul className="nos max-h-[380px] overflow-y-auto py-1.5">
            {results.slice(0, 8).map((t) => (
              <li key={t.id}>
                <button
                  onClick={() => goto(t.id)}
                  className="flex w-full items-center gap-3 px-3 py-2 text-left transition hover:bg-white/[0.05]"
                >
                  <div className="h-[54px] w-[38px] shrink-0 overflow-hidden rounded-[6px] bg-white/5">
                    {t.posterUrl ? <img src={t.posterUrl} alt="" className="h-full w-full object-cover" /> : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-white">{t.title}</p>
                    <p className="mt-0.5 text-xs font-medium text-white/45">
                      {[t.year || null, t.type === "movie" ? "Movie" : "Series"].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
