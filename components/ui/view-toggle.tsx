import Link from "next/link";
import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";

export function ViewToggle({ view, listHref, gridHref }: { view: string; listHref: string; gridHref: string }) {
  return (
    <div className="ml-auto inline-flex gap-1 rounded-full border border-white/[0.08] p-1">
      <Link
        href={listHref}
        aria-label="List view"
        className={cn("grid size-8 place-items-center rounded-full transition", view === "list" ? "bg-white/10 text-white" : "text-white/45 hover:text-white")}
      >
        <List className="size-[18px]" />
      </Link>
      <Link
        href={gridHref}
        aria-label="Grid view"
        className={cn("grid size-8 place-items-center rounded-full transition", view === "grid" ? "bg-white/10 text-white" : "text-white/45 hover:text-white")}
      >
        <LayoutGrid className="size-[18px]" />
      </Link>
    </div>
  );
}
