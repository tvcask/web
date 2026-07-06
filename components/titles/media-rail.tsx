import Link from "next/link";
import { Check, Plus } from "lucide-react";
import { addTitleAction } from "@/app/actions";
import { Poster } from "@/components/titles/poster";
import type { Title } from "@/lib/services/types";

export function MediaRail({
  title,
  items,
  trackedTitleIds = [],
  returnTo,
  seeAllHref
}: {
  title: string;
  items: Title[];
  trackedTitleIds?: string[];
  returnTo?: string;
  seeAllHref?: string;
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="mb-3.5 flex items-baseline justify-between">
        <h2 className="display text-[17px] text-white">{title}</h2>
        {seeAllHref ? (
          <Link href={seeAllHref} className="text-[13px] font-bold text-white/45 transition hover:text-white">
            See all
          </Link>
        ) : null}
      </div>
      <div className="nos flex gap-3.5 overflow-x-auto pb-1">
        {items.map((item) => {
          const href = returnTo
            ? `/app/titles/${item.id}?returnTo=${encodeURIComponent(returnTo)}`
            : `/app/titles/${item.id}`;
          const tracked = trackedTitleIds.includes(item.id);
          return (
            <div key={item.id} className="relative w-[148px] shrink-0">
              <Link href={href} className="block overflow-hidden rounded-[14px] lift">
                <Poster src={item.posterUrl} title={item.title} className="rounded-[14px]" />
              </Link>
              {tracked ? (
                <span
                  className="absolute right-2.5 top-2.5 grid size-[30px] place-items-center rounded-[9px] bg-black/45"
                  style={{ color: "var(--accent-text)", boxShadow: "inset 0 0 0 1.5px var(--accent)" }}
                >
                  <Check className="size-[15px]" />
                </span>
              ) : (
                <form action={addTitleAction} className="absolute right-2.5 top-2.5">
                  <input type="hidden" name="payload" value={JSON.stringify({ title: item, status: "watchlist", favorite: false })} />
                  {returnTo ? <input type="hidden" name="returnTo" value={returnTo} /> : null}
                  <button
                    className="cask-focus grid size-[30px] place-items-center rounded-[9px] bg-black/45"
                    style={{ color: "var(--accent-text)", boxShadow: "inset 0 0 0 1.5px var(--accent)" }}
                    aria-label={`Add ${item.title}`}
                  >
                    <Plus className="size-[15px]" />
                  </button>
                </form>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
