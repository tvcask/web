import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { OwnerHeader } from "@/components/public-page/owner-header";
import { PublicShell } from "@/components/public-page/public-shell";
import { Poster } from "@/components/titles/poster";
import { getPublicProfile, publicListPath, publicPagePath } from "@/lib/public-page";
import { site } from "@/lib/site";

type Params = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { handle } = await params;
  const profile = await getPublicProfile(handle);
  if (!profile) return { title: `Not found | ${site.displayName}`, robots: { index: false, follow: false } };

  const title = `${profile.name} (@${profile.username}) | ${site.displayName}`;
  const description = profile.bio || `What ${profile.name} is watching and recommending on ${site.displayName}.`;
  return {
    title,
    description,
    // For sharing with people, not for search results.
    robots: { index: false, follow: false },
    alternates: { canonical: publicPagePath(profile.username) },
    openGraph: { title, description, type: "profile", url: publicPagePath(profile.username), siteName: site.displayName },
    twitter: { card: "summary_large_image", title, description }
  };
}

export default async function PublicProfilePage({ params }: Params) {
  const { handle } = await params;
  const profile = await getPublicProfile(handle);
  if (!profile) notFound();

  return (
    <PublicShell>
      <OwnerHeader owner={profile} />

      <section className="mt-10">
        <h2 className="eyebrow mb-4">Lists</h2>
        {profile.lists.length > 0 ? (
          <div className="flex flex-col gap-2.5">
            {profile.lists.map((list) => (
              <Link
                key={list.id}
                href={publicListPath(list.id)}
                className="surface group flex items-center gap-4 rounded-[16px] p-3 transition hover:bg-white/[0.04] sm:p-3.5"
              >
                {/* Fixed width, so titles line up whatever the poster count. */}
                <div className="flex w-[112px] shrink-0 -space-x-5 sm:w-[135px]">
                  {list.titles.slice(0, 4).map((title) => (
                    <div key={title.id} className="w-[52px] overflow-hidden rounded-[8px] ring-2 ring-[#11100e] sm:w-[60px]">
                      <Poster src={title.posterUrl} title={title.title} className="rounded-[8px]" />
                    </div>
                  ))}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-bold text-white">{list.name}</p>
                  <p className="mt-0.5 text-xs font-semibold text-white/40">
                    {list.itemCount.toLocaleString()} {list.itemCount === 1 ? "title" : "titles"}
                  </p>
                </div>
                <HugeiconsIcon icon={ArrowRight01Icon} className="size-5 shrink-0 text-white/30 transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-white/45">No public lists yet.</p>
        )}
      </section>
    </PublicShell>
  );
}
