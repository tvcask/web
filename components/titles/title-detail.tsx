import { getMyTitle, getSettings, getTitleDetail } from "@/lib/data";
import { TitleDetailClient } from "@/components/titles/title-detail-client";

export async function TitleDetail({ id }: { id: string }) {
  const [settings, my] = await Promise.all([getSettings(), getMyTitle(id)]);
  const detail = await getTitleDetail(id, settings.watchRegion || "US");
  if (!detail) {
    return <p className="p-10 text-white/60">Title not found.</p>;
  }

  return (
    <TitleDetailClient
      title={detail}
      episodes={detail.episodes ?? []}
      initial={{
        tracked: my.tracked,
        status: my.userTitle?.status ?? "",
        favorite: Boolean(my.userTitle?.favorite),
        watched: my.watched
      }}
    />
  );
}
