import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";
import Link from "next/link";
import { CopyEndpoint } from "@/app/(app)/app/settings/ai/copy-endpoint";
import { MarketingFooter } from "@/components/marketing/footer";
import { MarketingHeader } from "@/components/marketing/header";
import { Button } from "@/components/ui/button";
import { getToken } from "@/lib/api";

const MCP_URL = "https://api.tvcask.com/mcp";
const CHATGPT_DOCS = "https://developers.openai.com/plugins/deploy/connect-chatgpt";
const SETTINGS_HREF = "/app/settings/ai";
const SIGNUP_HREF = `/signup?returnTo=${encodeURIComponent(SETTINGS_HREF)}`;

const description =
  "Connect your tvcask watch history to ChatGPT. Ask what to watch next and let it check your real library, so it stops suggesting shows you've already seen.";

export const metadata: Metadata = {
  title: "Connect Your Watch History to ChatGPT | tvcask",
  description,
  alternates: { canonical: "/ai" },
  openGraph: {
    title: "Connect your watch history to ChatGPT",
    description,
    type: "website",
    url: "/ai",
    images: [{ url: "/og-brand.png", width: 1200, height: 630, alt: "tvcask" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Connect your watch history to ChatGPT",
    description,
    images: ["/og-brand.png"],
  },
};

const prompts = [
  "Recommend three shows based on my tvcask favorites. Check I haven't watched or dropped them, and avoid spoilers.",
  "Use tvcask to show the series I'm watching and where I left off.",
  "What's a good movie for tonight that isn't already in my tvcask library?",
  "Add this show to my tvcask watchlist.",
  "Create a private Weekend dramas list and add the titles we picked.",
  "Mark episodes 1 to 14 of Frankly Speaking watched.",
];

const permissions = [
  {
    label: "Always, once you connect",
    items: ["Your library, status, favorites, and ratings", "Your recorded episode progress", "Your lists", "Catalog search and details"],
  },
  {
    label: "Only if you allow it",
    items: ["Change a title's status", "Mark episodes watched", "Create, edit, and delete your lists"],
  },
  {
    label: "Never",
    items: ["Your password or email address", "Other people's data", "Your account settings"],
  },
];

const faqs = [
  {
    q: "Can ChatGPT see my watch history?",
    a: "Not on its own. Once you connect tvcask and approve access, ChatGPT can read your tvcask library when it needs to answer you. It sees only what you've tracked in tvcask.",
  },
  {
    q: "Will ChatGPT stop recommending shows I've already seen?",
    a: "It gets the tools to check. tvcask can tell your assistant which candidates are finished, in progress, or dropped, based on your whole library. It can only know about what you've tracked, and the final answer still comes from your assistant, so it's worth asking it to check tvcask.",
  },
  {
    q: "Is it read-only?",
    a: "By default, yes. Your assistant can only change your library if you tick Also allow library management when you approve the connection.",
  },
  {
    q: "How do I disconnect it?",
    a: "Go to Settings, then AI connections in tvcask, and select Disconnect. Access stops right away.",
  },
  {
    q: "What happens to my data in ChatGPT?",
    a: "What your assistant reads from tvcask is handled by its provider under its own privacy policy, including whether chats are used for training, so check its settings. tvcask does not sell your data. See our privacy policy for more.",
  },
  {
    q: "Does it work with Claude or other AI assistants?",
    a: "tvcask runs a standard remote MCP server with OAuth, so other clients that support those can try connecting using the same address. Our step-by-step guide covers ChatGPT today.",
  },
  {
    q: "What is MCP?",
    a: "The Model Context Protocol is an open standard that lets AI assistants connect to apps and data. In tvcask's case, it's how your assistant reads your library.",
  },
  {
    q: "Do I need an API key or any coding?",
    a: "No. You paste one address and approve access in tvcask. There's no developer app to create and no config file to edit.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-4 py-6 first:pt-0 last:pb-0">
      <span
        aria-hidden="true"
        className="grid size-9 place-items-center rounded-full bg-white/[0.06] text-sm font-extrabold"
        style={{ color: "var(--accent-text)" }}
      >
        {n}
      </span>
      <div className="min-w-0 pt-1.5">
        <h2 className="font-bold text-white">{title}</h2>
        <div className="mt-2 text-sm leading-6 text-white/60">{children}</div>
      </div>
    </li>
  );
}

export default async function AiPage() {
  const signedIn = Boolean(await getToken());
  return (
    <>
      <MarketingHeader />
      <main className="mx-auto w-full max-w-3xl px-5 pb-16 pt-10 sm:pt-14">
        <h1 className="display text-4xl leading-[1.05] text-white sm:text-5xl">Connect tvcask to ChatGPT</h1>
        <p className="mt-4 max-w-xl text-lg leading-8 text-white/60">
          ChatGPT can then check your real watch history, so it can recommend what to watch next based on what you&apos;ve actually seen.
        </p>

        <ol className="surface mt-8 divide-y divide-white/[0.07] rounded-[18px] p-5 sm:p-7">
          <Step n={1} title={signedIn ? "You're signed in" : "Create your tvcask account"}>
            {signedIn ? (
              <p>
                Your full guide is also in{" "}
                <Link href={SETTINGS_HREF} className="font-bold text-white underline decoration-white/25 underline-offset-4 transition hover:decoration-white">
                  Settings, under AI connections
                </Link>
                .
              </p>
            ) : (
              <>
                <p>
                  ChatGPT reads what you track here, so add a few shows first or{" "}
                  <Link href="/import-tv-time" className="font-bold text-white underline decoration-white/25 underline-offset-4 transition hover:decoration-white">
                    import your TV Time export
                  </Link>
                  .
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-4">
                  <Button asChild className="h-11 px-5">
                    <Link href={SIGNUP_HREF}>Create account</Link>
                  </Button>
                  <Link href={`/login?returnTo=${encodeURIComponent(SETTINGS_HREF)}`} className="font-bold text-white/70 transition hover:text-white">
                    Log in
                  </Link>
                </div>
              </>
            )}
          </Step>
          <Step n={2} title="Add tvcask in ChatGPT">
            <p>
              Open ChatGPT&apos;s Plugins page, select <strong className="text-white/85">+</strong>, then{" "}
              <strong className="text-white/85">Add custom MCP server</strong>. Name it tvcask, paste this address, and choose{" "}
              <strong className="text-white/85">OAuth</strong>.
            </p>
            <div className="mt-3">
              <CopyEndpoint value={MCP_URL} />
            </div>
            <p className="mt-1 text-xs leading-5 text-white/45">
              Custom connections depend on your ChatGPT account and workspace. See{" "}
              <a href={CHATGPT_DOCS} target="_blank" rel="noreferrer" className="underline transition hover:text-white">
                ChatGPT&apos;s instructions
              </a>
              .
            </p>
          </Step>
          <Step n={3} title="Approve access in tvcask">
            <p>
              ChatGPT sends you here to sign in and review permissions. You never paste a password or API key. Tick{" "}
              <strong className="text-white/85">Also allow library management</strong> only if you want it to update your library.
            </p>
          </Step>
          <Step n={4} title="Ask in a new chat">
            <p>Type @, select tvcask, then try:</p>
            <p className="mt-2 rounded-[12px] bg-white/[0.05] px-4 py-3 text-white/85">
              What should I watch tonight that I haven&apos;t seen?
            </p>
          </Step>
        </ol>

        <section className="mt-12">
          <h2 className="display text-2xl text-white">Things to ask</h2>
          <ul className="mt-4 space-y-2">
            {prompts.map((prompt) => (
              <li key={prompt} className="rounded-[12px] bg-white/[0.03] px-4 py-3 text-sm leading-6 text-white/75">
                {prompt}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="display text-2xl text-white">What it can do</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-3">
            {permissions.map((group) => (
              <div key={group.label}>
                <h3 className="text-sm font-bold text-white">{group.label}</h3>
                <ul className="mt-2 space-y-1.5 text-sm leading-6 text-white/55">
                  {group.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm text-white/50">
            Disconnect any time in Settings, under AI connections, and access stops right away. Read our{" "}
            <Link href="/privacy" className="font-bold underline transition hover:text-white">privacy policy</Link>.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="display text-2xl text-white">Questions</h2>
          <div className="mt-2 divide-y divide-white/[0.07]">
            {faqs.map((faq) => (
              <details key={faq.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-white/85 transition hover:text-white [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <HugeiconsIcon icon={ArrowDown01Icon} className="size-4 shrink-0 text-white/35 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }} />
      </main>
      <MarketingFooter />
    </>
  );
}
