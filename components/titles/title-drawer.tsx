"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Drawer } from "vaul";
import { X } from "lucide-react";

// Detail modal for the intercepting `@modal/(.)titles/[id]` route. Built on vaul
// (Radix Dialog under the hood) so we get focus trap, scrollbar-safe scroll lock,
// aria semantics, Esc, and drag-to-dismiss for free. Bottom sheet on mobile,
// right-hand drawer on desktop.
export function TitleDrawer({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    // Open on the next frame so the closed state paints first. Flipping open in
    // the effect body sometimes lands in the same commit as the mount, so vaul
    // skips the slide and the sheet pops in.
    const raf = requestAnimationFrame(() => setOpen(true));
    return () => {
      cancelAnimationFrame(raf);
      mq.removeEventListener("change", sync);
    };
  }, []);

  return (
    <Drawer.Root
      open={open}
      onOpenChange={setOpen}
      // Navigate back only once the close animation has finished, so the sheet
      // slides out instead of vanishing.
      onAnimationEnd={(isOpen) => {
        if (!isOpen) router.back();
      }}
      direction={mobile ? "bottom" : "right"}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-black/60" />
        <Drawer.Content
          aria-describedby={undefined}
          className={
            "fixed z-50 flex flex-col bg-[#0a0a0c] outline-none " +
            (mobile
              ? "inset-x-0 bottom-0 max-h-[92dvh] rounded-t-[22px] border-t border-white/[0.08]"
              : "inset-y-0 right-0 h-full w-full max-w-[560px] border-l border-white/[0.08]")
          }
        >
          <Drawer.Title className="sr-only">Title details</Drawer.Title>

          {mobile ? <div className="mx-auto mt-2.5 h-1 w-9 shrink-0 rounded-full bg-white/25" /> : null}

          <button
            onClick={() => setOpen(false)}
            className="absolute left-4 top-4 z-30 grid size-9 place-items-center rounded-full bg-black/55 text-white backdrop-blur transition hover:bg-black/75 sm:left-5 sm:top-5"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>

          <div
            className="nos min-h-0 flex-1 overflow-y-auto overscroll-contain"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            {children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
