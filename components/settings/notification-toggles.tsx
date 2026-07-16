"use client";

import { useState } from "react";
import { mutate } from "@/lib/mutate";
import { toast } from "@/lib/toast";

type Alerts = {
  newEpisodeAlerts: boolean;
  badgeAlerts: boolean;
};

/**
 * Instant switches for what lands in the notification feed. They gate
 * creation on the API, so feed and push go quiet together.
 */
export function NotificationToggles({ initial }: { initial: Alerts }) {
  const [alerts, setAlerts] = useState(initial);
  const [saving, setSaving] = useState(false);

  const toggle = (key: keyof Alerts) => {
    if (saving) return;
    const previous = alerts[key];
    const next = { ...alerts, [key]: !alerts[key] };
    setAlerts(next);
    setSaving(true);
    mutate("me/settings", "PATCH", { [key]: next[key] })
      .catch(() => {
        setAlerts((current) => ({ ...current, [key]: previous }));
        toast("Could not save that. Try again.");
      })
      .finally(() => setSaving(false));
  };

  return (
    <div className="surface overflow-hidden rounded-[14px]">
      <ToggleRow
        label="New episode alerts"
        hint="When a show you track airs an episode"
        checked={alerts.newEpisodeAlerts}
        disabled={saving}
        onToggle={() => toggle("newEpisodeAlerts")}
      />
      <div className="border-t border-white/[0.06]" />
      <ToggleRow
        label="Badge alerts"
        hint="When you earn a badge"
        checked={alerts.badgeAlerts}
        disabled={saving}
        onToggle={() => toggle("badgeAlerts")}
      />
    </div>
  );
}

function ToggleRow({
  label,
  hint,
  checked,
  disabled,
  onToggle
}: {
  label: string;
  hint: string;
  checked: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-4">
      <div>
        <p className="text-sm font-bold text-white">{label}</p>
        <p className="mt-0.5 text-xs text-white/45">{hint}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={onToggle}
        className="cask-focus relative h-7 w-12 shrink-0 rounded-full transition-colors disabled:opacity-60"
        style={{ background: checked ? "var(--accent)" : "rgba(255,255,255,0.15)" }}
      >
        <span
          className="absolute top-0.5 size-6 rounded-full bg-white transition-all"
          style={{ left: checked ? "calc(100% - 26px)" : "2px" }}
        />
      </button>
    </div>
  );
}
