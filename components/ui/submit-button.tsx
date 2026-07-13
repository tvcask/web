"use client";

import { HugeiconsIcon } from '@hugeicons/react';
import { Loading03Icon } from '@hugeicons/core-free-icons';

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

// Server-action submit button that shows a pending state while the action runs.
// Plain <button>s in server-action forms give no feedback on slow requests, so
// the click looks like it did nothing. Use this instead.
export function SubmitButton({
  children,
  pendingLabel,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { pendingLabel?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={cn("inline-flex items-center justify-center gap-2 transition active:scale-[0.98] disabled:opacity-60", className)}
      {...props}
    >
      {pending ? <HugeiconsIcon icon={Loading03Icon} className="size-4 animate-spin" /> : null}
      {pending && pendingLabel ? pendingLabel : children}
    </button>
  );
}
