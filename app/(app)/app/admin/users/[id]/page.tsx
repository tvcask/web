import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons';
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminUser, type AdminUserDetail } from "@/lib/admin";
import { ApiError } from "@/lib/api";

export const metadata: Metadata = { title: "User | Admin | tvcask" };

export default async function AdminUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let user: AdminUserDetail;
  try {
    user = await getAdminUser(id);
  } catch (error) {
    if (error instanceof ApiError && (error.status === 403 || error.status === 404)) notFound();
    throw error;
  }

  const stats = [
    { label: "Tracked titles", value: user.trackedTitles },
    { label: "Watched episodes", value: user.watchedEpisodes },
    { label: "Favorites", value: user.favorites },
    { label: "Lists", value: user.lists },
    { label: "Completed imports", value: user.completedImports },
    { label: "Failed imports", value: user.failedImports }
  ];

  return (
    <div className="mx-auto max-w-[900px] space-y-8">
      <div>
        <Link href="/app/admin/users" className="inline-flex items-center gap-1 text-sm font-semibold text-white/60 hover:text-white"><HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" /> Users</Link>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="display text-2xl text-white">{user.name || "Unnamed user"}</h1>
            <p className="mt-2 text-sm text-white/55">{user.email}</p>
            {user.username ? <p className="mt-1 text-xs font-semibold text-white/35">@{user.username}</p> : null}
          </div>
          <span className={`w-fit rounded-full px-3 py-1.5 text-xs font-bold ${user.emailVerified ? "bg-[rgba(224,169,96,0.12)] text-[color:var(--accent-text)]" : "bg-white/[0.06] text-white/45"}`}>{user.emailVerified ? "Verified" : "Unverified"}</span>
        </div>
      </div>

      <section className="surface rounded-[16px] px-5 py-4">
        <dl className="grid gap-5 sm:grid-cols-2">
          <Info label="Joined" value={formatDateTime(user.createdAt)} />
          <Info label="Internal user ID" value={user.id} mono />
        </dl>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-extrabold text-white">Account summary</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {stats.map((stat) => <div key={stat.label} className="surface rounded-[14px] px-5 py-4"><p className="eyebrow">{stat.label}</p><p className="display mt-2 text-[22px] text-white">{stat.value.toLocaleString()}</p></div>)}
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-base font-extrabold text-white">Recent imports</h2>
          <p className="mt-1 text-xs text-white/35">Import summaries only. Uploaded files and watch history are not exposed here.</p>
        </div>
        <div className="surface overflow-x-auto rounded-[16px]">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="border-b border-white/[0.07] text-[11px] font-extrabold uppercase tracking-[0.12em] text-white/35"><tr><th className="px-5 py-4">Date</th><th className="px-4 py-4">Status</th><th className="px-4 py-4">Titles</th><th className="px-4 py-4">Matched</th><th className="px-4 py-4">Episodes</th><th className="px-4 py-4">Lists</th></tr></thead>
            <tbody className="divide-y divide-white/[0.06]">
              {user.recentImports.map((item, index) => <tr key={`${item.createdAt}-${index}`}><td className="px-5 py-4 text-white/55">{formatDateTime(item.createdAt)}</td><td className="px-4 py-4 font-bold capitalize text-white/75">{item.status}</td><td className="px-4 py-4 text-white/60">{item.totalTitles}</td><td className="px-4 py-4 text-white/60">{item.matchedTitles}</td><td className="px-4 py-4 text-white/60">{item.watchedEpisodes}</td><td className="px-4 py-4 text-white/60">{item.importedLists}</td></tr>)}
              {user.recentImports.length === 0 ? <tr><td colSpan={6} className="px-5 py-10 text-center text-white/40">No imports.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Info({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return <div><dt className="eyebrow">{label}</dt><dd className={`mt-2 break-all text-sm text-white/70 ${mono ? "font-mono text-xs" : "font-semibold"}`}>{value}</dd></div>;
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}
