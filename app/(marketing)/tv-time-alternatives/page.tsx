import type { Metadata } from "next";
import Link from "next/link";
import { MarketingFooter } from "@/components/marketing/footer";
import { MarketingHeader } from "@/components/marketing/header";
import { Button } from "@/components/ui/button";

const description =
  "TV Time closed in July 2026. Compare tvcask, Trakt, Simkl, and Serializd on TV Time import, platforms, and price, including where tvcask falls short.";

export const metadata: Metadata = {
  title: "TV Time Alternatives Compared (2026) | tvcask",
  description,
  alternates: { canonical: "/tv-time-alternatives" },
  openGraph: {
    title: "TV Time alternatives compared",
    description,
    type: "article",
    url: "/tv-time-alternatives",
    images: [{ url: "/og-brand.png", width: 1200, height: 630, alt: "tvcask" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TV Time alternatives compared",
    description,
    images: ["/og-brand.png"],
  },
};

const apps = [
  {
    name: "tvcask",
    bestFor: "Moving a TV Time export, including TV Time Out files",
    tvTime: "GDPR ZIP or TV Time Out ZIP",
    platforms: "Web, iPhone",
    price: "No paid plans today",
  },
  {
    name: "Trakt",
    bestFor: "Syncing with media players and other apps",
    tvTime: "GDPR ZIP",
    platforms: "Web, iPhone, Android",
    price: "Free tier with limits, paid VIP",
  },
  {
    name: "Simkl",
    bestFor: "Anime alongside TV and movies",
    tvTime: "GDPR ZIP and its password",
    platforms: "Web, iPhone, Android",
    price: "Free tier, paid plans",
  },
  {
    name: "Serializd",
    bestFor: "TV reviews and a social diary",
    tvTime: "Supported, see its site for the steps",
    platforms: "Web, iPhone, Android",
    price: "Free",
  },
];

const picks = [
  {
    name: "tvcask",
    copy: "Made for this move. It reads shows, movies, watched episodes, favorites, and custom lists from your export, and it also takes ZIP files from the TV Time Out extension. It is new and built by one developer. There is no Android app, no automatic tracking from media players, and no import from other trackers yet.",
  },
  {
    name: "Trakt",
    copy: "The established choice if you want your tracking connected to everything else. Media center and third-party app support is its main strength. Free accounts have limits on items such as watchlists and lists, so check them against the size of your library.",
    href: "https://trakt.tv",
  },
  {
    name: "Simkl",
    copy: "A good fit if you follow anime as well, because it has anime-specific data and calendars. It also connects to Plex, Kodi, and Jellyfin. Its TV Time guide describes importing series watch history, so check how it handles movies and lists if those matter to you.",
    href: "https://simkl.com",
  },
  {
    name: "Serializd",
    copy: "Closest to Letterboxd for TV. Pick it if reviews and following other people matter more than a detailed library. It focuses on TV, so it may not suit you if you track a lot of movies.",
    href: "https://www.serializd.com",
  },
];

const faqs = [
  {
    q: "Can I still export my data from TV Time?",
    a: "No. TV Time closed on July 15, 2026, and tvcask's import relies on an export you downloaded before then. Without a saved export, you will need to rebuild your library by hand.",
  },
  {
    q: "Which TV Time alternative is the best?",
    a: "It depends on what you need. To bring your TV Time favorites and custom lists with your history, try tvcask. On Android or with a media center, Trakt or Simkl will suit you better. For reviews and a social feed, try Serializd.",
  },
  {
    q: "Which alternatives work on Android?",
    a: "Trakt, Simkl, and Serializd list Android apps. tvcask works in an Android browser, but it has no Android app.",
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

export default function TvTimeAlternativesPage() {
  return (
    <>
      <MarketingHeader />
      <main className="mx-auto max-w-3xl px-5 pb-20 pt-12 sm:pt-16">
        <h1 className="display text-4xl leading-[1.05] text-white sm:text-5xl">TV Time alternatives compared</h1>
        <p className="mt-5 text-lg leading-8 text-white/60">
          TV Time closed on July 15, 2026. These four trackers can take your saved export. We make tvcask, so we have
          listed where it falls short too.
        </p>
        <p className="mt-3 text-sm text-white/45">Last checked October 31, 2026. Other apps change, so confirm details on their sites.</p>

        <div className="surface mt-8 overflow-x-auto rounded-[16px]">
          <table className="w-full min-w-[620px] text-left text-sm leading-6">
            <thead className="text-white">
              <tr className="border-b border-white/[0.08]">
                <th scope="col" className="p-4 font-bold">App</th>
                <th scope="col" className="p-4 font-bold">Best for</th>
                <th scope="col" className="p-4 font-bold">TV Time import</th>
                <th scope="col" className="p-4 font-bold">Platforms</th>
                <th scope="col" className="p-4 font-bold">Price</th>
              </tr>
            </thead>
            <tbody className="text-white/60">
              {apps.map((app) => (
                <tr key={app.name} className="border-b border-white/[0.06] last:border-0">
                  <th scope="row" className="p-4 font-bold text-white">{app.name}</th>
                  <td className="p-4">{app.bestFor}</td>
                  <td className="p-4">{app.tvTime}</td>
                  <td className="p-4">{app.platforms}</td>
                  <td className="p-4">{app.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <section className="mt-12">
          <h2 className="display text-3xl text-white">How to choose</h2>
          <div className="mt-6 space-y-7">
            {picks.map((pick) => (
              <div key={pick.name}>
                <h3 className="display text-xl text-white">
                  {pick.href ? (
                    <a href={pick.href} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">
                      {pick.name}
                    </a>
                  ) : (
                    pick.name
                  )}
                </h3>
                <p className="mt-2 leading-7 text-white/60">{pick.copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="display text-3xl text-white">Questions</h2>
          <div className="mt-6 space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q}>
                <h3 className="font-bold text-white">{faq.q}</h3>
                <p className="mt-2 leading-7 text-white/60">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <Button asChild className="h-12 px-6 text-[15px]">
            <Link href="/import-tv-time">See how the tvcask import works</Link>
          </Button>
        </div>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }} />
      </main>
      <MarketingFooter />
    </>
  );
}
