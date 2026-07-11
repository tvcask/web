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
 * One badge medallion. Earned = filled amber disc with a soft glow; locked =
 * simply dim. Progress lives on the collection bar and detail, not the medallion.
 */
export function BadgeMedallion({ badge, size = 88 }: { badge: Badge; size?: number }) {
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
          boxShadow: "0 4px 18px rgba(202,154,101,0.5)"
        }}
      >
        <Icon size={iconSize} className="text-white" strokeWidth={2} />
      </div>
    );
  }

  return (
    <div className="grid place-items-center rounded-full bg-white/[0.06]" style={{ width: size, height: size }}>
      <Icon size={iconSize} className="text-white/35" strokeWidth={2} />
    </div>
  );
}
