import { HugeiconsIcon } from '@hugeicons/react';
import { UserIcon } from '@hugeicons/core-free-icons';
import { cn } from "@/lib/utils";

// The same placeholder the iOS app uses: warm cask gradient with the user's
// initial. Falls back to a person glyph when we don't know a name.
export function Avatar({
  src,
  name,
  size = 34,
  className = ""
}: {
  src?: string | null;
  name?: string | null;
  size?: number;
  className?: string;
}) {
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
  const initial = name?.trim()[0]?.toUpperCase();
  return (
    <span
      className={cn("grid shrink-0 place-items-center rounded-full", className)}
      style={{
        width: size,
        height: size,
        background: "linear-gradient(160deg, #3a2f2a, #c0956a)"
      }}
    >
      {initial ? (
        <span className="font-extrabold text-white" style={{ fontSize: size * 0.42 }}>
          {initial}
        </span>
      ) : (
        <HugeiconsIcon
          icon={UserIcon}
          strokeWidth={2.4}
          style={{ width: size * 0.5, height: size * 0.5, color: "#fff" }}
        />
      )}
    </span>
  );
}
