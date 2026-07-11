import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { BadgeGallery } from "@/components/badges/badge-gallery";
import { getBadges } from "@/lib/data";

export default async function ProgressPage() {
  const badges = await getBadges();
  const closest = badges.badges
    .filter((b) => !b.earned)
    .sort((a, b) => b.progress / b.target - a.progress / a.target)[0];
  const badgePct = badges.total > 0 ? (badges.earned / badges.total) * 100 : 0;
  const levelPct = badges.xpForNext > 0 ? Math.min((badges.xpIntoLevel / badges.xpForNext) * 100, 100) : 0;

  return (
    <div className="mx-auto max-w-[900px] space-y-8">
      <Link href="/app/profile" className="inline-flex items-center gap-1 text-sm font-semibold text-white/60 hover:text-white">
        <ChevronLeft className="size-4" /> Profile
      </Link>

      <section className="surface rounded-[16px] p-6">
        <div className="flex items-baseline justify-between">
          <h1 className="display text-2xl text-white">Level {badges.level}</h1>
          <p className="text-sm font-bold" style={{ color: "var(--accent-text)" }}>
            {badges.xpIntoLevel.toLocaleString()} / {badges.xpForNext.toLocaleString()} XP
          </p>
        </div>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
          <div className="h-2.5 rounded-full" style={{ width: `${levelPct}%`, background: "var(--accent)" }} />
        </div>
        <p className="mt-3 text-[13px] font-medium text-white/55">
          Earn XP by watching, finishing titles and building lists.
        </p>
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
        {closest ? <p className="text-[13px] font-medium text-white/55">Closest · {closest.name}</p> : null}

        <BadgeGallery badges={badges.badges} />
      </section>
    </div>
  );
}
