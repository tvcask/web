"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

export function TitleDrawer({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const close = () => router.back();

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") router.back();
    }
    document.addEventListener("keydown", onKey);
    // Lock the page behind the sheet so it doesn't scroll underneath.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
    // router is stable; run once per open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-50">
      <div onClick={close} className="absolute inset-0 bg-black/60" style={{ animation: "fadeIn 0.2s ease both" }} />

      {/* Mobile: bottom sheet. Desktop (sm+): right-hand drawer. */}
      <div
        className="nos absolute inset-x-0 bottom-0 flex max-h-[92dvh] w-full flex-col overflow-y-auto overscroll-contain rounded-t-[22px] border-t border-white/[0.08] bg-[#0a0a0c] [animation:sheetIn_0.3s_cubic-bezier(0.2,0.8,0.2,1)_both] sm:inset-y-0 sm:left-auto sm:right-0 sm:h-full sm:max-h-none sm:w-full sm:max-w-[560px] sm:rounded-t-none sm:border-l sm:border-t-0 sm:[animation:drawerIn_0.28s_cubic-bezier(0.2,0.8,0.2,1)_both]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {/* Grab handle — visual affordance on mobile; tap it to close. */}
        <button
          onClick={close}
          aria-label="Close"
          className="sticky top-0 z-20 flex w-full justify-center bg-gradient-to-b from-[#0a0a0c] to-transparent pt-2.5 pb-4 sm:hidden"
        >
          <span className="h-1 w-9 rounded-full bg-white/45" />
        </button>

        <button
          onClick={close}
          className="absolute left-4 top-4 z-30 grid size-9 place-items-center rounded-full bg-black/55 text-white backdrop-blur transition hover:bg-black/75 sm:left-5 sm:top-5"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>

        {children}
      </div>
    </div>
  );
}
