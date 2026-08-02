"use client";

import { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { MoreVerticalIcon, Flag02Icon } from "@hugeicons/core-free-icons";
import { mutate } from "@/lib/mutate";
import { toast } from "@/lib/toast";

const REASONS: { value: string; label: string }[] = [
  { value: "harassment", label: "Harassment or bullying" },
  { value: "hate", label: "Hate speech" },
  { value: "impersonation", label: "Impersonation" },
  { value: "spam", label: "Spam" },
  { value: "other", label: "Something else" }
];

/**
 * The overflow on someone else's profile. Reporting lives here rather than in
 * the page body: it is the rarest reason anyone opens a profile, and a standing
 * Report button reads as an accusation waiting to happen.
 */
export function ProfileMenu({ userId, username }: { userId: string; username: string }) {
  const [open, setOpen] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [reason, setReason] = useState(REASONS[0].value);
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  // Close on an outside click or Escape, the two things people expect of a menu.
  useEffect(() => {
    if (!open && !reporting) return;
    const onPointer = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setReporting(false);
      }
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, reporting]);

  const submit = async () => {
    if (sending) return;
    setSending(true);
    try {
      await mutate("me/reports", "POST", { userId, reason, note });
      setReporting(false);
      setNote("");
      toast("Thanks. We'll take a look.");
    } catch {
      toast("Couldn't send that. Try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-label="More options"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="grid size-9 place-items-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
      >
        <HugeiconsIcon icon={MoreVerticalIcon} className="size-[18px]" />
      </button>

      {open ? (
        <div className="absolute right-0 top-11 z-20 w-44 overflow-hidden rounded-[12px] border border-white/[0.08] bg-[#14120f] shadow-xl">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setReporting(true);
            }}
            className="flex w-full items-center gap-2.5 px-4 py-3 text-left text-sm font-semibold text-white/80 transition hover:bg-white/[0.06] hover:text-white"
          >
            <HugeiconsIcon icon={Flag02Icon} className="size-4" />
            Report account
          </button>
        </div>
      ) : null}

      {reporting ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" role="dialog" aria-modal="true">
          <div className="surface w-full max-w-md rounded-[16px] p-5">
            <p className="display text-lg text-white">Report @{username}</p>
            <p className="mt-1 text-sm text-white/45">We review every report. They stay anonymous.</p>

            <div className="mt-4 space-y-2">
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
              className="cask-focus mt-4 w-full resize-none rounded-[10px] border border-[#241f19] bg-[#16130f] px-3 py-2 text-sm text-[#F3EDE4] outline-none placeholder:text-[#6f665c] focus:border-[#E0A960]"
            />

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setReporting(false)}
                className="h-10 px-4 text-sm font-bold text-white/50 transition hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={sending}
                onClick={submit}
                className="h-10 rounded-full bg-[color:var(--accent-text)] px-5 text-sm font-bold text-black transition hover:brightness-110 disabled:opacity-50"
              >
                {sending ? "Sending" : "Send report"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
