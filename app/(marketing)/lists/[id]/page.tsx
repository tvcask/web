import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PublicShell } from "@/components/public-page/public-shell";
import { Poster } from "@/components/titles/poster";
import { Avatar } from "@/components/ui/avatar";
import { getPublicList, publicListPath, publicPagePath } from "@/lib/public-page";
import { site } from "@/lib/site";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const list = await getPublicList(id);
  if (!list) return { title: `Not found | ${site.displayName}`, robots: { index: false, follow: false } };

  const title = `${list.name} by ${list.owner.name} | ${site.displayName}`;
  const description = list.description || `${list.itemCount} ${list.itemCount === 1 ? "title" : "titles"} picked by ${list.owner.name}.`;
  return {
    title,
    description,
    robots: { index: false, follow: false },
    alternates: { canonical: publicListPath(list.id) },
    openGraph: { title, description, type: "website", url: publicListPath(list.id), siteName: site.displayName },
    twitter: { card: "summary_large_image", title, description }
  };
}

export default async function PublicListPage({ params }: Params) {
  const { id } = await params;
  const list = await getPublicList(id);
  if (!list) notFound();

  return (
    <PublicShell>
      <Link
        href={publicPagePath(list.owner.username)}
        className="group inline-flex items-center gap-2 text-sm font-bold text-white/60 transition hover:text-white"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4 transition-transform group-hover:-translate-x-0.5" />
        <Avatar src={list.owner.avatarUrl} name={list.owner.name} size={24} />
        {list.owner.name}
      </Link>

      <h1 className="display mt-6 break-words text-3xl leading-tight text-white">{list.name}</h1>
      {list.description ? <p className="mt-3 break-words text-[15px] leading-6 text-white/70">{list.description}</p> : null}
      <p className="mt-2 text-xs font-semibold text-white/40">
        {list.itemCount.toLocaleString()} {list.itemCount === 1 ? "title" : "titles"}
      </p>

      {list.titles.length > 0 ? (
        <div className="mt-8 grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-5">
          {list.titles.map((title) => (
            <Link key={title.id} href={`/titles/${title.id}`} className="lift min-w-0">
              <Poster src={title.posterUrl} title={title.title} className="rounded-[12px]" />
              <p className="mt-2 truncate text-xs font-bold text-white/85">{title.title}</p>
              {title.year ? <p className="text-[11px] text-white/40">{title.year}</p> : null}
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-8 text-sm text-white/45">Nothing on this list yet.</p>
      )}
    </PublicShell>
  );
}
