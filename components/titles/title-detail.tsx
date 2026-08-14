import { getMyTitle, getRelatedTitles, getSettings, getTitleDetail } from "@/lib/data";
import { TitleDetailClient } from "@/components/titles/title-detail-client";

export async function TitleDetail({ id }: { id: string }) {
  const [settings, my] = await Promise.all([getSettings(), getMyTitle(id)]);
  const [detail, related] = await Promise.all([
    getTitleDetail(id, settings.watchRegion || "US"),
    getRelatedTitles(id)
  ]);
  if (!detail) {
    return <p className="p-10 text-white/60">Title not found.</p>;
  }

  return (
    <TitleDetailClient
      title={detail}
      episodes={detail.episodes ?? []}
      related={related}
      initial={{
        tracked: my.tracked,
        status: my.userTitle?.status ?? "",
        favorite: Boolean(my.userTitle?.favorite),
        watched: my.watched,
        rating: my.userTitle?.rating ?? null
      }}
    />
  );
}
