"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

export function TitleDrawer({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") router.back();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [router]);

  return (
    <>
      <div
        onClick={() => router.back()}
        className="fixed inset-0 z-40 bg-black/60"
        style={{ animation: "fadeIn 0.2s ease both" }}
      />
      <div
        className="nos fixed right-0 top-0 z-50 h-screen w-full max-w-[560px] overflow-y-auto overscroll-contain border-l border-white/[0.08] bg-[#0a0a0c]"
        style={{ animation: "drawerIn 0.28s cubic-bezier(0.2,0.8,0.2,1) both" }}
      >
        <button
          onClick={() => router.back()}
          className="absolute left-5 top-5 z-10 grid size-9 place-items-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>
        {children}
      </div>
    </>
  );
}
