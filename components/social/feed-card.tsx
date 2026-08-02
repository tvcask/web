import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Poster } from "@/components/titles/poster";
import type { FeedActor, FeedItem } from "@/lib/social";

// What someone did, in the second person's words. Progress beats the status
// word when there is any: "is on S2E4" is the part worth reading, and the fact
// that it means "watching" is already obvious.
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
 * One entry in the feed. The poster is the hero and the person is the
 * attribution, because the reason to open this is to find something to watch,
 * not to keep tabs on anyone.
 *
 * Tapping the card opens the title. The avatar is its own link to the profile,
 * so both destinations are reachable without a menu.
 */
export function FeedCard({ item, returnTo }: { item: FeedItem; returnTo: string }) {
  const actor = item.actors[0];
  if (!actor) {
    return null;
  }
  const href = `/app/titles/${item.title.id}?returnTo=${encodeURIComponent(returnTo)}`;

  return (
    <div>
      <Link href={href} className="lift block overflow-hidden rounded-[14px]">
        <Poster src={item.title.posterUrl} title={item.title.title} className="rounded-[14px]" />
      </Link>
      <Link href={href} className="mt-2.5 block truncate text-[13px] font-bold text-white">
        {item.title.title}
      </Link>
      <div className="mt-1.5 flex min-w-0 items-center gap-1.5">
        <Link href={`/app/u/${actor.username}`} className="shrink-0" aria-label={actor.name || actor.username}>
          <Avatar src={actor.avatarUrl} name={actor.name || actor.username} size={18} />
        </Link>
        <p className="min-w-0 truncate text-[12px] text-white/45">
          <Link href={`/app/u/${actor.username}`} className="font-semibold text-white/60 transition hover:text-white">
            {actor.name || actor.username}
          </Link>{" "}
          {activityLabel(actor)}
        </p>
      </div>
    </div>
  );
}
