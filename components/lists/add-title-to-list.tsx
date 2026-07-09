"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Search } from "lucide-react";
import { mutate } from "@/lib/mutate";
import { toast } from "@/lib/toast";
import type { Title } from "@/lib/services/types";

export function AddTitleToList({ listId, existingTitleIds }: { listId: string; existingTitleIds: string[] }) {
  const router = useRouter();
  const existing = useMemo(() => new Set(existingTitleIds), [existingTitleIds]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Title[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState<string | null>(null);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: controller.signal });
        const data = (await res.json()) as { results?: Title[] };
        setResults((data.results ?? []).slice(0, 6));
      } catch {
        if (!controller.signal.aborted) setResults([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query]);

  async function add(title: Title) {
    setAdding(title.id);
    try {
      await mutate(`me/lists/${listId}/items`, "POST", { titleId: title.id });
      setQuery("");
      setResults([]);
      router.refresh();
    } catch {
      toast("Couldn't add this title. Try again.");
    } finally {
      setAdding(null);
    }
  }

  return (
    <div className="surface rounded-[14px] p-4">
      <label className="eyebrow" htmlFor="list-title-search">
        Add title
      </label>
      <div className="relative mt-2">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/35" />
        <input
          id="list-title-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search shows or movies"
          className="cask-focus h-11 w-full rounded-full border border-[#241f19] bg-[#16130f] pl-10 pr-10 text-sm text-[#F3EDE4] outline-none transition placeholder:text-[#6f665c] focus:border-[#E0A960]"
        />
        {loading ? <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-white/35" /> : null}
      </div>

      {results.length > 0 ? (
        <div className="mt-3 divide-y divide-white/[0.06] overflow-hidden rounded-[12px] border border-white/[0.08]">
          {results.map((title) => {
            const alreadyAdded = existing.has(title.id);
            return (
              <button
                key={title.id}
                type="button"
                disabled={alreadyAdded || adding === title.id}
                onClick={() => add(title)}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-white/[0.04] disabled:cursor-default disabled:opacity-50"
              >
                <div className="h-12 w-8 shrink-0 overflow-hidden rounded-[6px] bg-white/8">
                  {title.posterUrl ? <img src={title.posterUrl} alt="" className="h-full w-full object-cover" /> : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-white">{title.title}</p>
                  <p className="text-xs font-semibold text-white/40">{[title.year, title.type === "movie" ? "Movie" : "Series"].filter(Boolean).join(" · ")}</p>
                </div>
                {adding === title.id ? <Loader2 className="size-4 animate-spin text-white/45" /> : <Plus className="size-4 text-white/45" />}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
