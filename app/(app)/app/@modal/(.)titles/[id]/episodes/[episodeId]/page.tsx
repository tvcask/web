import { EpisodeDetail } from "@/components/episodes/episode-detail";

export default async function EpisodeModal({
  params,
  searchParams
}: {
  params: Promise<{ id: string; episodeId: string }>;
  searchParams: Promise<{ fromTitle?: string; returnTo?: string }>;
}) {
  const { id, episodeId } = await params;
  const query = await searchParams;
  return (
    <EpisodeDetail
      titleId={id}
      episodeId={episodeId}
      mode="app"
      fromTitle={query.fromTitle === "1"}
      returnTo={query.returnTo}
    />
  );
}
