import Image from "next/image";
import type { WatchProvider } from "@/lib/services/types";
import { cn } from "@/lib/utils";

const chipClass =
  "cask-focus flex min-h-9 max-w-[220px] items-center gap-2 rounded-full bg-white/[0.06] py-1.5 pl-1.5 pr-3 transition";

export function ProviderChip({
  provider,
  href,
  highlight,
  className
}: {
  provider: WatchProvider;
  href?: string;
  highlight?: boolean;
  className?: string;
}) {
  const classes = cn(chipClass, href && "hover:bg-white/10", highlight && "ring-1 ring-[var(--accent)]", className);
  const content = (
    <>
      {provider.logoUrl ? (
        <Image src={provider.logoUrl} alt="" width={24} height={24} className="size-6 shrink-0 rounded-[5px] object-cover" />
      ) : null}
      <span className="truncate text-xs font-bold text-white/80">{provider.name}</span>
    </>
  );
  return href ? (
    <a href={href} target="_blank" rel="nofollow noreferrer" title={provider.name} className={classes}>
      {content}
    </a>
  ) : (
    <span title={provider.name} className={classes}>
      {content}
    </span>
  );
}
