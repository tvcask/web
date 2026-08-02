import { HugeiconsIcon } from "@hugeicons/react";
import { Film01Icon, Tv01Icon } from "@hugeicons/core-free-icons";
import Image from "next/image";
import Link from "next/link";
import { AddToLibraryButton } from "@/components/titles/add-to-library-button";
import { Avatar } from "@/components/ui/avatar";
import type { FeedActor, FeedItem } from "@/lib/social";

// What someone did, in their own row. Progress beats the status word when there
// is any: "is on S2E4" is the part worth reading, and that it means watching is
// already obvious from it.
export function activityLabel(actor: FeedActor): string {
  if (actor.status === "watching" && actor.season && actor.episode) {
    return `is on S${actor.season}E${actor.episode}`;
  }
  switch (actor.status) {
    case "completed":
      return "finished this";
    case "dropped":
      return "dropped this";
    case "paused":
      return "paused this";
    default:
      return "is watching this";
  }
}

/**
 * One entry in the feed: a wide still with the title over it and who moved on
 * it underneath.
 *
 * A poster grid reads as search results. A feed is a column of cards you scroll
 * through, and the artwork has to be big enough to be the reason you stop.
 */
export function FeedCard({
  item,
  returnTo,
  tracked
}: {
  item: FeedItem;
  returnTo: string;
  tracked: boolean;
}) {
  const actor = item.actors[0];
  if (!actor) {
    return null;
  }
  const href = `/app/titles/${item.title.id}?returnTo=${encodeURIComponent(returnTo)}`;
  // Not every title has landscape art. The poster is a worse crop but a better
  // card than an empty box.
  const art = item.title.backdropUrl || item.title.posterUrl;
  const isMovie = item.title.type === "movie";

  return (
    <article className="surface overflow-hidden rounded-[18px]">
      <div className="relative">
        <Link href={href} className="block">
          <div className="relative aspect-[16/9] w-full bg-white/[0.04]">
            {art ? <Image src={art} alt="" fill sizes="(min-width: 900px) 620px, 100vw" className="object-cover" /> : null}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
          </div>
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <HugeiconsIcon
                icon={isMovie ? Film01Icon : Tv01Icon}
                size={17}
                strokeWidth={2}
                className="shrink-0 text-white/70"
              />
              <h3 className="display truncate text-lg text-white sm:text-xl">{item.title.title}</h3>
            </div>
            <p className="mt-1 text-[13px] font-semibold text-white/55">
              {[item.title.year, isMovie ? "Movie" : "Show"].filter(Boolean).join(" · ")}
            </p>
          </div>
        </Link>
        <div className="absolute right-3 top-3">
          <AddToLibraryButton titleId={item.title.id} title={item.title.title} tracked={tracked} />
        </div>
      </div>

      <div className="flex items-center gap-2.5 border-t border-white/[0.06] px-4 py-3 sm:px-5">
        <Link href={`/app/u/${actor.username}`} className="shrink-0">
          <Avatar src={actor.avatarUrl} name={actor.name || actor.username} size={26} />
        </Link>
        <p className="min-w-0 truncate text-[13px] text-white/45">
          <Link href={`/app/u/${actor.username}`} className="font-bold text-white/75 transition hover:text-white">
            {actor.name || actor.username}
          </Link>{" "}
          {activityLabel(actor)}
        </p>
      </div>
    </article>
  );
}
