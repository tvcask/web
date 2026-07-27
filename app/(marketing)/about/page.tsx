import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight02Icon, Tick02Icon } from '@hugeicons/core-free-icons';
import type { Metadata } from "next";
import Link from "next/link";
import { getToken } from "@/lib/api";
import { MarketingFooter } from "@/components/marketing/footer";
import { MarketingHeader } from "@/components/marketing/header";
import { AppStoreBadge } from "@/components/marketing/app-store-badge";
import { Reveal } from "@/components/marketing/reveal";

export const metadata: Metadata = {
  title: "Why tvcask Exists | tvcask",
  description:
    "tvcask was built by a solo developer and TV Time user to preserve watch history before the July 15, 2026 shutdown.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "Why tvcask Exists | tvcask",
    description:
      "tvcask was built by a solo developer and TV Time user to preserve watch history before the July 15, 2026 shutdown.",
    type: "website",
    url: "/about",
    images: [
      {
        url: "/og-brand.png",
        width: 1200,
        height: 630,
        alt: "tvcask watch history and TV Time import preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Why tvcask Exists | tvcask",
    description:
      "tvcask was built by a solo developer and TV Time user to preserve watch history before the July 15, 2026 shutdown.",
    images: ["/og-brand.png"],
  },
};

const timeline = [
  ["July 15, 2026", "TV Time closes", "Years of watched episodes needed somewhere to go."],
  ["Days later", "tvcask built", "A solo rebuild, starting with the import."],
  ["Then", "Web launch", "Accounts, import, and everyday tracking."],
  ["Today", "iPhone app", "The same library, native, on the App Store."],
  ["Next", "Social", "Feed, profiles, and reactions on a library you already trust."],
];

const proofPoints = [
  "Episode by episode tracking",
  "Favorites and custom lists",
  "Watch next and upcoming",
  "One account on web and iPhone",
];

export default async function AboutPage() {
  const isAuthenticated = Boolean(await getToken());

  return (
    <>
      <MarketingHeader />
      <main className="mx-auto max-w-3xl px-5 pb-16 pt-12 sm:pb-20 sm:pt-16">
        <section>
          <div className="min-w-0">
            <p className="eyebrow" style={{ color: "var(--accent-text)" }}>
              Why tvcask exists
            </p>
            <h1 className="display mt-4 text-4xl leading-[1.05] text-white sm:text-[44px] md:text-[52px]">
              Watch history should not vanish because an app does.
            </h1>

            <div className="mt-7 space-y-5 text-base leading-8 text-white/64 sm:mt-8 sm:text-[17px]">
              <p>
                I am a solo developer, and I used TV Time too. After the
                announcement that TV Time would end on July 15, 2026, I built tvcask
                so people could move their history instead of losing it.
              </p>
              <p>
                That history is more than titles. It is{" "}
                <strong className="font-extrabold text-white">
                  watched episodes, shows, movies, favorites, custom lists, and
                  progress
                </strong>
                . tvcask exists because rebuilding years of tracking by hand
                should not be the only option.
              </p>
              <p>
                The first version is web-first on purpose. A browser was the
                fastest way to ship accounts, ZIP uploads, catalog matching, and
                import progress before building the rest of the product.
              </p>
              <p>
                That foundation held, so the iPhone app followed and is now on the
                App Store. TV Time has since closed for good, and tvcask carries
                on as what it was always meant to be:{" "}
                <strong className="font-extrabold text-white">
                  a dependable place to track what you watch
                </strong>
                .
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={isAuthenticated ? "/app/shows" : "/signup"}
                className="inline-flex h-12 items-center justify-center rounded-full px-6 text-[15px] font-bold"
                style={{
                  background: "var(--accent)",
                  color: "var(--on-accent)",
                }}
              >
                {isAuthenticated ? "Open app" : "Create account"}
                <HugeiconsIcon icon={ArrowRight02Icon} className="ml-2 size-4" />
              </Link>
              <AppStoreBadge />
            </div>
          </div>

        </section>

        <Reveal className="mt-14 grid gap-2.5 sm:grid-cols-2">
          {proofPoints.map((item) => (
            <div
              key={item}
              className="card flex items-center gap-3 rounded-[12px] px-4 py-3"
            >
              <span
                className="grid size-6 shrink-0 place-items-center rounded-full"
                style={{
                  background: "var(--accent)",
                  color: "var(--on-accent)",
                }}
              >
                <HugeiconsIcon icon={Tick02Icon} className="size-3.5" />
              </span>
              <span className="text-sm font-bold text-white/80">{item}</span>
            </div>
          ))}
        </Reveal>

        <Reveal className="mt-16 sm:mt-20">
          <p className="eyebrow" style={{ color: "var(--accent-text)" }}>
            How we got here
          </p>
          <h2 className="display mt-2 text-2xl text-white sm:text-3xl">
            From shutdown to a new home.
          </h2>
          <ol className="mt-6 space-y-0">
            {timeline.map(([when, title, copy]) => (
              <li
                key={title}
                className="grid gap-1 border-t border-white/[0.07] py-5 sm:grid-cols-[140px_minmax(0,1fr)] sm:gap-6"
              >
                <p className="eyebrow pt-0.5" style={{ color: "var(--accent-text)" }}>
                  {when}
                </p>
                <div>
                  <p className="display text-lg text-white">{title}</p>
                  <p className="mt-1 text-sm leading-6 text-white/60">{copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </main>
      <MarketingFooter />
    </>
  );
}
