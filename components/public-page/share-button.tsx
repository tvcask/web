"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Share01Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useState, useTransition } from "react";

import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerTitle } from "@/components/ui/drawer";
import { toast } from "@/lib/toast";

/**
 * Why the link wouldn't work yet. Sharing is never allowed to hand out a dead link,
 * so these get a prompt first: either fix it from here, or go where it can be fixed.
 */
export type ShareBlocker =
  | { title: string; message: string; confirmLabel: string; confirm: () => Promise<void> }
  | { title: string; message: string; href: string; hrefLabel: string };

async function shareLink(path: string, title: string) {
  const url = `${window.location.origin}${path}`;
  // The share sheet is for phones. On desktop it's an odd detour from just copying.
  if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
    try {
      await navigator.share({ title, url });
    } catch {
      // Closing the sheet rejects too, and isn't an error worth mentioning.
    }
    return;
  }
  try {
    await navigator.clipboard.writeText(url);
    toast("Link copied");
  } catch {
    toast("Couldn't copy the link. Try again.");
  }
}

export function ShareButton({
  path,
  title,
  blocker,
  className,
  iconOnly = false
}: {
  path: string;
  title: string;
  blocker?: ShareBlocker;
  className: string;
  iconOnly?: boolean;
}) {
  const [promptOpen, setPromptOpen] = useState(false);
  const [saving, startSaving] = useTransition();

  return (
    <>
      <button
        type="button"
        onClick={() => (blocker ? setPromptOpen(true) : shareLink(path, title))}
        className={className}
        aria-label={iconOnly ? "Share" : undefined}
        title={iconOnly ? "Share" : undefined}
      >
        <HugeiconsIcon icon={Share01Icon} className={iconOnly ? "size-[18px]" : "size-4"} />
        {/* Named for what it does: phones get the share sheet, desktops a copied link.
            In CSS rather than state so the server and client render the same thing. */}
        {iconOnly ? null : (
          <>
            <span className="pointer-coarse:hidden">Copy link</span>
            <span className="hidden pointer-coarse:inline">Share</span>
          </>
        )}
      </button>

      {blocker ? (
        <Drawer open={promptOpen} onOpenChange={setPromptOpen}>
          <DrawerContent className="mx-auto max-w-lg p-6 pb-8 text-white">
            <DrawerTitle className="text-lg font-bold">{blocker.title}</DrawerTitle>
            <DrawerDescription className="mt-2 text-sm text-white/60">{blocker.message}</DrawerDescription>
            <div className="mt-5 flex flex-col gap-2">
              {"href" in blocker ? (
                <Link href={blocker.href} className="accent-fill rounded-full px-4 py-3 text-center font-bold">
                  {blocker.hrefLabel}
                </Link>
              ) : (
                <button
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    startSaving(async () => {
                      try {
                        await blocker.confirm();
                      } catch {
                        toast("Couldn't turn that on. Try again.");
                        return;
                      }
                      setPromptOpen(false);
                      await shareLink(path, title);
                    })
                  }
                  className="accent-fill rounded-full px-4 py-3 font-bold disabled:opacity-60"
                >
                  {saving ? "Turning on…" : blocker.confirmLabel}
                </button>
              )}
              <DrawerClose className="px-4 py-2 text-white/60">Cancel</DrawerClose>
            </div>
          </DrawerContent>
        </Drawer>
      ) : null}
    </>
  );
}
