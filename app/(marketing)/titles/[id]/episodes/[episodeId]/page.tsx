import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { EpisodeDetail } from "@/components/episodes/episode-detail";
import { MarketingFooter } from "@/components/marketing/footer";
import { MarketingHeader } from "@/components/marketing/header";
import { Button } from "@/components/ui/button";
import { getEpisodeDetail } from "@/lib/data";
import { site } from "@/lib/site";

type Params = { params: Promise<{ id: string; episodeId: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id: titleId, episodeId } = await params;
  const detail = await getEpisodeDetail(titleId, episodeId);
  if (!detail) return { title: `Episode not found | ${site.displayName}` };
  const name = detail.episode.name || `Episode ${detail.episode.episodeNumber}`;
  const title = `${name} — ${detail.title.title} | ${site.displayName}`;
  const description = detail.episode.overview?.trim().slice(0, 200) || `Explore ${name} from ${detail.title.title} on ${site.displayName}.`;
  const url = `/titles/${titleId}/episodes/${episodeId}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: "video.episode",
      url,
      siteName: site.displayName,
      images: detail.episode.stillUrl ? [{ url: detail.episode.stillUrl, alt: name }] : undefined
    }
  };
}

export default async function PublicEpisodePage({ params }: Params) {
  const { id: titleId, episodeId } = await params;
  const detail = await getEpisodeDetail(titleId, episodeId);
  if (!detail) notFound();
  return (
    <>
      <MarketingHeader />
      <main className="mx-auto w-full max-w-2xl px-5 pb-16 pt-8 sm:pb-20">
        <section className="overflow-hidden rounded-[22px] border border-white/[0.08] bg-[#0a0a0c]">
          <EpisodeDetail titleId={titleId} episodeId={episodeId} mode="public" />
          <div className="mx-5 mb-7 flex flex-col gap-3 border-t border-white/[0.08] pt-6 sm:mx-8 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1"><p className="display text-lg text-white">Never lose your place</p><p className="mt-1 text-sm text-white/55">Track episodes and see what to watch next.</p></div>
            <Button asChild className="h-11 px-5"><Link href="/signup">Create account</Link></Button>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </>
  );
}
