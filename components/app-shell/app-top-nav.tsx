"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";
import { AccountMenu } from "@/components/app-shell/account-menu";
import { isNavActive, navItems } from "@/components/app-shell/nav-items";
import { Logo } from "@/components/marketing/logo";
import { cn } from "@/lib/utils";

export function AppTopNav({ user }: { user: { name?: string | null; email?: string | null } }) {
  const pathname = usePathname();
  const displayName = user.name || user.email?.split("@")[0] || "you";

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-white/[0.06] bg-[#0c0c0f]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-[1360px] items-center gap-6 px-5 sm:px-6">
        <Link href="/app/shows" aria-label="tvcask home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1.5 lg:flex">
          {navItems.map((item) => {
            const active = isNavActive(pathname, item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-[13.5px] font-bold transition",
                  active ? "accent-fill" : "text-white/70 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3.5">
          <form action="/app/explore" className="hidden items-center rounded-[11px] bg-white/5 md:flex">
            <Search className="ml-3.5 size-4 text-white/40" />
            <input
              name="q"
              aria-label="Search shows and movies"
              placeholder="Search"
              className="h-[38px] w-[150px] rounded-[11px] bg-transparent px-3 text-[13px] text-white outline-none placeholder:text-white/40 xl:w-[190px]"
            />
          </form>
          <Link href="/app/explore" aria-label="Search" className="text-white/60 md:hidden">
            <Search className="size-5" />
          </Link>
          <Bell className="hidden size-[19px] text-white/60 sm:block" />
          <AccountMenu name={displayName} email={user.email} />
        </div>
      </div>
    </header>
  );
}
