import type { Badge } from "@/lib/data";
import { renderBadgeSvg } from "@/lib/badge-art";

/**
 * A badge medallion. Illustration + disc + tier rim come from the shared
 * badge-art module as one SVG string (identical to the mobile app), injected
 * inline. Locked badges render the same art in a grey palette.
 */
export function BadgeMedallion({ badge, size = 88 }: { badge: Badge; size?: number }) {
  const svg = renderBadgeSvg(badge.art, badge.tier, { locked: !badge.earned, size, id: `${badge.key}-${size}` });
  return (
    <span
      aria-hidden
      className="inline-block leading-none"
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
