import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getAdminStats, type AdminStats } from "@/lib/admin";
import { ApiError } from "@/lib/api";
import { UserGrowthChart } from "@/components/admin/user-growth-chart";

export const metadata: Metadata = {
  title: "Admin | tvcask",
  robots: { index: false, follow: false }
};

export default async function AdminPage() {
  let stats: AdminStats;
  try {
    stats = await getAdminStats();
  } catch (error) {
    if (error instanceof ApiError && error.status === 403) {
      notFound();
    }
    throw error;
  }

  const verificationRate = stats.totalUsers === 0 ? 0 : Math.round((stats.verifiedUsers / stats.totalUsers) * 100);
  const accountTiles = [
    { label: "Total users", value: stats.totalUsers, href: "/app/admin/users" },
    { label: "Verified users", value: stats.verifiedUsers, href: "/app/admin/users?verification=verified" },
    { label: "Unverified users", value: stats.unverifiedUsers, href: "/app/admin/users?verification=unverified" },
    { label: "New in 24 hours", value: stats.newUsers24Hours, href: "/app/admin/users?period=24h" },
    { label: "New in 7 days", value: stats.newUsers7Days, href: "/app/admin/users?period=7d" },
    { label: "New in 30 days", value: stats.newUsers30Days, href: "/app/admin/users?period=30d" }
  ];

  return (
    <div className="mx-auto max-w-[900px] space-y-8">
      <div>
        <Link href="/app/settings" className="inline-flex items-center gap-1 text-sm font-semibold text-white/60 hover:text-white">
          <ChevronLeft className="size-4" /> Settings
        </Link>
        <h1 className="display mt-5 text-2xl text-white">Admin</h1>
        <p className="mt-2 text-sm leading-6 text-white/50">Live aggregate account statistics. No personal user data is displayed.</p>
      </div>

      <UserGrowthChart data={stats.userGrowth} />

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-base font-extrabold text-white">Accounts</h2>
          <p className="text-xs font-semibold text-white/40">{verificationRate}% verified</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {accountTiles.map((tile) => (
            <StatCard key={tile.label} label={tile.label} value={tile.value} href={tile.href} />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-extrabold text-white">TV Time imports</h2>
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Completed" value={stats.completedImports} />
          <StatCard label="Failed" value={stats.failedImports} />
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, href }: { label: string; value: number; href?: string }) {
  const content = (
    <>
      <p className="eyebrow">{label}</p>
      <p className="display mt-2 text-[22px] text-white">{value.toLocaleString()}</p>
    </>
  );
  if (href) {
    return <Link href={href} className="surface rounded-[14px] px-5 py-4 transition hover:border-white/20 hover:bg-white/[0.035]">{content}</Link>;
  }
  return (
    <div className="surface rounded-[14px] px-5 py-4">
      {content}
    </div>
  );
}
