"use client";

import type { ButtonHTMLAttributes } from "react";

// Guards a destructive form submit with a native confirm.
export function ConfirmButton({
  message,
  children,
  ...props
}: { message: string } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      onClick={(e) => {
        if (!window.confirm(message)) {
          e.preventDefault();
        }
      }}
    >
      {children}
    </button>
  );
}
