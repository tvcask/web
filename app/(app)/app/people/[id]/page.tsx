import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";

import { PersonDetail } from "@/components/people/person-detail";
import { ReopenInDrawer } from "@/components/ui/reopen-in-drawer";
import { drawerBackdrop } from "@/lib/detail-return";

export default async function PersonPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ character?: string; titleId?: string; returnTo?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const listHref = drawerBackdrop(query.returnTo);
  if (listHref) {
    const parentHref = query.titleId ? `/app/titles/${encodeURIComponent(query.titleId)}?returnTo=${encodeURIComponent(listHref)}` : undefined;
    return <ReopenInDrawer listHref={listHref} parentHref={parentHref} />;
  }
  const backHref = query.returnTo?.startsWith("/app/") ? query.returnTo : "/app/explore";

  return (
    <div className="mx-auto max-w-[720px]">
      <Link
        href={backHref}
        className="cask-focus mb-3 inline-flex items-center gap-1 rounded-full bg-white/5 py-2 pl-2 pr-3.5 text-sm font-bold text-white/70 transition hover:bg-white/10 hover:text-white"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" /> Back
      </Link>
      <div className="overflow-clip rounded-[18px] border border-white/[0.08] bg-[#0a0a0c]">
        <PersonDetail id={id} mode="app" character={query.character} titleId={query.titleId} returnTo={backHref} />
      </div>
    </div>
  );
}
