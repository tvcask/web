import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";

import { EpisodeDetail } from "@/components/episodes/episode-detail";

export default async function EpisodePage({
  params,
  searchParams
}: {
  params: Promise<{ id: string; episodeId: string }>;
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const { id: titleId, episodeId } = await params;
  const { returnTo } = await searchParams;
  const showHref = `/app/titles/${titleId}${returnTo?.startsWith("/app/") ? `?returnTo=${encodeURIComponent(returnTo)}` : ""}`;
  return (
    <div className="mx-auto max-w-[640px]">
      <Link href={showHref} className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-sm font-bold text-white/70 transition hover:bg-white/10 hover:text-white">
        <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" /> Back to show
      </Link>
      <div className="overflow-hidden rounded-[18px] border border-white/[0.08] bg-[#0a0a0c]">
        <EpisodeDetail titleId={titleId} episodeId={episodeId} mode="app" returnTo={returnTo} />
      </div>
    </div>
  );
}
