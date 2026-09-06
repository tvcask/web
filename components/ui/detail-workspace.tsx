"use client";

import { ArrowLeft01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Drawer, DrawerClose, DrawerContent, DrawerTitle } from "@/components/ui/drawer";

function workspaceLabel(pathname: string): string {
  if (pathname.includes("/episodes/")) return "Episode details";
  if (pathname.includes("/people/")) return "Actor details";
  return "Title details";
}

/**
 * A URL-backed detail workspace shared by titles, actors, and episodes.
 * Its route-group layout stays mounted while inner detail routes change, so
 * browser history acts as the workspace navigation stack.
 */
export function DetailWorkspace({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const closeHref = returnTo?.startsWith("/app/") ? returnTo : null;
  const canGoBack = searchParams.get("fromDetail") === "1";
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setOpen(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      onAnimationEnd={(isOpen) => {
        if (isOpen) return;
        if (closeHref) router.replace(closeHref);
        else router.back();
      }}
      direction="bottom"
      handleOnly
    >
      <DrawerContent
        data-detail-workspace
        showHandle={false}
        aria-describedby={undefined}
        className="!inset-0 !h-dvh !max-h-none !w-full !rounded-none !border-0 sm:!inset-6 sm:!m-auto sm:!h-[min(90dvh,900px)] sm:!w-[min(960px,calc(100vw-3rem))] sm:!rounded-[24px] sm:!border sm:!border-white/[0.1] sm:shadow-2xl sm:shadow-black/60"
      >
        <header className="flex min-h-14 shrink-0 items-center border-b border-white/[0.08] px-3 pt-[env(safe-area-inset-top)] sm:min-h-16 sm:px-5 sm:pt-0">
          <div className="flex w-20 justify-start sm:w-28">
            {canGoBack ? (
              <button
                type="button"
                onClick={() => router.back()}
                className="cask-focus inline-flex min-h-10 items-center gap-1.5 rounded-full px-2 text-sm font-bold text-white/60 transition hover:bg-white/5 hover:text-white"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
                <span className="hidden sm:inline">Back</span>
              </button>
            ) : null}
          </div>

          <DrawerTitle className="min-w-0 flex-1 truncate text-center text-sm font-extrabold text-white/80">
            {workspaceLabel(pathname)}
          </DrawerTitle>

          <div className="flex w-20 justify-end sm:w-28">
            <DrawerClose
              className="cask-focus inline-flex min-h-10 items-center gap-1.5 rounded-full px-2 text-sm font-bold text-white/60 transition hover:bg-white/5 hover:text-white"
              aria-label="Close details"
            >
              <span className="hidden sm:inline">Close</span>
              <HugeiconsIcon icon={Cancel01Icon} className="size-4" />
            </DrawerClose>
          </div>
        </header>

        <div
          data-detail-scroll
          className="nos min-h-0 flex-1 overflow-y-auto overscroll-contain"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
