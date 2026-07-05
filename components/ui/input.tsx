import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "cask-focus h-11 w-full rounded-full border border-[#241f19] bg-[#16130f] px-4 text-sm text-[#F3EDE4] outline-none transition placeholder:text-[#6f665c] focus:border-[#E0A960]",
        className
      )}
      {...props}
    />
  );
}
