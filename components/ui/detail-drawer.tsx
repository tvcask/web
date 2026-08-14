"use client";

import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon } from '@hugeicons/core-free-icons';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Drawer, DrawerClose, DrawerContent, DrawerTitle } from "@/components/ui/drawer";

// Shared shell for URL-backed entity details. It is a bottom sheet on mobile
// and a side drawer on desktop; focus trapping, scroll lock, aria, and drag to
// dismiss are provided by the vaul primitive.
export function DetailDrawer({
  children,
  label = "Details"
}: {
  children: React.ReactNode;
  label?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const closeHref = returnTo?.startsWith("/app/") ? returnTo : null;
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
    <Drawer
      open={open}
      onOpenChange={setOpen}
      // Navigate back only once the close animation finishes, so the sheet
      // slides out instead of vanishing.
      onAnimationEnd={(isOpen) => {
        if (!isOpen) {
          if (closeHref) router.replace(closeHref);
          else router.back();
        }
      }}
      direction={mobile ? "bottom" : "right"}
    >
      <DrawerContent aria-describedby={undefined}>
        <DrawerTitle className="sr-only">{label}</DrawerTitle>

        <DrawerClose
          className="absolute left-4 top-4 z-30 grid size-9 place-items-center rounded-full bg-black/55 text-white backdrop-blur transition hover:bg-black/75 sm:left-5 sm:top-5"
          aria-label="Close"
        >
          <HugeiconsIcon icon={Cancel01Icon} className="size-4" />
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
