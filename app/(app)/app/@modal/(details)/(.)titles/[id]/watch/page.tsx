import { DetailDrawerSpacer } from "@/components/ui/detail-drawer";
import { WhereToWatchPage } from "@/components/titles/where-to-watch-page";

export default async function WatchModal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="px-6 pb-10 pt-4 sm:px-8">
      <DetailDrawerSpacer />
      <WhereToWatchPage id={id} signedIn />
    </div>
  );
}
