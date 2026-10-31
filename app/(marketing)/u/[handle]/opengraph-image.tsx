import { ogCard, ogSize } from "@/components/public-page/og-card";
import { getPublicProfile } from "@/lib/public-page";
import { site } from "@/lib/site";

export const size = ogSize;
export const contentType = "image/png";
export const alt = `A shared page on ${site.displayName}`;

export default async function Image({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const profile = await getPublicProfile(handle);
  if (!profile) return ogCard({ heading: site.displayName, subheading: site.tagline, posters: [] });
  return ogCard({
    heading: profile.name,
    subheading: `@${profile.username}`,
    posters: profile.lists.flatMap((list) => list.titles.map((title) => title.posterUrl ?? "")).filter(Boolean)
  });
}
