import { WatchSkeleton } from "@/components/titles/watch-skeleton";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-2xl px-5 pt-20">
      <section className="rounded-[22px] border border-white/[0.08] bg-[#0a0a0c] p-5 sm:p-7">
        <WatchSkeleton />
      </section>
    </main>
  );
}
