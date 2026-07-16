"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

const FALLBACK_BACKGROUND =
  "radial-gradient(circle at 82% 12%, rgba(202,154,101,0.34), transparent 42%), linear-gradient(150deg, #211b15 0%, #171412 55%, #0d0c0b 100%)";

export function Poster({ src, title, className }: { src?: string | null; title: string; className?: string }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = Boolean(src && src !== failedSrc);

  if (showImage && src) {
    return (
      <div className={cn("relative aspect-[2/3] w-full overflow-hidden rounded-[16px] bg-white/5", className)}>
        <Image
          src={src}
          alt=""
          fill
          sizes="(max-width: 640px) 33vw, (max-width: 1280px) 20vw, 160px"
          className="object-cover"
          onError={() => setFailedSrc(src)}
        />
      </div>
    );
  }

  return (
    <div
      className={cn("relative flex aspect-[2/3] w-full items-end overflow-hidden rounded-[16px] p-2.5", className)}
      style={{ background: FALLBACK_BACKGROUND }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
      <span className="display relative line-clamp-3 text-[13px] leading-tight text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]">
        {title}
      </span>
    </div>
  );
}
