import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";

import { EpisodeDetail } from "@/components/episodes/episode-detail";
import { ReopenInDrawer } from "@/components/ui/reopen-in-drawer";
import { drawerBackdrop } from "@/lib/detail-return";

export default async function EpisodePage({
  params,
  searchParams
}: {
  params: Promise<{ id: string; episodeId: string }>;
  searchParams: Promise<{ returnTo?: string; fromTitle?: string }>;
}) {
  const { id: titleId, episodeId } = await params;
  const { returnTo, fromTitle } = await searchParams;
  const listHref = drawerBackdrop(returnTo);
  if (listHref) {
    const parentHref = fromTitle === "1" ? `/app/titles/${titleId}?returnTo=${encodeURIComponent(listHref)}` : undefined;
    return <ReopenInDrawer listHref={listHref} parentHref={parentHref} />;
  }
  const showHref = `/app/titles/${titleId}${returnTo?.startsWith("/app/") ? `?returnTo=${encodeURIComponent(returnTo)}` : ""}`;
  return (
    <div className="mx-auto max-w-[720px]">
      <Link href={showHref} className="cask-focus mb-3 inline-flex items-center gap-1 rounded-full bg-white/5 py-2 pl-2 pr-3.5 text-sm font-bold text-white/70 transition hover:bg-white/10 hover:text-white">
        <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" /> Back to show
      </Link>
      <div className="overflow-clip rounded-[18px] border border-white/[0.08] bg-[#0a0a0c]">
        <EpisodeDetail titleId={titleId} episodeId={episodeId} mode="app" returnTo={returnTo} />
      </div>
    </div>
  );
}
