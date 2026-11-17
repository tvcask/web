import type { Metadata } from "next";
import Link from "next/link";

import { MarketingFooter } from "@/components/marketing/footer";
import { PublicHeader } from "@/components/public-page/public-header";
import { WhereToWatchPage } from "@/components/titles/where-to-watch-page";
import { getPublicTitleDetail } from "@/lib/data";
import { publicTitlePath } from "@/lib/public-urls";
import { site } from "@/lib/site";

type Params = { params: Promise<{ id: string }> };

export const revalidate = 3600;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const detail = await getPublicTitleDetail(id).catch(() => null);
  if (!detail) return { title: `Not found | ${site.displayName}`, robots: { index: false } };
  // It's a utility view of the title page, so the title page keeps the ranking.
  return {
    title: `Where to watch ${detail.title} | ${site.displayName}`,
    alternates: { canonical: publicTitlePath(detail) },
    robots: { index: false }
  };
}

export default async function PublicWatchPage({ params }: Params) {
  const { id } = await params;
  const detail = await getPublicTitleDetail(id).catch(() => null);
  const backHref = detail ? publicTitlePath(detail) : "/";
  return (
    <>
      <PublicHeader />
      <main className="mx-auto w-full max-w-2xl px-5 pb-16 pt-5 sm:pb-20">
        <Link href={backHref} className="cask-focus mb-4 inline-flex min-h-11 items-center rounded-full text-sm font-bold text-white/70 hover:text-white">
          ‹ Back to title
        </Link>
        <section className="rounded-[22px] border border-white/[0.08] bg-[#0a0a0c] p-5 sm:p-7">
          <WhereToWatchPage id={id} signedIn={false} />
        </section>
      </main>
      <MarketingFooter />
    </>
  );
}
