"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { Poster } from "@/components/titles/poster";
import { UpNextCard } from "@/components/titles/up-next-card";
import { mutate } from "@/lib/mutate";
import { toast } from "@/lib/toast";
import { useInfiniteScroll } from "@/lib/use-infinite-scroll";
import type { UserTitleWithTitle } from "@/lib/services/types";

const PAGE = 40;

export function InfiniteLibrary({
  type,
  view,
  status,
  initial,
  total,
  returnTo
}: {
  type: "show" | "movie";
  view: "grid" | "list";
  status?: string;
  initial: UserTitleWithTitle[];
  total: number;
  returnTo: string;
}) {
  const fetchPage = useCallback(
    async ({ loaded }: { loaded: UserTitleWithTitle[] }) => {
      const params = new URLSearchParams({ type, limit: String(PAGE), offset: String(loaded.length) });
      if (status) {
        params.set("status", status);
      }
      const res = await fetch(`/api/library?${params}`);
      const data = (await res.json()) as { items: UserTitleWithTitle[]; total: number };
      const next = data.items ?? [];
      const done = next.length === 0 || loaded.length + next.length >= (data.total ?? total);
      return { items: next, done };
    },
    [type, status, total]
  );

  const { items, setItems, loading, done, sentinelRef } = useInfiniteScroll({
    initial,
    initialDone: initial.length >= total,
    fetchPage
  });

  return (
    <>
      {view === "grid" ? (
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/app/titles/${item.title.id}?returnTo=${encodeURIComponent(returnTo)}`}
              className="block overflow-hidden rounded-[14px] lift"
            >
              <Poster src={item.title.posterUrl} title={item.title.title} className="rounded-[14px]" />
            </Link>
          ))}
        </div>
      ) : type === "show" ? (
        <div className="flex flex-col gap-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                exit={{ opacity: 0, height: 0, transition: { duration: 0.32, ease: [0.2, 0.8, 0.2, 1] } }}
                style={{ overflow: "hidden" }}
              >
                <UpNextCard
                  item={item}
                  returnTo={returnTo}
                  onComplete={(id) => setItems((prev) => prev.filter((i) => i.id !== id))}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="grid gap-x-6 gap-y-2.5 md:grid-cols-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.28, ease: [0.2, 0.8, 0.2, 1] } }}
              >
                <MovieRow
                  item={item}
                  returnTo={returnTo}
                  onComplete={(id) => setItems((prev) => prev.filter((i) => i.id !== id))}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {!done ? <div ref={sentinelRef} className="h-12" /> : null}
      {loading ? (
        <div className="mt-4 flex justify-center">
          <Loader2 className="size-5 animate-spin text-white/40" />
        </div>
      ) : null}
    </>
  );
}

function MovieRow({
  item,
  returnTo,
  onComplete
}: {
  item: UserTitleWithTitle;
  returnTo: string;
  onComplete?: (id: string) => void;
}) {
  const href = `/app/titles/${item.title.id}?returnTo=${encodeURIComponent(returnTo)}`;
  const [saving, setSaving] = useState(false);

  function markWatched() {
    if (saving) {
      return;
    }
    setSaving(true);
    mutate(`me/titles/${item.title.id}`, "PATCH", { status: "completed" })
      .then(() => onComplete?.(item.id))
      .catch(() => {
        setSaving(false);
        toast("Couldn't save your change. Try again.");
      });
  }

  return (
    <div className="surface flex items-center gap-3.5 rounded-[14px] p-3">
      <Link href={href} className="w-12 shrink-0 overflow-hidden rounded-[8px]">
        <Poster src={item.title.posterUrl} title={item.title.title} className="rounded-[8px]" />
      </Link>
      <Link href={href} className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-bold text-white">{item.title.title}</p>
        <p className="mt-0.5 text-[12.5px] font-medium text-white/50">{item.title.year ?? "Movie"}</p>
      </Link>
      {item.status === "completed" ? (
        <span className="grid size-8 shrink-0 place-items-center rounded-full" style={{ background: "var(--accent)", color: "var(--on-accent)" }}>
          <Check className="size-4" />
        </span>
      ) : (
        <button
          onClick={markWatched}
          disabled={saving}
          className="cask-focus grid size-8 shrink-0 place-items-center rounded-full text-transparent transition hover:text-[color:var(--accent-text)] disabled:opacity-50"
          style={{ boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.25)" }}
          aria-label={`Mark ${item.title.title} watched`}
        >
          {saving ? <Loader2 className="size-4 animate-spin text-white/60" /> : <Check className="size-4" />}
        </button>
      )}
    </div>
  );
}
