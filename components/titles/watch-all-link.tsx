import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";

// Sits on the attribution line of the Where to watch block. The padding gives a
// 44px hit area without growing the text.
export function WatchAllLink({ href, title }: { href: string; title: string }) {
  return (
    <Link
      href={href}
      aria-label={`See where to watch ${title} in all countries`}
      className="cask-focus -my-3 inline-flex min-h-11 items-center gap-0.5 rounded-full text-xs font-bold text-[var(--accent-text)] hover:underline"
    >
      See all countries
      <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" aria-hidden />
    </Link>
  );
}
