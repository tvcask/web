import { notFound } from "next/navigation";
import { ProgressView } from "@/components/badges/progress-view";
import { getUserBadges } from "@/lib/social";

type Params = { params: Promise<{ handle: string }> };

export default async function UserProgressPage({ params }: Params) {
  const { handle } = await params;
  const badges = await getUserBadges(handle);
  if (!badges) {
    notFound();
  }
  return <ProgressView badges={badges} backHref={`/app/u/${handle}`} backLabel={`@${handle}`} own={false} />;
}
