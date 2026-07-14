import { Film01Icon, Search01Icon, Tv01Icon, UserIcon } from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";

export type NavItem = {
  href: string;
  label: string;
  icon: IconSvgElement;
  // Extra path prefixes that should light this tab up as active.
  match?: string[];
};

export const navItems: NavItem[] = [
  { href: "/app/shows", label: "Shows", icon: Tv01Icon, match: ["/app", "/app/titles"] },
  { href: "/app/movies", label: "Movies", icon: Film01Icon },
  { href: "/app/explore", label: "Explore", icon: Search01Icon },
  { href: "/app/profile", label: "Profile", icon: UserIcon, match: ["/app/settings", "/app/import"] }
];

export function navContextPath(pathname: string, returnTo?: string | null) {
  if (!pathname.startsWith("/app/titles/") || !returnTo?.startsWith("/app/")) {
    return pathname;
  }

  return returnTo.split(/[?#]/, 1)[0];
}

export function isNavActive(pathname: string, item: NavItem) {
  if (pathname === item.href || pathname.startsWith(`${item.href}/`)) {
    return true;
  }
  return (item.match ?? []).some((prefix) =>
    prefix === "/app" ? pathname === "/app" : pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}
