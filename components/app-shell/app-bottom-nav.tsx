"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isNavActive, navItems } from "@/components/app-shell/nav-items";
import { cn } from "@/lib/utils";

export function AppBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.06] bg-[#0a0a0c]/95 backdrop-blur-xl lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Primary"
    >
      <div className="mx-auto grid max-w-md grid-cols-4">
        {navItems.map((item) => {
          const active = isNavActive(pathname, item);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition",
                active ? "text-white" : "text-white/45"
              )}
              style={active ? { color: "var(--accent-text)" } : undefined}
            >
              <Icon className="size-[22px]" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
