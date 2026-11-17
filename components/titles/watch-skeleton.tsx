export function WatchSkeleton() {
  return (
    <div>
      <h1 className="display text-2xl text-white sm:text-3xl">Where to watch</h1>
      <div className="mt-2 h-5 w-48 animate-pulse rounded bg-white/[0.06]" />
      <div className="mt-4 h-11 w-full rounded-full border border-[#241f19] bg-[#16130f] opacity-60" />
      <div role="status" aria-busy="true" aria-label="Loading where to watch" className="mt-5 animate-pulse space-y-5">
        {[0, 1, 2].map((i) => (
          <div key={i}>
            <div className="h-5 w-40 rounded bg-white/[0.09]" />
            <div className="mt-3 flex gap-2">
              {[0, 1, 2].map((j) => (
                <div key={j} className="h-9 w-24 rounded-full bg-white/[0.04]" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
