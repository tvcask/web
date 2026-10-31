import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons';
import Link from "next/link";
import { TitleDetail } from "@/components/titles/title-detail";
import { ReopenInDrawer } from "@/components/ui/reopen-in-drawer";
import { drawerBackdrop } from "@/lib/detail-return";

export default async function TitleDetailsPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const { id } = await params;
  const { returnTo } = await searchParams;
  const listHref = drawerBackdrop(returnTo);
  if (listHref) return <ReopenInDrawer listHref={listHref} />;
  const backHref = returnTo?.startsWith("/app/") ? returnTo : "/app/shows";

  return (
    <div className="mx-auto max-w-[720px]">
      <Link
        href={backHref}
        className="cask-focus mb-3 inline-flex items-center gap-1 rounded-full bg-white/5 py-2 pl-2 pr-3.5 text-sm font-bold text-white/70 transition hover:bg-white/10 hover:text-white"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" /> Back
      </Link>
      <div className="overflow-clip rounded-[18px] border border-white/[0.08] bg-[#0a0a0c]">
        <TitleDetail id={id} />
      </div>
    </div>
  );
}
