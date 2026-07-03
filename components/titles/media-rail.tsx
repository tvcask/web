import Link from "next/link";
import { Plus } from "lucide-react";
import { addTitleAction } from "@/app/actions";
import { Poster } from "@/components/titles/poster";
import type { Title } from "@/lib/services/types";

export function MediaRail({ title, items }: { title: string; items: Title[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black tracking-normal">{title}</h2>
        <span className="text-sm font-bold text-[#D88945]">View all</span>
      </div>
      <div className="app-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5 sm:-mx-8 sm:px-8">
        {items.map((item) => (
          <div key={item.id} className="group relative w-[150px] shrink-0 sm:w-[176px]">
            <Link href={`/app/titles/${item.id}`} className="block overflow-hidden rounded-lg bg-[#101010]">
              <Poster src={item.posterUrl} title={item.title} className="rounded-lg transition duration-200 group-hover:scale-[1.035]" />
            </Link>
            <form action={addTitleAction} className="absolute right-2 top-2">
              <input type="hidden" name="payload" value={JSON.stringify({ title: item, status: "watchlist", favorite: false })} />
              <button
                className="grid size-8 place-items-center rounded-lg border border-[#D88945] bg-black/70 text-[#D88945] backdrop-blur transition hover:bg-[#D88945] hover:text-black"
                aria-label={`Add ${item.title}`}
              >
                <Plus className="size-4" />
              </button>
            </form>
            <p className="mt-2 truncate text-sm font-bold">{item.title}</p>
            <p className="text-xs text-[#878787]">{item.year ?? item.type}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
