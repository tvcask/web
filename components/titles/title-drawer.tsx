"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Drawer, DrawerClose, DrawerContent, DrawerTitle } from "@/components/ui/drawer";

// Detail modal for the intercepting `@modal/(.)titles/[id]` route. Bottom sheet
// on mobile, right-hand drawer on desktop. The heavy lifting (focus trap, scroll
// lock, aria, drag-to-dismiss) lives in the shadcn/vaul Drawer primitive.
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
    // Open on mount so the enter animation plays.
    setOpen(true);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      // Navigate back only once the close animation finishes, so the sheet
      // slides out instead of vanishing.
      onAnimationEnd={(isOpen) => {
        if (!isOpen) router.back();
      }}
      direction={mobile ? "bottom" : "right"}
    >
      <DrawerContent aria-describedby={undefined}>
        <DrawerTitle className="sr-only">Title details</DrawerTitle>

        <DrawerClose
          className="absolute left-4 top-4 z-30 grid size-9 place-items-center rounded-full bg-black/55 text-white backdrop-blur transition hover:bg-black/75 sm:left-5 sm:top-5"
          aria-label="Close"
        >
          <X className="size-4" />
        </DrawerClose>

        <div
          className="nos min-h-0 flex-1 overflow-y-auto overscroll-contain"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
