import { EpisodeDetailClient } from "@/components/episodes/episode-detail-client";
import { getMyTitle, getPublicTitleDetail, getSettings, getTitleDetail } from "@/lib/data";

export async function EpisodeDetail({
  titleId,
  episodeId,
  mode,
  fromTitle = false,
  returnTo
}: {
  titleId: string;
  episodeId: string;
  mode: "app" | "public";
  fromTitle?: boolean;
  returnTo?: string;
}) {
  if (mode === "public") {
    const title = await getPublicTitleDetail(titleId);
    if (!title) return <p className="p-8 text-white/55">Episode not found.</p>;
    return <EpisodeDetailClient title={title} episodeId={episodeId} mode={mode} />;
  }

  const [settings, mine] = await Promise.all([getSettings(), getMyTitle(titleId)]);
  const title = await getTitleDetail(titleId, settings.watchRegion || "US");
  if (!title) return <p className="p-8 text-white/55">Episode not found.</p>;
  return (
    <EpisodeDetailClient
      title={title}
      episodeId={episodeId}
      mode={mode}
      fromTitle={fromTitle}
      returnTo={returnTo}
      initial={{ tracked: mine.tracked, watched: mine.watched }}
    />
  );
}
