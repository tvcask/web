import { ProgressView } from "@/components/badges/progress-view";
import { getBadges } from "@/lib/data";

export default async function ProgressPage() {
  return <ProgressView badges={await getBadges()} backHref="/app/profile" />;
}
