import { MarketingFooter } from "@/components/marketing/footer";
import { MarketingHeader } from "@/components/marketing/header";

// Shared shell for the legal pages (privacy, terms, guidelines) so they read as
// one set and match the marketing look.
export function LegalPage({
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
  return (
    <>
      <MarketingHeader />
      <main className="mx-auto max-w-3xl px-5 pb-24 pt-12 sm:pt-16">
        <p className="eyebrow" style={{ color: "var(--accent-text)" }}>
          Legal
        </p>
        <h1 className="display mt-3 text-3xl leading-tight text-white sm:text-4xl">{title}</h1>
        <p className="mt-3 text-sm font-semibold text-white/40">Last updated {updated}</p>
        <p className="mt-6 text-[15px] leading-7 text-white/60">{intro}</p>
        <div className="mt-10 space-y-10">{children}</div>
      </main>
      <MarketingFooter />
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
