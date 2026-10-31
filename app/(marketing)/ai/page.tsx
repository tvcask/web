import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  ArrowRight02Icon,
  CheckListIcon,
  LockIcon,
  Search01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import type { Metadata } from "next";
import Link from "next/link";
import { AiConversation } from "@/components/marketing/ai-conversation";
import { MarketingFooter } from "@/components/marketing/footer";
import { MarketingHeader } from "@/components/marketing/header";
import { Button } from "@/components/ui/button";
import { getToken } from "@/lib/api";

const MCP_URL = "https://api.tvcask.com/mcp";
const CHATGPT_DOCS = "https://developers.openai.com/plugins/deploy/connect-chatgpt";
const SETTINGS_HREF = "/app/settings/ai";
const SIGNUP_HREF = `/signup?returnTo=${encodeURIComponent(SETTINGS_HREF)}`;

const title = "Get TV recommendations from ChatGPT based on what you've actually watched";
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

const features = [
  {
    icon: Search01Icon,
    title: "It knows what you've seen",
    copy: "Your assistant can check suggestions against your whole library, not a list you pasted in, so finished and dropped shows can stay out.",
  },
  {
    icon: CheckListIcon,
    title: "It knows where you left off",
    copy: "Ask about your progress and get answers from the episodes you actually marked, with names and air dates.",
  },
  {
    icon: Tick02Icon,
    title: "It can keep things up to date",
    copy: "If you allow it, say you finished an episode or want a new list and your assistant can update tvcask from the chat.",
  },
];

const prompts = [
  "Recommend three shows based on my tvcask favorites. Check I haven't watched or dropped them, and avoid spoilers.",
  "Use tvcask to show the series I'm watching and where I left off.",
  "What's a good movie for tonight that isn't already in my tvcask library?",
  "Add this show to my tvcask watchlist.",
  "Create a private Weekend dramas list and add the titles we picked.",
  "Mark episodes 1 to 14 of Frankly Speaking watched.",
];

const steps = [
  {
    n: "01",
    title: "Start with your library",
    copy: "Sign up and track a few shows, or import your TV Time export. The more it can see, the better the answers.",
  },
  {
    n: "02",
    title: "Add tvcask to ChatGPT",
    copy: "In ChatGPT, add a custom MCP server, paste the address, and choose OAuth. Availability depends on your ChatGPT account and workspace.",
  },
  {
    n: "03",
    title: "Approve access",
    copy: "Sign in to tvcask and review the permissions. You never paste a password or API key into ChatGPT.",
  },
  {
    n: "04",
    title: "Ask in a new chat",
    copy: "Mention tvcask and ask what to watch. Your assistant reads your latest library each time it checks.",
  },
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

export default async function AiPage() {
  // /signup sends anyone signed in to their shows and drops returnTo.
  const connectHref = (await getToken()) ? SETTINGS_HREF : SIGNUP_HREF;
  return (
    <>
      <MarketingHeader />
      <main>
        <section className="hero-glow relative mx-auto grid max-w-6xl items-center gap-10 px-5 pb-14 pt-12 sm:pb-16 sm:pt-14 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-6">
            <span className="eyebrow" style={{ color: "var(--accent-text)" }}>
              tvcask for ChatGPT
            </span>
            <h1 className="display max-w-3xl text-4xl leading-[1.05] text-white sm:text-5xl">{title}</h1>
            <p className="max-w-xl text-lg leading-8 text-white/60">
              ChatGPT doesn&apos;t know what you&apos;ve seen, so it keeps suggesting shows you finished years ago. Connect
              tvcask and it can check your real watch history before it answers.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild className="h-12 px-6 text-[15px]">
                <Link href={connectHref}>
                  Connect your library <HugeiconsIcon icon={ArrowRight02Icon} className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" className="h-12 px-6 text-[15px]">
                <Link href="#setup">See how it works</Link>
              </Button>
            </div>
          </div>

          <AiConversation />
        </section>

        <section className="mx-auto max-w-6xl px-5 py-10">
          <h2 className="display text-2xl text-white sm:text-3xl">Better answers, because it can check</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="surface rounded-[16px] p-5">
                <HugeiconsIcon icon={feature.icon} className="size-5" style={{ color: "var(--accent-text)" }} />
                <h3 className="mt-3 font-bold text-white">{feature.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-white/55">{feature.copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-10">
          <h2 className="display text-2xl text-white sm:text-3xl">Things to ask</h2>
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {prompts.map((prompt) => (
              <li key={prompt} className="rounded-[14px] border-l-2 border-[var(--accent)] bg-white/[0.03] px-4 py-3 text-sm leading-6 text-white/75">
                &ldquo;{prompt}&rdquo;
              </li>
            ))}
          </ul>
        </section>

        <section id="setup" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-10">
          <h2 className="display text-2xl text-white sm:text-3xl">Set it up in a few minutes</h2>
          <ol className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <li key={step.n} className="surface rounded-[16px] p-5">
                <p className="text-xs font-extrabold" style={{ color: "var(--accent-text)" }}>{step.n}</p>
                <h3 className="mt-2 font-bold text-white">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-white/55">{step.copy}</p>
              </li>
            ))}
          </ol>
          <div className="surface mt-3 rounded-[16px] p-5">
            <p className="text-[13px] font-semibold text-white/60">Connection address</p>
            <code className="mt-2 block overflow-x-auto rounded-[10px] bg-black/25 px-3.5 py-2.5 text-sm text-white/90">{MCP_URL}</code>
            <p className="mt-3 text-xs leading-5 text-white/45">
              Once you&apos;re signed in, the full guide is in Settings, under AI connections. See also{" "}
              <a href={CHATGPT_DOCS} target="_blank" rel="noreferrer" className="font-bold underline transition hover:text-white">
                ChatGPT&apos;s connection instructions
              </a>
              .
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-10">
          <div className="flex items-center gap-2.5">
            <HugeiconsIcon icon={LockIcon} className="size-5" style={{ color: "var(--accent-text)" }} />
            <h2 className="display text-2xl text-white sm:text-3xl">You decide what it can do</h2>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {permissions.map((group) => (
              <div key={group.label} className="surface rounded-[16px] p-5">
                <h3 className="font-bold text-white">{group.label}</h3>
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-6 text-white/55 marker:text-white/25">
                  {group.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-white/50">
            Disconnect any time in Settings, under AI connections, and access stops right away. Read our{" "}
            <Link href="/privacy" className="font-bold underline transition hover:text-white">privacy policy</Link>.
          </p>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-10">
          <div className="surface rounded-[16px] p-6">
            <h2 className="display text-xl text-white">Questions</h2>
            <div className="mt-3 divide-y divide-white/[0.07]">
              {faqs.map((faq) => (
                <details key={faq.q} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-white/85 transition hover:text-white [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <HugeiconsIcon icon={ArrowDown01Icon} className="size-4 shrink-0 text-white/35 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-white/55">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-16 pt-6 text-center">
          <h2 className="display text-2xl text-white sm:text-3xl">Ask better questions about what to watch</h2>
          <Button asChild className="mt-5 h-12 px-6 text-[15px]">
            <Link href={connectHref}>
              Connect your library <HugeiconsIcon icon={ArrowRight02Icon} className="size-4" />
            </Link>
          </Button>
          <p className="mt-4 text-sm text-white/45">
            Coming from TV Time?{" "}
            <Link href="/import-tv-time" className="font-bold underline transition hover:text-white">Import your export</Link> first.
          </p>
        </section>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      </main>
      <MarketingFooter />
    </>
  );
}
