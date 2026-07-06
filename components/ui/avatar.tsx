import { User } from "lucide-react";
import { cn } from "@/lib/utils";

// One branded default for everyone (cask amber + person glyph) until a user
// uploads their own.
export function Avatar({ src, size = 34, className = "" }: { src?: string | null; size?: number; className?: string }) {
  if (src) {
    return (
      <img
        src={src}
        alt=""
        className={cn("rounded-full object-cover", className)}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      className={cn("grid shrink-0 place-items-center rounded-full", className)}
      style={{
        width: size,
        height: size,
        background: "linear-gradient(145deg, oklch(0.48 0.05 58), oklch(0.72 0.13 68))"
      }}
    >
      <User
        strokeWidth={2.4}
        style={{ width: size * 0.5, height: size * 0.5, color: "var(--on-accent)" }}
      />
    </span>
  );
}
