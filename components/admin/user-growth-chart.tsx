import type { AdminUserGrowthPoint } from "@/lib/admin";

const width = 760;
const height = 240;
const padding = { top: 22, right: 18, bottom: 38, left: 48 };

export function UserGrowthChart({ data }: { data: AdminUserGrowthPoint[] }) {
  if (data.length === 0) return null;

  const totals = data.map((point) => point.totalUsers);
  const latest = data.at(-1)?.totalUsers ?? 0;
  const beforeWindow = Math.max(0, data[0].totalUsers - data[0].newUsers);
  const gained = latest - beforeWindow;
  const lowest = Math.min(beforeWindow, ...totals);
  const chartMin = Math.max(0, lowest - Math.max(1, Math.ceil(gained * 0.1)));
  const chartMax = Math.max(chartMin + 1, ...totals);
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const points = data.map((point, index) => {
    const x = padding.left + (index / Math.max(1, data.length - 1)) * plotWidth;
    const y = padding.top + ((chartMax - point.totalUsers) / (chartMax - chartMin)) * plotHeight;
    return { ...point, x, y };
  });
  const line = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ");
  const baseline = height - padding.bottom;
  const area = `${line} L${points.at(-1)!.x.toFixed(1)},${baseline} L${points[0].x.toFixed(1)},${baseline} Z`;
  const labelIndexes = [0, Math.floor((data.length - 1) / 2), data.length - 1];

  return (
    <section className="surface rounded-[16px] px-4 py-5 sm:px-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-base font-extrabold text-white">User growth</h2>
          <p className="mt-1 text-xs font-semibold text-white/40">Last 30 days</p>
        </div>
        <p className="text-sm font-extrabold text-[color:var(--accent-text)]">+{gained.toLocaleString()}</p>
      </div>

      <svg className="mt-4 h-auto w-full" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`User accounts grew by ${gained} to ${latest} over the last 30 days`}>
        <defs>
          <linearGradient id="admin-user-growth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent-text)" stopOpacity="0.24" />
            <stop offset="100%" stopColor="var(--accent-text)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1={padding.left} x2={width - padding.right} y1={padding.top} y2={padding.top} stroke="rgba(255,255,255,0.07)" />
        <line x1={padding.left} x2={width - padding.right} y1={baseline} y2={baseline} stroke="rgba(255,255,255,0.09)" />
        <text x={padding.left - 10} y={padding.top + 4} textAnchor="end" fill="rgba(255,255,255,0.35)" fontSize="12">{chartMax}</text>
        <text x={padding.left - 10} y={baseline + 4} textAnchor="end" fill="rgba(255,255,255,0.35)" fontSize="12">{chartMin}</text>
        <path d={area} fill="url(#admin-user-growth)" />
        <path d={line} fill="none" stroke="var(--accent-text)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((point) => (
          <circle key={point.date} cx={point.x} cy={point.y} r="3.5" fill="#0d0c0b" stroke="var(--accent-text)" strokeWidth="2">
            <title>{`${formatChartDate(point.date)}: ${point.totalUsers} users, ${point.newUsers} new`}</title>
          </circle>
        ))}
        {labelIndexes.map((index) => {
          const point = points[index];
          return <text key={point.date} x={point.x} y={height - 12} textAnchor={index === 0 ? "start" : index === data.length - 1 ? "end" : "middle"} fill="rgba(255,255,255,0.35)" fontSize="12">{formatChartDate(point.date)}</text>;
        })}
      </svg>
    </section>
  );
}

function formatChartDate(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en", { month: "short", day: "numeric", timeZone: "UTC" });
}
