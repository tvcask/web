"use client";

import Link from "next/link";
import { useState } from "react";

import { Poster } from "@/components/titles/poster";
import type { CreditedTitle } from "@/lib/data";

type FilmographyItem = CreditedTitle & { href: string };

export function FilmographyGrid({ items }: { items: FilmographyItem[] }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? items : items.slice(0, 10);
  const remaining = items.length - visible.length;

  return (
    <>
      <div className="grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-4 lg:grid-cols-5">
        {visible.map((credit) => (
          <Link key={credit.id} href={credit.href} className="lift min-w-0">
            <Poster src={credit.posterUrl} title={credit.title} className="rounded-[12px]" />
            <p className="mt-2 text-xs font-bold leading-4 text-white">{credit.title}</p>
            {credit.character ? <p className="mt-0.5 text-[11px] leading-4 text-white/40">{credit.character}</p> : null}
          </Link>
        ))}
      </div>
      {remaining > 0 ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-6 rounded-full border border-white/12 px-4 py-2 text-xs font-extrabold text-white/70 transition hover:bg-white/5 hover:text-white"
        >
          Show {remaining} more
        </button>
      ) : null}
    </>
  );
}
