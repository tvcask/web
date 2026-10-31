import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";

import { Poster } from "@/components/titles/poster";
import type { UserListDetail } from "@/lib/data";

export function ListCard({ list }: { list: UserListDetail }) {
  const count = list.itemCount ?? list.items.length;
  return (
    <Link href={`/app/lists/${list.id}`} className="surface rounded-[14px] p-4 transition hover:bg-white/[0.04]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-white">{list.name}</p>
          <p className="mt-1 text-xs font-semibold text-white/40">{count.toLocaleString()} {count === 1 ? "title" : "titles"}</p>
        </div>
        <HugeiconsIcon icon={ArrowRight01Icon} className="mt-0.5 size-5 shrink-0 text-white/30" />
      </div>
      {list.items.length > 0 ? (
        <div className="mt-3 flex -space-x-3">
          {list.items.slice(0, 5).map((item) => (
            <div key={item.id} className="w-[46px] overflow-hidden rounded-[8px] ring-2 ring-[#11100e]">
              <Poster src={item.title.posterUrl} title={item.title.title} className="rounded-[8px]" />
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm text-white/45">No titles yet.</p>
      )}
    </Link>
  );
}
