import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon } from '@hugeicons/core-free-icons';
import Link from "next/link";
import { TitleDetail } from "@/components/titles/title-detail";

export default async function TitleDetailsPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const { id } = await params;
  const { returnTo } = await searchParams;
  const backHref = returnTo?.startsWith("/app/") ? returnTo : "/app/shows";

  return (
    <div className="mx-auto max-w-[640px]">
      <div className="mb-3">
        <Link
          href={backHref}
          className="inline-flex size-9 items-center justify-center rounded-full bg-white/5 text-white transition hover:bg-white/10"
          aria-label="Back"
        >
          <HugeiconsIcon icon={Cancel01Icon} className="size-4" />
        </Link>
      </div>
      <div className="overflow-hidden rounded-[18px] border border-white/[0.08] bg-[#0a0a0c]">
        <TitleDetail id={id} />
      </div>
    </div>
  );
}
