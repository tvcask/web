"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Plus } from "lucide-react";
import { mutate } from "@/lib/mutate";
import { toast } from "@/lib/toast";

// Optimistic "add to library" badge used on posters (rails, search results).
// Flips to a check immediately, then syncs; rolls back if the write fails.
export function AddToLibraryButton({
  titleId,
  title,
  tracked: initialTracked
}: {
  titleId: string;
  title: string;
  tracked: boolean;
}) {
  const router = useRouter();
  const [tracked, setTracked] = useState(initialTracked);
  const [pending, setPending] = useState(false);

  const badge = "cask-focus grid size-[30px] place-items-center rounded-[9px] bg-black/45";
  const style = { color: "var(--accent-text)", boxShadow: "inset 0 0 0 1.5px var(--accent)" } as const;

  if (tracked) {
    return (
      <span className={badge} style={style} aria-hidden>
        {pending ? <Loader2 className="size-[15px] animate-spin" /> : <Check className="size-[15px]" />}
      </span>
    );
  }

  function add() {
    if (pending) return;
    setTracked(true);
    setPending(true);
    mutate("me/titles", "POST", { titleId, status: "watchlist" })
      .then(() => router.refresh())
      .catch(() => {
        setTracked(false);
        toast("Couldn't add to your library. Try again.");
      })
      .finally(() => setPending(false));
  }

  return (
    <button onClick={add} className={badge} style={style} aria-label={`Add ${title}`}>
      <Plus className="size-[15px]" />
    </button>
  );
}
