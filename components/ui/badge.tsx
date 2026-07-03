import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("inline-flex items-center rounded-full border border-[#333] px-2.5 py-1 text-xs font-bold uppercase tracking-normal text-[#B8B8B8]", className)}
      {...props}
    />
  );
}
