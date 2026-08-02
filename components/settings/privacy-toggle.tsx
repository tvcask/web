"use client";

import { useState } from "react";
import { ToggleRow } from "@/components/settings/notification-toggles";
import { mutate } from "@/lib/mutate";
import { toast } from "@/lib/toast";

/**
 * The opt-out for the whole social surface. Private means private: not
 * searchable, not followable, and a 404 to everyone but you. Phrased as
 * "Private profile" rather than "Public profile" so the switch being off is
 * the state most people already have.
 */
export function PrivacyToggle({ initial }: { initial: boolean }) {
  const [isPrivate, setPrivate] = useState(initial);
  const [saving, setSaving] = useState(false);

  const toggle = () => {
    if (saving) return;
    const next = !isPrivate;
    setPrivate(next);
    setSaving(true);
    mutate("me/settings", "PATCH", { privateProfile: next })
      .catch(() => {
        setPrivate(!next);
        toast("Could not save that. Try again.");
      })
      .finally(() => setSaving(false));
  };

  return (
    <div className="surface overflow-hidden rounded-[14px]">
      <ToggleRow
        label="Private profile"
        hint="Hides you from search and stops anyone opening your profile"
        checked={isPrivate}
        disabled={saving}
        onToggle={toggle}
      />
    </div>
  );
}
