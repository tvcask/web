import Link from "next/link";
import { Poster } from "@/components/titles/poster";
import type { UserTitleWithTitle } from "@/lib/services/types";

export function LibraryGrid({ items, returnTo }: { items: UserTitleWithTitle[]; returnTo: string }) {
  return (
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
  );
}
