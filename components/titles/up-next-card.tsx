import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";
import { markNextAction } from "@/app/actions";
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
  nextEpisodeName
}: {
  item: UserTitleWithTitle;
  returnTo?: string;
  nextEpisodeName?: string;
}) {
  const season = item.currentSeason ?? 1;
  const nextEpisode = (item.currentEpisode ?? 0) + 1;
  const href = `/app/titles/${item.title.id}?returnTo=${encodeURIComponent(returnTo)}`;
  const remaining = Math.max(0, item.episodeCount - nextEpisode);

  return (
    <article className="flex items-center gap-5 rounded-[16px] border border-white/[0.08] p-4">
      <Link
        href={href}
        className="relative h-[80px] w-[140px] shrink-0 overflow-hidden rounded-[10px] ring-1 ring-white/[0.07]"
        style={item.title.backdropUrl ? undefined : { background: seededGradient(item.title.title) }}
      >
        {item.title.backdropUrl ? <img src={item.title.backdropUrl} alt="" className="h-full w-full object-cover" /> : null}
      </Link>

      <div className="min-w-0 flex-1">
        <Link
          href={href}
          className="inline-flex max-w-full items-center gap-1 rounded-full border border-white/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white"
        >
          <span className="truncate">{item.title.title}</span>
          <ChevronRight className="size-3 shrink-0" />
        </Link>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="display text-xl text-white">
            S{pad(season)} | E{pad(nextEpisode)}
          </span>
          {remaining > 0 ? <span className="text-sm font-semibold text-white/40">+{remaining}</span> : null}
        </div>
        {nextEpisodeName ? <p className="mt-0.5 truncate text-sm text-white/50">{nextEpisodeName}</p> : null}
      </div>

      <form action={markNextAction}>
        <input type="hidden" name="userTitleId" value={item.id} />
        <input type="hidden" name="returnTo" value={returnTo} />
        <button
          className="cask-focus grid size-11 shrink-0 place-items-center rounded-full text-transparent transition hover:text-[color:var(--accent-text)]"
          style={{ boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.25)" }}
          aria-label={`Mark S${pad(season)}E${pad(nextEpisode)} of ${item.title.title} watched`}
        >
          <Check className="size-5" />
        </button>
      </form>
    </article>
  );
}
