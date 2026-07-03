"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, CalendarDays, Clapperboard, FileUp, Search, Settings, Sparkles, UserCircle } from "lucide-react";
import { Logo } from "@/components/marketing/logo";
import { cn } from "@/lib/utils";

const links = [
  { href: "/app/my-list", label: "My List", icon: Clapperboard },
  { href: "/app/search", label: "Explore", icon: Search },
  { href: "/app/import", label: "Import", icon: FileUp },
  { href: "/app/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/app/stats", label: "Stats", icon: Sparkles }
];

export function AppTopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-[#1f1f1f] bg-black/88 px-5 py-3 backdrop-blur-xl sm:px-8">
      <div className="flex items-center gap-4">
        <Link href="/app/my-list" className="shrink-0">
          <Logo />
        </Link>

        <form action="/app/search" className="relative hidden min-w-0 flex-1 md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#777]" />
          <input
            name="q"
            aria-label="Search titles"
            placeholder="Search shows, movies, anime..."
            className="h-10 w-full rounded-full border border-[#262626] bg-[#080808] pl-9 pr-3 text-sm outline-none transition placeholder:text-[#707070] focus:border-[#D88945]"
          />
        </form>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex h-10 items-center gap-2 rounded-full px-3 text-sm font-bold text-[#969696] transition hover:bg-[#151515] hover:text-white",
                  active && "bg-[#D88945] text-black hover:bg-[#D88945] hover:text-black"
                )}
              >
                <link.icon className="size-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/app/search"
            className="grid size-10 place-items-center rounded-full border border-[#262626] bg-[#080808] text-[#A79B8E] transition hover:border-[#D88945] hover:text-white md:hidden"
            aria-label="Search"
          >
            <Search className="size-4" />
          </Link>
          <button className="grid size-10 place-items-center rounded-full border border-[#262626] bg-[#080808] text-[#A79B8E] transition hover:border-[#D88945] hover:text-white" aria-label="Notifications">
            <Bell className="size-4" />
          </button>
          <Link
            href="/app/settings"
            className={cn(
              "grid size-10 place-items-center rounded-full bg-[#181818] text-[#D88945] transition hover:bg-[#252525]",
              pathname.startsWith("/app/settings") && "bg-[#D88945] text-black"
            )}
            aria-label="Profile"
          >
            <UserCircle className="size-6" />
          </Link>
        </div>
      </div>

      <nav className="app-scrollbar mt-3 flex gap-2 overflow-x-auto lg:hidden">
        {links.map((link) => {
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex h-9 shrink-0 items-center gap-2 rounded-full border border-[#262626] px-3 text-xs font-bold text-[#969696] transition",
                active && "border-[#D88945] bg-[#D88945] text-black"
              )}
            >
              <link.icon className="size-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
