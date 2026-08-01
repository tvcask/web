import { notFound } from "next/navigation";
import { StatsView } from "@/components/stats/stats-view";
import { getUserStats } from "@/lib/social";

type Params = { params: Promise<{ handle: string }> };

export default async function UserStatsPage({ params }: Params) {
  const { handle } = await params;
  const stats = await getUserStats(handle);
  if (!stats) {
    notFound();
  }
  return <StatsView stats={stats} backHref={`/app/u/${handle}`} backLabel={`@${handle}`} heading="Stats" owner={false} />;
}
