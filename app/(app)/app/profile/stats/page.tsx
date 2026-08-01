import { StatsView } from "@/components/stats/stats-view";
import { getStats } from "@/lib/data";

export default async function StatsPage() {
  return <StatsView stats={await getStats()} backHref="/app/profile" />;
}
