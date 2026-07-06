"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, Loader2, Plus } from "lucide-react";
import { Poster } from "@/components/titles/poster";
import type { Title } from "@/lib/services/types";

export function InfiniteCatalog({
  kind,
  initial,
  hasMore,
  trackedIds
}: {
  kind: string;
  initial: Title[];
  hasMore: boolean;
  trackedIds: string[];
}) {
  const [items, setItems] = useState(initial);
  const [page, setPage] = useState(1);
  const [done, setDone] = useState(!hasMore);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState<Set<string>>(() => new Set(trackedIds));
  const sentinel = useRef<HTMLDivElement>(null);
  const returnTo = `/app/browse/${kind}`;

  const loadMore = useCallback(async () => {
    if (loading || done) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/titles/collection?kind=${encodeURIComponent(kind)}&page=${page + 1}`);
      const data = (await res.json()) as { items: Title[]; hasMore: boolean };
      const next = data.items ?? [];
      setItems((prev) => {
        const seen = new Set(prev.map((t) => t.id));
        return [...prev, ...next.filter((t) => !seen.has(t.id))];
      });
      setPage((p) => p + 1);
      if (!data.hasMore || next.length === 0) {
        setDone(true);
      }
    } finally {
      setLoading(false);
    }
  }, [loading, done, kind, page]);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) {
      return;
    }
    const io = new IntersectionObserver((entries) => entries[0].isIntersecting && loadMore(), { rootMargin: "700px" });
    io.observe(el);
    return () => io.disconnect();
  }, [loadMore]);

  function add(title: Title) {
    setAdded((s) => new Set(s).add(title.id));
    fetch(`/api/v1/me/titles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titleId: title.id })
    }).catch(() => {
      setAdded((s) => {
        const n = new Set(s);
        n.delete(title.id);
        return n;
      });
    });
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-3.5 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
        {items.map((title) => {
          const isAdded = added.has(title.id);
          return (
            <div key={title.id} className="relative">
              <Link
                href={`/app/titles/${title.id}?returnTo=${encodeURIComponent(returnTo)}`}
                className="block overflow-hidden rounded-[12px] lift"
              >
                <Poster src={title.posterUrl} title={title.title} className="rounded-[12px]" />
              </Link>
              <button
                onClick={() => !isAdded && add(title)}
                disabled={isAdded}
                className="cask-focus absolute right-2 top-2 grid size-[30px] place-items-center rounded-[9px] bg-black/45"
                style={{ color: "var(--accent-text)", boxShadow: "inset 0 0 0 1.5px var(--accent)" }}
                aria-label={isAdded ? `${title.title} added` : `Add ${title.title}`}
              >
                {isAdded ? <Check className="size-[15px]" /> : <Plus className="size-[15px]" />}
              </button>
            </div>
          );
        })}
      </div>
      {!done ? <div ref={sentinel} className="h-12" /> : null}
      {loading ? (
        <div className="mt-4 flex justify-center">
          <Loader2 className="size-5 animate-spin text-white/40" />
        </div>
      ) : null}
    </>
  );
}
