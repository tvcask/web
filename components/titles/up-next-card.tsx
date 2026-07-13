"use client";

import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon, Tick02Icon } from '@hugeicons/core-free-icons';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
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
  const [season, setSeason] = useState(item.nextSeason ?? 1);
  const [next, setNext] = useState(item.nextEpisode ?? 1);
  const [remaining, setRemaining] = useState(item.remaining);

  // Episodes left after the one shown, for the "+N" badge.
  const rest = Math.max(0, remaining - 1);
  const href = `/app/titles/${item.title.id}?returnTo=${encodeURIComponent(returnTo)}`;

  type NextResponse = {
    nextSeason?: number | null;
    nextEpisode?: number | null;
    remaining?: number;
    completed?: boolean;
  };

  const advance = useMutation({
    mutationFn: async () => {
      // Wait alongside a short delay so the check animation always plays.
      const [res] = await Promise.all([
        fetch(`/api/v1/me/titles/${item.title.id}/next`, { method: "POST" })
          .then((r) => r.json() as Promise<NextResponse>)
          .catch(() => null),
        new Promise((resolve) => setTimeout(resolve, 420))
      ]);
      return res;
    },
    onSuccess: (res) => {
      if (!res || res.completed || res.nextEpisode == null) {
        celebrate(item.title.title);
        onComplete?.(item.id);
        return;
      }
      setSeason(res.nextSeason ?? season);
      setNext(res.nextEpisode);
      setRemaining(res.remaining ?? 0);
    }
  });
  const marking = advance.isPending;

  return (
    <article className="flex items-center gap-4 overflow-hidden rounded-[20px] bg-white/5 pr-4 sm:gap-5 sm:pr-5">
      <Link
        href={href}
        className="relative h-[88px] w-[116px] shrink-0 self-stretch overflow-hidden sm:h-[96px] sm:w-[150px]"
        style={item.title.backdropUrl ? undefined : { background: seededGradient(item.title.title) }}
      >
        {item.title.backdropUrl ? (
          <Image src={item.title.backdropUrl} alt="" fill sizes="150px" className="object-cover" />
        ) : null}
      </Link>

      <div className="min-w-0 flex-1 py-3.5">
        <Link href={href} className="group flex max-w-full items-center gap-1">
          <span className="truncate text-[16.5px] font-extrabold text-white">{item.title.title}</span>
          <HugeiconsIcon icon={ArrowRight01Icon} className="size-4 shrink-0 text-white/35 transition group-hover:text-white/70" />
        </Link>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="flex items-baseline text-[15px] font-bold text-white/65">
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
          {rest > 0 ? <span className="text-sm font-semibold text-white/40">+{rest}</span> : null}
        </div>
      </div>

      <button
        onClick={() => !marking && advance.mutate()}
        className="cask-focus relative grid size-11 shrink-0 place-items-center rounded-full text-transparent transition hover:text-[color:var(--accent-text)]"
        style={{ boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.25)" }}
        aria-label={`Mark S${pad(season)}E${pad(next)} of ${item.title.title} watched`}
      >
        <HugeiconsIcon icon={Tick02Icon} className="size-5" />
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
              <HugeiconsIcon icon={Tick02Icon} className="size-5" />
            </motion.span>
          ) : null}
        </AnimatePresence>
      </button>
    </article>
  );
}
