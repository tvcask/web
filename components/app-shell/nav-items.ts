import { Compass, Clapperboard, Tv, User } from "lucide-react";
import type { ComponentType } from "react";

export type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  // Extra path prefixes that should light this tab up as active.
  match?: string[];
};

export const navItems: NavItem[] = [
  { href: "/app/shows", label: "Shows", icon: Tv, match: ["/app", "/app/titles"] },
  { href: "/app/movies", label: "Movies", icon: Clapperboard },
  { href: "/app/explore", label: "Explore", icon: Compass },
  { href: "/app/profile", label: "Profile", icon: User, match: ["/app/settings", "/app/import"] }
];

export function isNavActive(pathname: string, item: NavItem) {
  if (pathname === item.href || pathname.startsWith(`${item.href}/`)) {
    return true;
  }
  return (item.match ?? []).some((prefix) =>
    prefix === "/app" ? pathname === "/app" : pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}
