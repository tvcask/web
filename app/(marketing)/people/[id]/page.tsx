import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PersonDetail } from "@/components/people/person-detail";
import { MarketingFooter } from "@/components/marketing/footer";
import { MarketingHeader } from "@/components/marketing/header";
import { Button } from "@/components/ui/button";
import { getPerson } from "@/lib/data";
import { site } from "@/lib/site";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const person = await getPerson(id);
  if (!person) return { title: `Actor not found | ${site.displayName}` };
  const description = person.biography?.trim().slice(0, 200) || `Explore ${person.name}'s work on ${site.displayName}.`;
  return {
    title: `${person.name} | ${site.displayName}`,
    description,
    alternates: { canonical: `/people/${id}` },
    openGraph: {
      title: `${person.name} | ${site.displayName}`,
      description,
      url: `/people/${id}`,
      siteName: site.displayName,
      images: person.profileUrl ? [{ url: person.profileUrl, alt: person.name }] : undefined
    }
  };
}

export default async function PublicPersonPage({ params }: Params) {
  const { id } = await params;
  const person = await getPerson(id);
  if (!person) notFound();

  return (
    <>
      <MarketingHeader />
      <main className="mx-auto w-full max-w-4xl px-5 pb-16 pt-8 sm:pb-20">
        <div className="overflow-hidden rounded-[22px] border border-white/[0.08] bg-[#0a0a0c]">
          <PersonDetail id={id} mode="public" />
          <div className="mx-5 mb-7 flex flex-col gap-3 border-t border-white/[0.08] pt-6 sm:mx-8 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <p className="display text-lg text-white">Track what you watch</p>
              <p className="mt-1 text-sm text-white/55">Build your library and always know what comes next.</p>
            </div>
            <Button asChild className="h-11 px-5"><Link href="/signup">Create account</Link></Button>
          </div>
        </div>
      </main>
      <MarketingFooter />
    </>
  );
}
