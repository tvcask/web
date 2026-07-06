// Shown instantly on every navigation into an /app route while the server
// fetches data. Without this boundary the router holds the old page and the
// click feels dead until the (slow) API responds.
export default function AppLoading() {
  return (
    <div className="mx-auto max-w-[1300px] animate-pulse space-y-7">
      <div className="h-[184px] rounded-[18px] bg-white/[0.05]" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 rounded-[14px] bg-white/[0.05]" />
        ))}
      </div>
      <div className="space-y-3">
        <div className="h-5 w-40 rounded bg-white/[0.06]" />
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] w-[100px] shrink-0 rounded-[12px] bg-white/[0.05]" />
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-5 w-40 rounded bg-white/[0.06]" />
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] w-[100px] shrink-0 rounded-[12px] bg-white/[0.05]" />
          ))}
        </div>
      </div>
    </div>
  );
}
