import { WatchSkeleton } from "@/components/titles/watch-skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-[720px] rounded-[18px] border border-white/[0.08] bg-[#0a0a0c] p-5 sm:p-7">
      <WatchSkeleton />
    </div>
  );
}
