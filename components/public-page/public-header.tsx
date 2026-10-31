import Link from "next/link";
import { Logo } from "@/components/marketing/logo";
import { site } from "@/lib/site";

// Reads no cookies, so pages using it can be cached and served to everyone. That's
// also why there's one neutral link: /app/shows sends anyone signed out to login.
export function PublicHeader() {
  return (
    <header className="border-b border-white/[0.06]">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-5 py-3.5">
        <Link href="/" aria-label={`${site.displayName} home`}>
          <Logo />
        </Link>
        <nav className="flex items-center gap-5 text-sm font-bold text-white/55">
          <Link href="/about" className="hidden transition hover:text-white sm:inline">About</Link>
          <Link href="/app/shows" className="transition hover:text-white">Open {site.displayName}</Link>
        </nav>
      </div>
    </header>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs font-semibold text-white/40">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => (
          <li key={item.label} className="flex min-w-0 items-center gap-1.5">
            {index > 0 ? <span aria-hidden="true" className="text-white/20">/</span> : null}
            {item.href ? (
              <Link href={item.href} className="transition hover:text-white">{item.label}</Link>
            ) : (
              <span aria-current={index === items.length - 1 ? "page" : undefined} className="truncate text-white/60">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
