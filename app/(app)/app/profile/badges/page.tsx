import { BadgeMedallion } from "@/components/badges/badge-medallion";
import { getBadges } from "@/lib/data";

export default async function BadgesPage() {
  const data = await getBadges();
  const locked = data.badges
    .filter((b) => !b.earned)
    .sort((a, b) => b.progress / b.target - a.progress / a.target);
  const closest = locked[0];
  const pct = data.total > 0 ? (data.earned / data.total) * 100 : 0;

  return (
    <div className="mx-auto max-w-[900px] space-y-8">
      <section className="surface rounded-[16px] p-5">
        <div className="flex items-center justify-between">
          <p className="display text-lg text-white">Your collection</p>
          <p className="text-sm font-bold" style={{ color: "var(--accent-text)" }}>
            {data.earned} of {data.total} earned
          </p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.06]">
          <div className="h-2 rounded-full" style={{ width: `${pct}%`, background: "var(--accent)" }} />
        </div>
        <p className="mt-2.5 text-[13px] font-medium text-white/55">
          {closest
            ? `Closest · ${closest.name} (${Math.round((closest.progress / closest.target) * 100)}%)`
            : "Every badge earned. Nice."}
        </p>
      </section>

      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {data.badges.map((badge) => (
          <div key={badge.key} className="flex flex-col items-center text-center" title={badge.description}>
            <BadgeMedallion badge={badge} />
            <p className={`mt-3.5 text-base font-extrabold ${badge.earned ? "text-white" : "text-white/55"}`}>
              {badge.name}
            </p>
            <p className="mt-0.5 text-[12.5px] font-medium text-white/40">{badge.description}</p>
          </div>
        ))}
      </div>

      <p className="mx-auto max-w-[520px] text-center text-[12.5px] font-medium leading-relaxed text-white/40">
        Earned badges glow in tvcask amber; locked ones stay dim until you hit the goal.
      </p>
    </div>
  );
}
