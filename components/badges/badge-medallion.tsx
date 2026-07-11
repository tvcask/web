import { Award, Bookmark, CircleCheck, Clapperboard, Clock, Flame, Heart, List, Tv, Zap, type LucideIcon } from "lucide-react";
import type { Badge } from "@/lib/data";

// Badge icons arrive from the API as lucide names. Unknown names fall back to a
// medal so a badge the server adds later still renders.
const ICONS: Record<string, LucideIcon> = {
  tv: Tv,
  bookmark: Bookmark,
  zap: Zap,
  clapperboard: Clapperboard,
  flame: Flame,
  "circle-check": CircleCheck,
  heart: Heart,
  list: List,
  clock: Clock,
  award: Award
};

const iconFor = (name: string): LucideIcon => ICONS[name] ?? Award;

/**
 * One badge medallion. Earned = filled amber disc with a soft glow; locked = dim
 * disc ringed by an accent arc showing progress to the goal.
 */
export function BadgeMedallion({ badge, size = 96 }: { badge: Badge; size?: number }) {
  const Icon = iconFor(badge.icon);
  const iconSize = Math.round(size * 0.4);

  if (badge.earned) {
    return (
      <div
        className="grid place-items-center rounded-full"
        style={{
          width: size,
          height: size,
          background: "linear-gradient(150deg,#e4c69e,#c68f58)",
          boxShadow: "0 4px 22px rgba(202,154,101,0.5)"
        }}
      >
        <Icon size={iconSize} className="text-white" strokeWidth={2} />
      </div>
    );
  }

  const stroke = 3;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const pct = badge.target > 0 ? Math.min(badge.progress / badge.target, 1) : 0;

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0 -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        {pct > 0 ? (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - pct)}
          />
        ) : null}
      </svg>
      <div className="grid place-items-center rounded-full bg-white/[0.06]" style={{ width: size - 12, height: size - 12 }}>
        <Icon size={iconSize} className="text-white/35" strokeWidth={2} />
      </div>
    </div>
  );
}
