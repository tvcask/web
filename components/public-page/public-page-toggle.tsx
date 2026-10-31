"use client";

import Link from "next/link";
import { useState } from "react";

import { ShareButton } from "@/components/public-page/share-button";
import { ToggleRow } from "@/components/settings/notification-toggles";
import { mutate } from "@/lib/mutate";
import { publicPagePath } from "@/lib/public-page-paths";
import { toast } from "@/lib/toast";

export function PublicPageToggle({
  initial,
  username,
  isPrivate,
  name
}: {
  initial: boolean;
  username?: string;
  isPrivate: boolean;
  name: string;
}) {
  const [enabled, setEnabled] = useState(initial);
  const [saving, setSaving] = useState(false);

  const toggle = () => {
    if (saving) return;
    const next = !enabled;
    setEnabled(next);
    setSaving(true);
    mutate("me/settings", "PATCH", { publicPage: next })
      .catch(() => {
        setEnabled(!next);
        toast("Could not save that. Try again.");
      })
      .finally(() => setSaving(false));
  };

  return (
    <div className="surface mt-5 overflow-hidden rounded-[16px]">
      <ToggleRow
        label="Public page"
        hint="Anyone with the link can see your name, bio, links and public lists. Never your history or stats."
        checked={enabled}
        disabled={saving || !username}
        onToggle={toggle}
      />
      {!username ? (
        <p className="border-t border-white/[0.06] px-4 py-3 text-xs text-white/50">Choose a username above to turn this on.</p>
      ) : enabled && isPrivate ? (
        <p className="border-t border-white/[0.06] px-4 py-3 text-xs text-white/50">
          Your profile is private, so this page stays hidden.{" "}
          <Link href="/app/settings" className="font-bold hover:underline" style={{ color: "var(--accent-text)" }}>
            Privacy settings
          </Link>
        </p>
      ) : enabled ? (
        <div className="flex items-center gap-3 border-t border-white/[0.06] px-4 py-3">
          <Link href={publicPagePath(username)} target="_blank" className="min-w-0 flex-1 truncate text-sm font-bold hover:underline" style={{ color: "var(--accent-text)" }}>
            tvcask.com{publicPagePath(username)}
          </Link>
          <ShareButton
            path={publicPagePath(username)}
            title={name}
            className="cask-focus inline-flex h-9 shrink-0 items-center gap-2 rounded-full bg-white/5 px-3.5 text-[13px] font-bold text-white/80 transition hover:bg-white/10 hover:text-white"
          />
        </div>
      ) : null}
    </div>
  );
}
