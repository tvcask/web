import type { Metadata } from "next";
import Link from "next/link";
import { MarketingFooter } from "@/components/marketing/footer";
import { MarketingHeader } from "@/components/marketing/header";
import { LEGAL_CONTACT } from "@/components/marketing/legal";

export const metadata: Metadata = {
  title: "Support | tvcask",
  description: "Get help with your tvcask account, watch history, and TV Time import.",
  alternates: { canonical: "/support" },
  openGraph: {
    title: "Support | tvcask",
    description: "Get help with your tvcask account, watch history, and TV Time import.",
    type: "website",
    url: "/support"
  }
};

const help = [
  {
    title: "Import from TV Time",
    copy: "Upload the official TV Time GDPR export ZIP without extracting it. ZIP files created by the TV Time Out Chrome extension work too.",
    href: "/import-tv-time",
    label: "Read the import guide"
  },
  {
    title: "Account access",
    copy: "Use the password reset link on the login screen if you cannot sign in. Check your spam folder if an account email does not arrive.",
    href: "/forgot-password",
    label: "Reset your password"
  },
  {
    title: "Delete your account",
    copy: "Open Settings, choose Security, then Delete account. This permanently removes your account and tvcask data.",
    href: "/privacy",
    label: "Read the privacy policy"
  }
];

export default function SupportPage() {
  return (
    <>
      <MarketingHeader />
      <main className="mx-auto max-w-4xl px-5 pb-20 pt-12 sm:pt-16">
        <p className="eyebrow" style={{ color: "var(--accent-text)" }}>
          Support
        </p>
        <h1 className="display mt-3 text-4xl leading-tight text-white sm:text-5xl">
          How can we help?
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-white/60">
          Find help with your account, watch history, or TV Time import. If the
          answer is not here, email us and we will take a look.
        </p>

        <section className="mt-10 grid gap-3 md:grid-cols-3">
          {help.map((item) => (
            <article key={item.title} className="card flex flex-col rounded-[16px] p-5">
              <h2 className="text-lg font-bold text-white">{item.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-6 text-white/60">{item.copy}</p>
              <Link
                href={item.href}
                className="mt-5 text-sm font-bold text-[color:var(--accent-text)]"
              >
                {item.label}
              </Link>
            </article>
          ))}
        </section>

        <section className="card mt-8 rounded-[16px] p-6 sm:p-8">
          <h2 className="display text-2xl text-white">Contact support</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
            Tell us what happened, which device you were using, and the email
            address on your account. Never send your password. Your TV Time
            export contains personal data, so only share it if support asks for
            it while investigating an import problem.
          </p>
          <a
            href={`mailto:${LEGAL_CONTACT}?subject=tvcask%20support`}
            className="mt-6 inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-bold"
            style={{ background: "var(--accent)", color: "var(--on-accent)" }}
          >
            {LEGAL_CONTACT}
          </a>
        </section>
      </main>
      <MarketingFooter />
    </>
  );
}
