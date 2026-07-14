"use client";

import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon } from '@hugeicons/core-free-icons';

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { AccountMenu } from "@/components/app-shell/account-menu";
import { isNavActive, navContextPath, navItems } from "@/components/app-shell/nav-items";
import { Logo } from "@/components/marketing/logo";
import { SearchBox } from "@/components/titles/search-box";
import { cn } from "@/lib/utils";

export function AppTopNav({ user }: { user: { name?: string | null; email?: string | null; avatarUrl?: string | null } }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const navPathname = navContextPath(pathname, searchParams.get("returnTo"));
  const displayName = user.name || user.email?.split("@")[0] || "you";

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-white/[0.06] bg-[#0c0c0f]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-[1360px] items-center gap-6 px-5 sm:px-6">
        <Link href="/app/shows" aria-label="tvcask home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1.5 lg:flex">
          {navItems.map((item) => {
            const active = isNavActive(navPathname, item);
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
          <div className="hidden md:block">
            <SearchBox size="md" align="right" />
          </div>
          <Link href="/app/explore" aria-label="Search" className="text-white/60 md:hidden">
            <HugeiconsIcon icon={Search01Icon} className="size-5" />
          </Link>
          <AccountMenu name={displayName} email={user.email} avatarUrl={user.avatarUrl} />
        </div>
      </div>
    </header>
  );
}
