"use client";

import { useState } from "react";

// Roughly six lines at drawer width. Longer bios would push the credits far down.
const CLAMP_ABOVE_CHARS = 420;

export function Biography({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const long = text.length > CLAMP_ABOVE_CHARS;

  return (
    <>
      <p className={`whitespace-pre-line text-[15px] leading-7 text-white/70 ${long && !expanded ? "line-clamp-6" : ""}`}>{text}</p>
      {long ? (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          className="cask-focus mt-2 rounded-full text-[13px] font-bold text-[var(--accent-text)] transition hover:underline"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      ) : null}
    </>
  );
}
