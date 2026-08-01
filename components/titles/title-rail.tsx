import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, FavouriteIcon } from "@hugeicons/core-free-icons";
import { Poster } from "@/components/titles/poster";

type RailTitle = { id: string; title: string; posterUrl?: string | null };

// A horizontal strip of posters with a heading. Used on your own profile and on
// anyone else's, so the two look the same by construction.
export function TitleRail({
  title,
  items,
  heart = false,
  href,
  returnTo
}: {
  title: string;
  items: RailTitle[];
  heart?: boolean;
  href?: string;
  /** Where the title pages send people back to. */
  returnTo: string;
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        {heart ? (
          <HugeiconsIcon
            icon={FavouriteIcon}
            className="size-4 fill-current"
            style={{ color: "var(--accent-text)" }}
            aria-hidden
          />
        ) : null}
        <h2 className="display text-lg text-white">{title}</h2>
        {href ? (
          <Link href={href} className="ml-auto text-white/40 transition hover:text-white" aria-label={`All ${title}`}>
            <HugeiconsIcon icon={ArrowRight01Icon} className="size-5" />
          </Link>
        ) : null}
      </div>
      <div className="nos flex gap-3 overflow-x-auto pb-1">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/app/titles/${item.id}?returnTo=${encodeURIComponent(returnTo)}`}
            className="lift w-[100px] shrink-0 overflow-hidden rounded-[12px]"
          >
            <Poster src={item.posterUrl} title={item.title} className="rounded-[12px]" />
          </Link>
        ))}
      </div>
    </section>
  );
}
