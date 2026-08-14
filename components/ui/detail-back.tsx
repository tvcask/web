"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";

export function DetailBack({ label }: { label: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="group mb-6 inline-flex max-w-full items-center gap-2 rounded-full bg-white/[0.05] px-3 py-2 text-sm font-bold text-white/60 transition hover:bg-white/[0.08] hover:text-white"
    >
      <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4 shrink-0 transition-transform group-hover:-translate-x-0.5" />
      <span className="truncate">{label}</span>
    </button>
  );
}
