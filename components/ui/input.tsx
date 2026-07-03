import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-full border border-[#2b2b2b] bg-[#090909] px-4 text-sm text-[#F8F3EC] outline-none transition placeholder:text-[#777] focus:border-[#D88945]",
        className
      )}
      {...props}
    />
  );
}
