"use client";

import { ArrowLeft01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as Dialog from "@radix-ui/react-dialog";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

function workspaceLabel(pathname: string): string {
  if (pathname.includes("/episodes/")) return "Episode details";
  if (pathname.includes("/people/")) return "Actor details";
  return "Title details";
}

/**
 * A URL-backed detail workspace shared by titles, actors, and episodes.
 * The route-group layout stays mounted while inner routes change, making the
 * browser history the workspace navigation stack without reanimating it.
 */
export function DetailWorkspace({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const closeHref = returnTo?.startsWith("/app/") ? returnTo : null;
  const canGoBack = searchParams.get("fromDetail") === "1";
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setOpen(true));
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(closeTimer.current);
    };
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      if (closeHref) router.replace(closeHref);
      else router.back();
    }, 140);
  }, [closeHref, router]);

  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => { if (!nextOpen) close(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="detail-workspace-overlay fixed inset-0 z-40 bg-black/75 backdrop-blur-[2px]" />
        <Dialog.Content
          data-detail-workspace
          aria-describedby={undefined}
          className="detail-workspace-content fixed inset-0 z-50 flex h-dvh w-full flex-col overflow-hidden bg-[#0a0a0c] outline-none sm:left-1/2 sm:top-1/2 sm:h-[min(86dvh,860px)] sm:w-[min(1120px,calc(100vw-4rem))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[22px] sm:border sm:border-white/[0.1] sm:shadow-2xl sm:shadow-black/70"
        >
          <Dialog.Title className="sr-only">{workspaceLabel(pathname)}</Dialog.Title>

          <header className="flex min-h-14 shrink-0 items-center justify-between border-b border-white/[0.08] px-3 pt-[env(safe-area-inset-top)] sm:px-4 sm:pt-0">
            <div className="min-w-24">
              {canGoBack ? (
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="cask-focus inline-flex min-h-10 items-center gap-1.5 rounded-full px-2.5 text-sm font-bold text-white/60 transition hover:bg-white/5 hover:text-white"
                >
                  <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
                  <span>Back</span>
                </button>
              ) : null}
            </div>

            <Dialog.Close
              className="cask-focus inline-flex min-h-10 items-center gap-1.5 rounded-full px-2.5 text-sm font-bold text-white/60 transition hover:bg-white/5 hover:text-white"
              aria-label="Close details"
            >
              <span className="hidden sm:inline">Close</span>
              <HugeiconsIcon icon={Cancel01Icon} className="size-4" />
            </Dialog.Close>
          </header>

          <div
            data-detail-scroll
            className="nos min-h-0 flex-1 overflow-y-auto overscroll-contain"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
