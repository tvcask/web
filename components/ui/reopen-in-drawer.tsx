"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { isDetailPath } from "@/lib/detail-return";

let pending: string[] = [];
let awaitingPath: string | null = null;

/**
 * A full page load can't show the drawer, because there's no list to keep behind
 * it. So go to the list first, and let DrawerReopener come back here from there,
 * which Next intercepts into the drawer. `parentHref` is the page this one was
 * opened from, rebuilt into history so the drawer's Back still goes there.
 */
export function ReopenInDrawer({ listHref, parentHref }: { listHref: string; parentHref?: string }) {
  const router = useRouter();
  useEffect(() => {
    const here = window.location.pathname + window.location.search + window.location.hash;
    pending = parentHref ? [parentHref, here] : [here];
    awaitingPath = null;
    router.replace(listHref);
  }, [listHref, parentHref, router]);
  return null;
}

// Lives in the app shell because it has to outlive the page above. Each step waits
// for the last to land, since starting a navigation cancels one still in progress.
export function DrawerReopener() {
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (pending.length === 0) return;
    if (isDetailPath(pathname) && pathname !== awaitingPath) return;
    const href = pending.shift()!;
    awaitingPath = href.split(/[?#]/, 1)[0];
    router.push(href, { scroll: false });
  }, [pathname, router]);
  return null;
}
