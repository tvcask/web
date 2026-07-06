"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronRight } from "lucide-react";
import { celebrate } from "@/lib/celebrate";
import type { UserTitleWithTitle } from "@/lib/services/types";

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

function seededGradient(title: string) {
  let hash = 0;
  for (let i = 0; i < title.length; i += 1) hash = (hash * 31 + title.charCodeAt(i)) >>> 0;
  const hue = hash % 360;
  return `linear-gradient(140deg, hsl(${hue} 42% 32%), hsl(${(hue + 40) % 360} 44% 14%))`;
}

export function UpNextCard({
  item,
  returnTo = "/app/shows",
  onComplete
}: {
  item: UserTitleWithTitle;
  returnTo?: string;
  onComplete?: (id: string) => void;
}) {
  const season = item.currentSeason ?? 1;
  const episodeCount = item.episodeCount;
  const [current, setCurrent] = useState(item.currentEpisode ?? 0);
  const [marking, setMarking] = useState(false);

  const next = current + 1;
  const remaining = Math.max(0, episodeCount - next);
  const href = `/app/titles/${item.title.id}?returnTo=${encodeURIComponent(returnTo)}`;

  function markNext() {
    if (marking) return;
    setMarking(true);
    fetch(`/api/v1/me/titles/${item.title.id}/next`, { method: "POST" }).catch(() => {});
    const isLast = episodeCount > 0 && next >= episodeCount;
    setTimeout(() => {
      if (isLast) {
        celebrate(item.title.title);
        onComplete?.(item.id);
      } else {
        setCurrent(next);
        setMarking(false);
      }
    }, 420);
  }

  return (
    <article className="flex items-center gap-5 rounded-[16px] border border-white/[0.08] p-4">
      <Link
        href={href}
        className="relative h-[80px] w-[140px] shrink-0 overflow-hidden rounded-[10px] ring-1 ring-white/[0.07]"
        style={item.title.backdropUrl ? undefined : { background: seededGradient(item.title.title) }}
      >
        {item.title.backdropUrl ? <img src={item.title.backdropUrl} alt="" className="h-full w-full object-cover" /> : null}
      </Link>

      <div className="min-w-0 flex-1">
        <Link
          href={href}
          className="inline-flex max-w-full items-center gap-1 rounded-full border border-white/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white"
        >
          <span className="truncate">{item.title.title}</span>
          <ChevronRight className="size-3 shrink-0" />
        </Link>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="display flex items-baseline text-xl text-white">
            S{pad(season)}&nbsp;|&nbsp;E
            <span className="relative inline-flex overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={next}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
                  className="inline-block"
                >
                  {pad(next)}
                </motion.span>
              </AnimatePresence>
            </span>
          </span>
          {remaining > 0 ? <span className="text-sm font-semibold text-white/40">+{remaining}</span> : null}
        </div>
      </div>

      <button
        onClick={markNext}
        className="cask-focus relative grid size-11 shrink-0 place-items-center rounded-full text-transparent transition hover:text-[color:var(--accent-text)]"
        style={{ boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.25)" }}
        aria-label={`Mark S${pad(season)}E${pad(next)} of ${item.title.title} watched`}
      >
        <Check className="size-5" />
        <AnimatePresence>
          {marking ? (
            <motion.span
              className="absolute inset-0 grid place-items-center rounded-full"
              style={{ background: "var(--accent)", color: "var(--on-accent)" }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 520, damping: 26 }}
            >
              <Check className="size-5" />
            </motion.span>
          ) : null}
        </AnimatePresence>
      </button>
    </article>
  );
}
