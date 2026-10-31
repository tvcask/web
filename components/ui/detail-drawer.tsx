"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Drawer, DrawerClose, DrawerContent, DrawerTitle } from "@/components/ui/drawer";

// Matches the slide duration in globals.css. vaul's own close callback is pinned
// to its 500ms default, which would hold the URL back after the panel has gone.
const CLOSE_MS = 200;
const TITLE_REVEAL_PX = 160;
const RESTORE_TIMEOUT_MS = 1000;

const DrawerHeaderContext = createContext<{ titleSlot: HTMLElement | null } | null>(null);

export const useInDetailDrawer = () => useContext(DrawerHeaderContext) !== null;

/** Names the current page in the drawer header. Renders nothing outside the drawer. */
export function DetailDrawerTitle({ children }: { children: React.ReactNode }) {
  const slot = useContext(DrawerHeaderContext)?.titleSlot;
  return slot ? createPortal(children, slot) : null;
}

/** Clears the floating header on pages that have no artwork for it to sit on. */
export function DetailDrawerSpacer() {
  return useInDetailDrawer() ? <div className="h-8 sm:h-6" /> : null;
}

function drawerLabel(pathname: string): string {
  if (pathname.includes("/episodes/")) return "Episode details";
  if (pathname.includes("/people/")) return "Actor details";
  return "Title details";
}

// Shared shell for URL-backed entity details: a bottom sheet on mobile and a side
// drawer on desktop. Focus trapping, scroll lock and aria come from vaul. Browser
// history is the navigation stack, so Back and the browser button agree.
export function DetailDrawer({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const canGoBack =
    searchParams.get("fromDetail") === "1" || searchParams.get("fromTitle") === "1" || searchParams.has("titleId");
  // Nested with nowhere recorded to return to, back() would only go up one level.
  const closeHref = returnTo?.startsWith("/app/") ? returnTo : canGoBack ? "/app/shows" : null;
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches
  );
  const [titleSlot, setTitleSlot] = useState<HTMLElement | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

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
      clearTimeout(closeTimer.current);
      mq.removeEventListener("change", sync);
    };
  }, []);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      setOpen(next);
      if (next) return;
      clearTimeout(closeTimer.current);
      closeTimer.current = setTimeout(() => {
        if (closeHref) router.replace(closeHref);
        else router.back();
      }, CLOSE_MS);
    },
    [closeHref, router]
  );

  // The scroller outlives each page, so it has to put itself back: to the top on
  // a new page, to where you left it on one you're returning to.
  const scroller = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const positions = useRef(new Map<string, number>());
  const restoring = useRef(false);

  useEffect(() => {
    const el = scroller.current;
    const inner = content.current;
    if (!el || !inner) return;
    const target = positions.current.get(pathname) ?? 0;
    el.scrollTop = target;
    if (el.scrollTop === target) return;

    // Still showing the skeleton, so there's nothing to scroll to yet.
    restoring.current = true;
    const done = () => {
      restoring.current = false;
      observer.disconnect();
      clearTimeout(timeout);
      el.removeEventListener("wheel", done);
      el.removeEventListener("touchstart", done);
    };
    const observer = new ResizeObserver(() => {
      el.scrollTop = target;
      if (el.scrollTop === target) done();
    });
    observer.observe(inner);
    const timeout = setTimeout(done, RESTORE_TIMEOUT_MS);
    el.addEventListener("wheel", done, { passive: true });
    el.addEventListener("touchstart", done, { passive: true });
    return done;
  }, [pathname]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const top = event.currentTarget.scrollTop;
    if (!restoring.current) positions.current.set(pathname, top);
    setScrolled(top > TITLE_REVEAL_PX);
  };

  return (
    <Drawer open={open} onOpenChange={handleOpenChange} direction={mobile ? "bottom" : "right"} handleOnly={!mobile}>
      <DrawerContent
        aria-describedby={undefined}
        onPointerDownOutside={(event) => {
          // Toasts live outside the drawer. Using Undo shouldn't close it.
          const target = event.detail.originalEvent.target;
          if (target instanceof Element && target.closest("[data-toast]")) event.preventDefault();
        }}
      >
        <DrawerTitle className="sr-only">{drawerLabel(pathname)}</DrawerTitle>

        <div className="relative flex min-h-0 flex-1 flex-col">
        {/* Floats over the artwork and turns solid once you scroll, like the app's
            top nav. Click-through except its buttons, so the wheel still scrolls. */}
        <header
          className={`pointer-events-none absolute inset-x-0 top-0 z-20 grid h-14 grid-cols-[5rem_minmax(0,1fr)_5rem] items-center border-b px-3 transition-colors duration-150 sm:px-4 ${scrolled ? "border-white/[0.06] bg-[#0c0c0f]/90 backdrop-blur-xl" : "border-transparent"}`}
        >
          <div>
            {canGoBack ? (
              <button
                type="button"
                onClick={() => router.back()}
                className="cask-focus group pointer-events-auto inline-flex min-h-9 items-center gap-1 rounded-full bg-black/50 pl-1.5 pr-3 text-sm font-bold text-white/85 backdrop-blur transition hover:bg-black/70 hover:text-white"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4 transition-transform group-hover:-translate-x-0.5" />
                Back
              </button>
            ) : null}
          </div>
          <p
            ref={setTitleSlot}
            className={`display truncate text-center text-sm text-white transition-opacity duration-150 ${scrolled ? "opacity-100" : "opacity-0"}`}
          />
          <DrawerClose
            className="cask-focus pointer-events-auto grid size-9 place-items-center justify-self-end rounded-full bg-black/50 text-white/85 backdrop-blur transition hover:bg-black/70 hover:text-white"
            aria-label="Close details"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="size-4" />
          </DrawerClose>
        </header>

        <div
          ref={scroller}
          onScroll={handleScroll}
          data-detail-scroll
          className="nos min-h-0 flex-1 overflow-y-auto overscroll-contain"
          // Sticky content sits under this drawer's header, not the app's top nav.
          style={{ paddingBottom: "env(safe-area-inset-bottom)", "--detail-sticky-top": "3.5rem" } as React.CSSProperties}
        >
          <div ref={content}>
            <DrawerHeaderContext.Provider value={{ titleSlot }}>{children}</DrawerHeaderContext.Provider>
          </div>
        </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
