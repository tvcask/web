import { ogCard, ogSize } from "@/components/public-page/og-card";
import { getPublicList } from "@/lib/public-page";
import { site } from "@/lib/site";

export const size = ogSize;
export const contentType = "image/png";
export const alt = `A shared list on ${site.displayName}`;

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const list = await getPublicList(id);
  if (!list) return ogCard({ heading: site.displayName, subheading: site.tagline, posters: [] });
  return ogCard({
    heading: list.name,
    subheading: `by ${list.owner.name}`,
    posters: list.titles.map((title) => title.posterUrl ?? "").filter(Boolean)
  });
}
