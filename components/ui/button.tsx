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
        "cask-focus inline-flex h-10 items-center justify-center gap-2 rounded-full px-4 text-[13.5px] font-bold transition active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" && "accent-fill hover:brightness-110",
        variant === "secondary" && "border border-white/12 bg-transparent text-white hover:bg-white/5",
        variant === "ghost" && "text-white/70 hover:bg-white/5 hover:text-white",
        className
      )}
      {...props}
    />
  );
}
