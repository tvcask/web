"use client";

import { Copy01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "@/lib/toast";

export function CopyListButton({ text }: { text: string }) {
  async function copyList() {
    try {
      await navigator.clipboard.writeText(text);
      toast("List copied");
    } catch {
      toast("Couldn't copy the list. Try again.");
    }
  }

  return (
    <button
      type="button"
      onClick={copyList}
      className="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 px-4 text-sm font-bold text-white/65 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
    >
      <HugeiconsIcon icon={Copy01Icon} className="size-4" /> Copy as text
    </button>
  );
}
