import Image from "next/image";
import { cn } from "@/lib/utils";

// Deterministic gradient seeded from the title, so empty poster slots stay
// varied and on-brand instead of all rendering the same color.
function seededGradient(title: string) {
  let hash = 0;
  for (let i = 0; i < title.length; i += 1) {
    hash = (hash * 31 + title.charCodeAt(i)) >>> 0;
  }
  const hue = hash % 360;
  return `linear-gradient(150deg, hsl(${hue} 44% 32%), hsl(${(hue + 44) % 360} 46% 12%))`;
}

export function Poster({ src, title, className }: { src?: string | null; title: string; className?: string }) {
  if (src) {
    return (
      <div className={cn("relative aspect-[2/3] w-full overflow-hidden rounded-[12px] bg-white/5", className)}>
        <Image
          src={src}
          alt=""
          fill
          sizes="(max-width: 640px) 33vw, (max-width: 1280px) 20vw, 160px"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={cn("relative flex aspect-[2/3] w-full items-end overflow-hidden rounded-[12px] p-2.5", className)}
      style={{ background: seededGradient(title) }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
      <span className="display relative line-clamp-3 text-[13px] leading-tight text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]">
        {title}
      </span>
    </div>
  );
}
