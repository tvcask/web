export function DrawerSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="relative h-[280px] px-6 pt-6 sm:px-8">
        <div className="absolute inset-0 bg-white/[0.04]" />
        <div className="relative flex h-full items-end gap-4">
          <div className="h-[168px] w-[112px] shrink-0 rounded-[14px] bg-white/[0.07]" />
          <div className="pb-2">
            <div className="h-8 w-52 rounded-md bg-white/[0.09]" />
            <div className="mt-3 h-4 w-32 rounded bg-white/[0.05]" />
          </div>
        </div>
      </div>
      <div className="space-y-5 px-6 pb-10 pt-5 sm:px-8">
        <div className="h-[52px] w-full rounded-full bg-white/[0.06]" />
        <div className="h-16 rounded-[14px] bg-white/[0.04]" />
        <div className="space-y-2">
          <div className="h-4 w-24 rounded bg-white/[0.08]" />
          <div className="h-4 w-full rounded bg-white/[0.04]" />
          <div className="h-4 w-3/4 rounded bg-white/[0.04]" />
        </div>
        <div className="space-y-2.5 pt-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 rounded-[8px] bg-white/[0.04]" />
          ))}
        </div>
      </div>
    </div>
  );
}
