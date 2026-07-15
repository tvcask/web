"use client";

import { HugeiconsIcon } from '@hugeicons/react';
import { GridViewIcon, ListViewIcon } from '@hugeicons/core-free-icons';
import Link from "next/link";
import { cn } from "@/lib/utils";

type View = "list" | "grid";

export function ViewToggle({
  view,
  listHref,
  gridHref,
  preference
}: {
  view: View;
  listHref: string;
  gridHref: string;
  preference: "shows" | "movies";
}) {
  const remember = (next: View) => {
    document.cookie = `tvcask-${preference}-view=${next}; path=/; max-age=31536000; samesite=lax`;
  };

  return (
    <div className="ml-auto inline-flex gap-1 rounded-full border border-white/[0.08] p-1">
      <Link
        href={listHref}
        onClick={() => remember("list")}
        aria-label="List view"
        className={cn("grid size-8 place-items-center rounded-full transition", view === "list" ? "bg-white/10 text-white" : "text-white/45 hover:text-white")}
      >
        <HugeiconsIcon icon={ListViewIcon} className="size-[18px]" />
      </Link>
      <Link
        href={gridHref}
        onClick={() => remember("grid")}
        aria-label="Grid view"
        className={cn("grid size-8 place-items-center rounded-full transition", view === "grid" ? "bg-white/10 text-white" : "text-white/45 hover:text-white")}
      >
        <HugeiconsIcon icon={GridViewIcon} className="size-[18px]" />
      </Link>
    </div>
  );
}
