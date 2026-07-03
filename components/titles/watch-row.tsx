import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";
import { markNextAction } from "@/app/actions";
import { Poster } from "@/components/titles/poster";
import type { UserTitleWithTitle } from "@/lib/services/types";

export function WatchRow({ item }: { item: UserTitleWithTitle }) {
  const currentSeason = item.currentSeason ?? 1;
  const nextEpisode = (item.currentEpisode ?? 0) + 1;

  return (
    <article className="lift group grid grid-cols-[92px_1fr_auto] items-center gap-4 rounded-xl bg-[#050505] p-3 ring-1 ring-[#1f1f1f] hover:ring-[#D88945]/45">
      <Link href={`/app/titles/${item.title.id}`} className="overflow-hidden rounded-lg">
        <Poster src={item.title.posterUrl} title={item.title.title} className="rounded-lg" />
      </Link>
      <div className="min-w-0">
        <Link href={`/app/titles/${item.title.id}`} className="inline-flex max-w-full items-center rounded-full border border-[#555] px-3 py-1 text-xs font-black uppercase">
          <span className="truncate">{item.title.title}</span>
          <ChevronRight className="ml-1 size-3" />
        </Link>
        <p className="mt-3 text-xl font-black">
          S{currentSeason < 10 ? `0${currentSeason}` : currentSeason} | E{nextEpisode < 10 ? `0${nextEpisode}` : nextEpisode}
        </p>
        <p className="mt-1 truncate text-sm text-[#B7B7B7]">{item.status === "completed" ? "Completed" : "Watch next episode"}</p>
      </div>
      <form action={markNextAction}>
        <input type="hidden" name="userTitleId" value={item.id} />
        <button className="grid size-12 place-items-center rounded-full bg-white text-black transition hover:bg-[#D88945]" aria-label={`Mark next episode of ${item.title.title} watched`}>
          <Check className="size-6" />
        </button>
      </form>
    </article>
  );
}
