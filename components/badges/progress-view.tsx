import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { BadgeGallery } from "@/components/badges/badge-gallery";
import type { BadgesResult } from "@/lib/data";

// The progress screen, for your own badges and for anyone else's. `own` swaps
// the copy that only makes sense about yourself.
export function ProgressView({
  badges,
  backHref,
  backLabel = "Profile",
  own = true
}: {
  badges: BadgesResult;
  backHref: string;
  backLabel?: string;
  own?: boolean;
}) {
  const closest = badges.badges
    .filter((badge) => !badge.earned)
    .sort((a, b) => b.progress / b.target - a.progress / a.target)[0];
  const badgePct = badges.total > 0 ? (badges.earned / badges.total) * 100 : 0;
  const levelPct = badges.xpForNext > 0 ? Math.min((badges.xpIntoLevel / badges.xpForNext) * 100, 100) : 0;

  return (
    <div className="mx-auto max-w-[900px] space-y-8">
      <Link href={backHref} className="inline-flex items-center gap-1 text-sm font-semibold text-white/60 hover:text-white">
        <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" /> {backLabel}
      </Link>

      <section className="surface rounded-[16px] p-6">
        <div className="flex items-baseline justify-between">
          <h1 className="display text-2xl text-white">Level {badges.level}</h1>
          <p className="text-sm font-bold" style={{ color: "var(--accent-text)" }}>
            {badges.xpIntoLevel.toLocaleString()} / {badges.xpForNext.toLocaleString()} points
          </p>
        </div>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
          <div className="h-2.5 rounded-full" style={{ width: `${levelPct}%`, background: "var(--accent)" }} />
        </div>
        {own ? (
          <p className="mt-3 text-[13px] font-medium text-white/55">
            Earn points by watching shows and movies, completing them, and creating lists.
          </p>
        ) : null}
      </section>

      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="display text-lg text-white">Badges</h2>
          <p className="text-sm font-bold" style={{ color: "var(--accent-text)" }}>
            {badges.earned} of {badges.total} earned
          </p>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
          <div className="h-2 rounded-full" style={{ width: `${badgePct}%`, background: "var(--accent)" }} />
        </div>
        {own && closest ? <p className="text-[13px] font-medium text-white/55">Closest · {closest.name}</p> : null}

        <BadgeGallery badges={badges.badges} />
      </section>
    </div>
  );
}
