import Link from "next/link";
import { Logo } from "@/components/marketing/logo";
import { Button } from "@/components/ui/button";
import { getToken } from "@/lib/api";

// Shared shell for the legal pages (privacy, terms, guidelines) so they read as
// one set and match the marketing look.
export async function LegalPage({
  title,
  updated,
  intro,
  children
}: {
  title: string;
  updated: string;
  intro: string;
  children: React.ReactNode;
}) {
  const isAuthenticated = Boolean(await getToken());

  return (
    <>
      <header className="border-b border-white/[0.06]">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-5 py-5">
          <Link href="/" aria-label="tvcask home">
            <Logo />
          </Link>
          {isAuthenticated ? (
            <Button asChild className="h-10 px-4 text-sm">
              <Link href="/app/shows">Open app</Link>
            </Button>
          ) : (
            <Link href="/" className="text-sm font-bold text-white/55 transition hover:text-white">
              Back to tvcask
            </Link>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-5 pb-24 pt-12 sm:pt-16">
        <p className="eyebrow" style={{ color: "var(--accent-text)" }}>
          Legal
        </p>
        <h1 className="display mt-3 text-3xl leading-tight text-white sm:text-4xl">{title}</h1>
        <p className="mt-3 text-sm font-semibold text-white/40">Last updated {updated}</p>
        <p className="mt-6 text-[15px] leading-7 text-white/60">{intro}</p>
        <div className="mt-10 space-y-10">{children}</div>
      </main>
      <footer className="border-t border-white/[0.06]">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-5 py-7 text-xs font-semibold text-white/35">
          <p>Copyright {new Date().getFullYear()} tvcask.</p>
          <Link href={isAuthenticated ? "/app/shows" : "/"} className="transition hover:text-white">
            {isAuthenticated ? "Open app" : "Back to tvcask"}
          </Link>
        </div>
      </footer>
    </>
  );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-white">{title}</h2>
      <div className="mt-3 space-y-4 text-[15px] leading-7 text-white/65">{children}</div>
    </section>
  );
}

export function LegalList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-[color:var(--accent-text)]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

// A single place to change the contact address across all legal pages.
export const LEGAL_CONTACT = "tvcask@protonmail.com";
