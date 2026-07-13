"use client";

import { HugeiconsIcon } from '@hugeicons/react';
import { ViewIcon, ViewOffSlashIcon } from '@hugeicons/core-free-icons';

import { useState, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type PasswordInputProps = InputHTMLAttributes<HTMLInputElement> & {
  inputClassName?: string;
};

export function PasswordInput({ className, inputClassName, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={cn("relative", className)}>
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={cn(
          "cask-focus h-11 w-full rounded-full border border-[#241f19] bg-[#16130f] px-4 pr-11 text-sm text-[#F3EDE4] outline-none transition placeholder:text-[#6f665c] focus:border-[#E0A960]",
          inputClassName
        )}
      />
      <button
        type="button"
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        onClick={() => setVisible((value) => !value)}
        className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-white/45 transition hover:bg-white/[0.06] hover:text-white"
      >
        {visible ? <HugeiconsIcon icon={ViewOffSlashIcon} className="size-4" /> : <HugeiconsIcon icon={ViewIcon} className="size-4" />}
      </button>
    </div>
  );
}
