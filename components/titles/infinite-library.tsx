"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { Poster } from "@/components/titles/poster";
import { UpNextCard } from "@/components/titles/up-next-card";
import { useCompleteFromLibrary, useLibrary } from "@/lib/query/library";
import type { UserTitleWithTitle } from "@/lib/services/types";

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
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useLibrary({ type, status, initial, total });
  const { markComplete, removeLocally } = useCompleteFromLibrary(type, status);
  const items = data.pages.flatMap((page) => page.items);

  // Same infinite-scroll UX as before: observe a sentinel, pull the next page.
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) {
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "700px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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
                <UpNextCard item={item} returnTo={returnTo} onComplete={removeLocally} />
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
                <MovieRow item={item} returnTo={returnTo} onMarkComplete={markComplete.mutate} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {hasNextPage ? <div ref={sentinelRef} className="h-12" /> : null}
      {isFetchingNextPage ? (
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
  onMarkComplete
}: {
  item: UserTitleWithTitle;
  returnTo: string;
  onMarkComplete: (item: UserTitleWithTitle) => void;
}) {
  const href = `/app/titles/${item.title.id}?returnTo=${encodeURIComponent(returnTo)}`;

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
          onClick={() => onMarkComplete(item)}
          className="cask-focus grid size-8 shrink-0 place-items-center rounded-full text-transparent transition hover:text-[color:var(--accent-text)]"
          style={{ boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.25)" }}
          aria-label={`Mark ${item.title.title} watched`}
        >
          <Check className="size-4" />
        </button>
      )}
    </div>
  );
}
