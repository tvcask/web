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
    // Lock the page behind the sheet so the body doesn't scroll on mobile.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [router]);

  return (
    <>
      <div
        onClick={() => router.back()}
        className="fixed inset-0 z-40 bg-black/60"
        style={{ animation: "fadeIn 0.2s ease both" }}
      />
      <div
        className="nos fixed z-50 flex flex-col overflow-y-auto overscroll-contain bg-[#0a0a0c] inset-x-0 bottom-0 max-h-[92dvh] w-full rounded-t-[22px] border-t border-white/[0.08] [animation:sheetIn_0.3s_cubic-bezier(0.2,0.8,0.2,1)_both] sm:inset-y-0 sm:left-auto sm:right-0 sm:h-dvh sm:max-h-none sm:w-full sm:max-w-[560px] sm:rounded-t-none sm:border-l sm:border-t-0 sm:[animation:drawerIn_0.28s_cubic-bezier(0.2,0.8,0.2,1)_both]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {/* Grab handle — mobile bottom sheet only. */}
        <div className="pointer-events-none absolute inset-x-0 top-2.5 z-20 flex justify-center sm:hidden">
          <span className="h-1 w-9 rounded-full bg-white/40" />
        </div>

        <button
          onClick={() => router.back()}
          className="absolute left-4 top-4 z-10 grid size-9 place-items-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70 sm:left-5 sm:top-5"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>
        {children}
      </div>
    </>
  );
}
