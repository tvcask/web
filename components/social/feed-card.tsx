import { HugeiconsIcon } from "@hugeicons/react";
import { FavouriteIcon, Film01Icon, Menu01Icon, StarIcon, Tv01Icon } from "@hugeicons/core-free-icons";
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
    case "watchlist":
      return "wants to watch this";
    default:
      return "is watching this";
  }
}

/**
 * One entry in the feed: a wide still with the name over it and who did it
 * underneath.
 *
 * A poster grid reads as search results. A feed is a column of cards you scroll
 * through, and the artwork has to be big enough to be the reason you stop.
 *
 * Both kinds of entry share that structure. A tracked title fills the art with
 * its backdrop; a list fills it with the covers of what is in it.
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

  return (
    <article className="surface overflow-hidden rounded-[18px]">
      {item.kind === "list" && item.list ? (
        <ListArt list={item.list} />
      ) : item.title ? (
        <TitleArt item={item} returnTo={returnTo} tracked={tracked} />
      ) : null}

      <div className="flex items-center gap-2.5 border-t border-white/[0.06] px-4 py-3 sm:px-5">
        <Link href={`/app/u/${actor.username}`} className="shrink-0">
          <Avatar src={actor.avatarUrl} name={actor.name || actor.username} size={26} />
        </Link>
        <p className="min-w-0 flex-1 truncate text-[13px] text-white/45">
          <Link href={`/app/u/${actor.username}`} className="font-bold text-white/75 transition hover:text-white">
            {actor.name || actor.username}
          </Link>{" "}
          {item.kind === "list" ? "made a list" : activityLabel(actor)}
        </p>
        {/* Rating and favourite ride beside the sentence rather than inside it.
            Someone can finish a show, rate it and favourite it in one go, and
            three clauses would read worse than three marks. */}
        {actor.favorite ? (
          <HugeiconsIcon
            icon={FavouriteIcon}
            size={15}
            strokeWidth={2.2}
            className="shrink-0 text-[var(--accent-text)]"
            aria-label="Favourite"
          />
        ) : null}
        {actor.rating ? (
          <span className="flex shrink-0 items-center gap-1 text-[12px] font-bold text-white/70">
            <HugeiconsIcon icon={StarIcon} size={13} strokeWidth={2.2} className="text-[var(--accent-text)]" />
            {actor.rating}
          </span>
        ) : null}
      </div>
    </article>
  );
}

function TitleArt({ item, returnTo, tracked }: { item: FeedItem; returnTo: string; tracked: boolean }) {
  const title = item.title;
  if (!title) {
    return null;
  }
  const href = `/app/titles/${title.id}?returnTo=${encodeURIComponent(returnTo)}`;
  // Not every title has landscape art. The poster is a worse crop but a better
  // card than an empty box.
  const art = title.backdropUrl || title.posterUrl;
  const isMovie = title.type === "movie";

  return (
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
            <h3 className="display truncate text-lg text-white sm:text-xl">{title.title}</h3>
          </div>
          <p className="mt-1 text-[13px] font-semibold text-white/55">
            {[title.year, isMovie ? "Movie" : "Show"].filter(Boolean).join(" · ")}
          </p>
        </div>
      </Link>
      <div className="absolute right-3 top-3">
        <AddToLibraryButton titleId={title.id} title={title.title} tracked={tracked} />
      </div>
    </div>
  );
}

// A list has no single still, so the covers of what is in it become the art.
// The posters come with the feed response, so a card costs no extra request.
function ListArt({ list }: { list: NonNullable<FeedItem["list"]> }) {
  return (
    <Link href={`/app/lists/${list.id}`} className="relative block">
      <div className="relative flex aspect-[16/9] w-full gap-px overflow-hidden bg-white/[0.04]">
        {list.titles.map((title) => (
          <div key={title.id} className="relative min-w-0 flex-1">
            {title.posterUrl ? (
              <Image src={title.posterUrl} alt="" fill sizes="160px" className="object-cover" />
            ) : null}
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10" />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={Menu01Icon} size={17} strokeWidth={2} className="shrink-0 text-white/70" />
          <h3 className="display truncate text-lg text-white sm:text-xl">{list.name}</h3>
        </div>
        <p className="mt-1 text-[13px] font-semibold text-white/55">
          {list.itemCount} {list.itemCount === 1 ? "title" : "titles"}
        </p>
      </div>
    </Link>
  );
}
