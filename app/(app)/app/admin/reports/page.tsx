import Link from "next/link";
import { getAdminReports } from "@/lib/admin";

export const metadata = { title: "Reports" };

function since(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  return `${days} days ago`;
}

export default async function AdminReportsPage({
  searchParams
}: {
  searchParams: Promise<{ resolved?: string }>;
}) {
  const { resolved } = await searchParams;
  const showResolved = resolved === "true";
  const reports = await getAdminReports(showResolved);

  return (
    <div className="mx-auto max-w-[1100px] space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="display text-2xl text-white">Reports</h1>
        <div className="ml-auto flex items-center gap-1 rounded-full bg-white/[0.05] p-1">
          <Tab href="/app/admin/reports" label="Open" active={!showResolved} />
          <Tab href="/app/admin/reports?resolved=true" label="Resolved" active={showResolved} />
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="surface rounded-[16px] p-10 text-center">
          <p className="text-sm text-white/50">
            {showResolved ? "Nothing resolved yet." : "No open reports."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <Link
              key={report.id}
              href={`/app/admin/users/${report.subjectId}`}
              className="surface flex flex-wrap items-center gap-4 rounded-[14px] p-4 transition hover:bg-white/[0.04]"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-sm font-bold text-white">
                    {report.subjectName || report.subjectUsername}
                  </p>
                  <span className="text-xs font-semibold text-white/35">@{report.subjectUsername}</span>
                  {report.subjectSuspended ? (
                    <span className="rounded-full bg-[#ef6d5a]/15 px-2 py-0.5 text-[11px] font-bold text-[#ef6d5a]">
                      banned
                    </span>
                  ) : null}
                  {/* Repeat reports are the strongest signal in the queue, so
                      they are called out rather than left to be counted. */}
                  {report.subjectOpenReports > 1 ? (
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-bold text-white/70">
                      {report.subjectOpenReports} open
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-sm capitalize text-white/70">{report.reason}</p>
                {report.note ? <p className="mt-0.5 text-sm text-white/45">{report.note}</p> : null}
              </div>
              <p className="shrink-0 text-xs font-semibold text-white/35">{since(report.createdAt)}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Tab({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
        active ? "bg-[color:var(--accent)] text-[color:var(--on-accent)]" : "text-white/50 hover:text-white"
      }`}
    >
      {label}
    </Link>
  );
}
