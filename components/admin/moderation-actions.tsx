"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { mutate } from "@/lib/mutate";
import { toast } from "@/lib/toast";
import type { AdminReport } from "@/lib/admin";

/**
 * Ban, unban, and clear reports. A ban is a suspension: the account keeps
 * everything it had, so unbanning restores it whole and a ban applied by
 * mistake costs nothing. That is what makes it safe to reach for.
 */
export function ModerationActions({
  userId,
  suspendedAt,
  reports
}: {
  userId: string;
  suspendedAt?: string;
  reports: AdminReport[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const banned = Boolean(suspendedAt);
  const open = reports.filter((report) => !report.resolvedAt);

  const run = async (path: string, failure: string) => {
    if (busy) return;
    setBusy(true);
    try {
      await mutate(path, "POST");
      router.refresh();
    } catch {
      toast(failure);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="surface space-y-4 rounded-[14px] p-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="display text-lg text-white">Moderation</h2>
          <p className="mt-0.5 text-sm text-white/45">
            {banned
              ? `Banned ${new Date(suspendedAt!).toLocaleDateString()}. Their data is untouched.`
              : open.length > 0
                ? `${open.length} open ${open.length === 1 ? "report" : "reports"}.`
                : "No open reports."}
          </p>
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={() =>
            run(
              `admin/users/${userId}/${banned ? "unban" : "ban"}`,
              banned ? "Could not unban." : "Could not ban."
            )
          }
          className={
            banned
              ? "h-10 shrink-0 rounded-full border border-white/25 px-5 text-sm font-bold text-white transition hover:bg-white/[0.06] disabled:opacity-50"
              : "h-10 shrink-0 rounded-full border border-[#ef6d5a]/40 px-5 text-sm font-bold text-[#ef6d5a] transition hover:bg-[#ef6d5a]/10 disabled:opacity-50"
          }
        >
          {banned ? "Unban" : "Ban account"}
        </button>
      </div>

      {reports.length > 0 ? (
        <ul className="space-y-2 border-t border-white/[0.06] pt-4">
          {reports.map((report) => (
            <li key={report.id} className="flex items-start gap-3 text-sm">
              <div className="min-w-0 flex-1">
                <p className="font-bold text-white">
                  {report.reason}
                  {report.resolvedAt ? <span className="ml-2 text-xs font-semibold text-white/35">resolved</span> : null}
                </p>
                {report.note ? <p className="mt-0.5 text-white/50">{report.note}</p> : null}
                <p className="mt-0.5 text-xs text-white/35">
                  {new Date(report.createdAt).toLocaleString()}
                </p>
              </div>
              {report.resolvedAt ? null : (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => run(`admin/reports/${report.id}/resolve`, "Could not resolve.")}
                  className="shrink-0 text-xs font-bold text-white/50 transition hover:text-white disabled:opacity-50"
                >
                  Resolve
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
