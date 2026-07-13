import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminUsers, type AdminUserFilters, type AdminUserList } from "@/lib/admin";
import { ApiError } from "@/lib/api";

export const metadata: Metadata = { title: "Users | Admin | tvcask" };

type SearchParams = {
  page?: string;
  verification?: string;
  period?: string;
};

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const filters: AdminUserFilters = {
    page: positivePage(params.page),
    verification: validVerification(params.verification),
    period: validPeriod(params.period)
  };

  let result: AdminUserList;
  try {
    result = await getAdminUsers(filters);
  } catch (error) {
    if (error instanceof ApiError && error.status === 403) notFound();
    throw error;
  }

  return (
    <div className="mx-auto max-w-[1100px] space-y-7">
      <div>
        <Link href="/app/admin" className="inline-flex items-center gap-1 text-sm font-semibold text-white/60 hover:text-white">
          <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" /> Admin
        </Link>
        <div className="mt-5">
          <div>
            <h1 className="display text-2xl text-white">Users</h1>
            <p className="mt-2 text-sm text-white/45">{result.totalUsers.toLocaleString()} accounts match these filters.</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <FilterRow
          label="Verification"
          items={[
            { label: "All", href: filterHref(filters, { verification: "all", page: 1 }), active: !filters.verification || filters.verification === "all" },
            { label: "Verified", href: filterHref(filters, { verification: "verified", page: 1 }), active: filters.verification === "verified" },
            { label: "Unverified", href: filterHref(filters, { verification: "unverified", page: 1 }), active: filters.verification === "unverified" }
          ]}
        />
        <FilterRow
          label="Joined"
          items={[
            { label: "Any time", href: filterHref(filters, { period: undefined, page: 1 }), active: !filters.period },
            { label: "24 hours", href: filterHref(filters, { period: "24h", page: 1 }), active: filters.period === "24h" },
            { label: "7 days", href: filterHref(filters, { period: "7d", page: 1 }), active: filters.period === "7d" },
            { label: "30 days", href: filterHref(filters, { period: "30d", page: 1 }), active: filters.period === "30d" }
          ]}
        />
      </div>

      <div className="surface overflow-x-auto rounded-[16px]">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-white/[0.07] text-[11px] font-extrabold uppercase tracking-[0.12em] text-white/35">
            <tr>
              <th className="px-5 py-4">User</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4">Joined</th>
              <th className="px-4 py-4">Titles</th>
              <th className="px-4 py-4">Latest import</th>
              <th className="w-12 px-4 py-4"><span className="sr-only">View</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {result.users.map((user) => (
              <tr key={user.id} className="transition hover:bg-white/[0.02]">
                <td className="px-5 py-4">
                  <Link href={`/app/admin/users/${user.id}`} className="font-bold text-white hover:text-[color:var(--accent-text)]">{user.name || "Unnamed user"}</Link>
                  <p className="mt-1 text-xs text-white/45">{user.email}</p>
                </td>
                <td className="px-4 py-4"><VerificationBadge verified={user.emailVerified} /></td>
                <td className="px-4 py-4 font-semibold text-white/55">{formatDate(user.createdAt)}</td>
                <td className="px-4 py-4 font-bold text-white/75">{user.trackedTitles.toLocaleString()}</td>
                <td className="px-4 py-4 text-white/55">{user.latestImportStatus ? <><span className="capitalize">{user.latestImportStatus}</span><span className="mt-1 block text-xs text-white/30">{user.latestImportAt ? formatDate(user.latestImportAt) : null}</span></> : "None"}</td>
                <td className="px-4 py-4"><Link href={`/app/admin/users/${user.id}`} aria-label={`View ${user.name || user.email}`} className="grid size-8 place-items-center rounded-full text-white/35 hover:bg-white/5 hover:text-white"><HugeiconsIcon icon={ArrowRight01Icon} className="size-4" /></Link></td>
              </tr>
            ))}
            {result.users.length === 0 ? <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-white/40">No users match these filters.</td></tr> : null}
          </tbody>
        </table>
      </div>

      {result.totalPages > 1 ? (
        <nav className="flex items-center justify-between text-sm font-bold" aria-label="User pages">
          {result.page > 1 ? <Link href={filterHref(filters, { page: result.page - 1 })} className="rounded-full border border-white/12 px-4 py-2 text-white/70 hover:text-white">Previous</Link> : <span />}
          <span className="text-white/40">Page {result.page} of {result.totalPages}</span>
          {result.page < result.totalPages ? <Link href={filterHref(filters, { page: result.page + 1 })} className="rounded-full border border-white/12 px-4 py-2 text-white/70 hover:text-white">Next</Link> : <span />}
        </nav>
      ) : null}
    </div>
  );
}

function FilterRow({ label, items }: { label: string; items: { label: string; href: string; active: boolean }[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-xs font-bold text-white/35">{label}</span>
      {items.map((item) => <Link key={item.label} href={item.href} className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${item.active ? "bg-[color:var(--accent-text)] text-[#17110b]" : "border border-white/10 text-white/50 hover:text-white"}`}>{item.label}</Link>)}
    </div>
  );
}

function VerificationBadge({ verified }: { verified: boolean }) {
  return <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${verified ? "bg-[rgba(224,169,96,0.12)] text-[color:var(--accent-text)]" : "bg-white/[0.06] text-white/45"}`}>{verified ? "Verified" : "Unverified"}</span>;
}

function filterHref(current: AdminUserFilters, changes: Partial<AdminUserFilters>) {
  const next = { ...current, ...changes };
  const params = new URLSearchParams();
  if (next.page && next.page > 1) params.set("page", String(next.page));
  if (next.verification && next.verification !== "all") params.set("verification", next.verification);
  if (next.period) params.set("period", next.period);
  return `/app/admin/users${params.size ? `?${params}` : ""}`;
}

function positivePage(raw?: string) {
  const value = Number(raw);
  return Number.isInteger(value) && value > 0 ? value : 1;
}

function validVerification(raw?: string): AdminUserFilters["verification"] {
  return raw === "verified" || raw === "unverified" ? raw : "all";
}

function validPeriod(raw?: string): AdminUserFilters["period"] {
  return raw === "24h" || raw === "7d" || raw === "30d" ? raw : undefined;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en", { year: "numeric", month: "short", day: "numeric" });
}
