"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Flag02Icon } from "@hugeicons/core-free-icons";
import { mutate } from "@/lib/mutate";
import { toast } from "@/lib/toast";

// The categories the API accepts. Free text goes in the note, never the reason,
// so the admin view stays scannable.
const REASONS: { value: string; label: string }[] = [
  { value: "harassment", label: "Harassment or bullying" },
  { value: "hate", label: "Hate speech" },
  { value: "impersonation", label: "Impersonation" },
  { value: "spam", label: "Spam" },
  { value: "other", label: "Something else" }
];

/**
 * Flags an account for a human to look at. Confirms the same way whether or not
 * a report already existed, because the API answers the same way: telling
 * someone "you already reported this" would confirm the earlier one landed.
 */
export function ReportButton({ userId, username }: { userId: string; username: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(REASONS[0].value);
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async () => {
    if (sending) return;
    setSending(true);
    try {
      await mutate("me/reports", "POST", { userId, reason, note });
      setOpen(false);
      setNote("");
      toast("Thanks. We'll take a look.");
    } catch {
      toast("Couldn't send that. Try again.");
    } finally {
      setSending(false);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-9 items-center gap-2 rounded-full border border-white/12 px-4 text-[13px] font-bold text-white/60 transition hover:border-white/25 hover:text-white"
      >
        <HugeiconsIcon icon={Flag02Icon} className="size-4" />
        Report
      </button>
    );
  }

  return (
    <div className="surface w-full rounded-[14px] p-4">
      <p className="text-sm font-bold text-white">Report @{username}</p>
      <div className="mt-3 space-y-2">
        {REASONS.map((option) => (
          <label key={option.value} className="flex items-center gap-2.5 text-sm text-white/70">
            <input
              type="radio"
              name="report-reason"
              value={option.value}
              checked={reason === option.value}
              onChange={() => setReason(option.value)}
              className="size-4 accent-[#E0A960]"
            />
            {option.label}
          </label>
        ))}
      </div>
      <textarea
        value={note}
        onChange={(event) => setNote(event.target.value.slice(0, 500))}
        rows={3}
        placeholder="Anything else we should know? (optional)"
        className="cask-focus mt-3 w-full resize-none rounded-[10px] border border-[#241f19] bg-[#16130f] px-3 py-2 text-sm text-[#F3EDE4] outline-none placeholder:text-[#6f665c] focus:border-[#E0A960]"
      />
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          disabled={sending}
          onClick={submit}
          className="h-9 rounded-full bg-[color:var(--accent-text)] px-4 text-[13px] font-bold text-black transition hover:brightness-110 disabled:opacity-50"
        >
          {sending ? "Sending" : "Send report"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="h-9 px-3 text-[13px] font-bold text-white/50 transition hover:text-white"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
