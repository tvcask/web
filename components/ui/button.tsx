import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ asChild, className, variant = "primary", ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-[#D88945] text-black hover:bg-[#F0A85A] active:scale-[0.98]",
        variant === "secondary" && "border border-[#2b2b2b] bg-[#151515] text-[#F8F3EC] hover:border-[#D88945]/70 active:scale-[0.98]",
        variant === "ghost" && "text-[#F8F3EC] hover:bg-[#151515] active:scale-[0.98]",
        className
      )}
      {...props}
    />
  );
}
