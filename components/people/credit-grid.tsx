"use client";

import Link from "next/link";
import { useState } from "react";

import { Poster } from "@/components/titles/poster";

const COLLAPSED_COUNT = 10;

export type CreditCard = { id: string; href: string; title: string; posterUrl?: string | null; character?: string };

export function CreditGrid({ label, credits }: { label: string; credits: CreditCard[] }) {
  const [expanded, setExpanded] = useState(false);
  if (credits.length === 0) return null;
  const visible = expanded ? credits : credits.slice(0, COLLAPSED_COUNT);

  return (
    <section className="mt-8 border-t border-white/[0.07] pt-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="h-px w-7 bg-[var(--accent)]/70" aria-hidden />
        <h2 className="eyebrow">{label}</h2>
        <span className="rounded-full bg-white/8 px-2 py-0.5 text-[11px] font-bold text-white/45">{credits.length}</span>
      </div>
      <div className="grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-5">
        {visible.map((credit) => (
          <Link key={credit.id} href={credit.href} className="lift min-w-0">
            <Poster src={credit.posterUrl} title={credit.title} alt={`${credit.title} poster`} className="rounded-[12px]" />
            <p className="mt-2 truncate text-xs font-bold text-white">{credit.title}</p>
            {credit.character ? <p className="truncate text-[11px] text-white/40">{credit.character}</p> : null}
          </Link>
        ))}
      </div>
      {credits.length > COLLAPSED_COUNT ? (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="cask-focus mt-5 rounded-full bg-white/5 px-4 py-2 text-[13px] font-bold text-white/70 transition hover:text-white"
        >
          {expanded ? "Show less" : `Show all ${credits.length}`}
        </button>
      ) : null}
    </section>
  );
}
