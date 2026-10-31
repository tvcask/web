import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";

import { MarketingFooter } from "@/components/marketing/footer";
import { PersonDetail } from "@/components/people/person-detail";
import { Breadcrumbs, PublicHeader } from "@/components/public-page/public-header";
import { TmdbAttribution } from "@/components/tmdb-attribution";
import { Button } from "@/components/ui/button";
import { getPerson } from "@/lib/data";
import { personIdFromSlug, publicPersonPath } from "@/lib/public-urls";
import { site } from "@/lib/site";

type Params = { params: Promise<{ id: string }> };

// Rendered on first visit, then cached. Nothing here depends on who's reading.
export const revalidate = 3600;
export const generateStaticParams = () => [];

async function loadPerson(slug: string) {
  const id = personIdFromSlug(slug);
  return id ? getPerson(id) : null;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const person = await loadPerson((await params).id);
  if (!person) return { title: `Actor not found | ${site.displayName}`, robots: { index: false } };
  const description = person.biography?.trim().slice(0, 200) || `Explore ${person.name}'s work on ${site.displayName}.`;
  const url = publicPersonPath(person);
  return {
    title: `${person.name} | ${site.displayName}`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${person.name} | ${site.displayName}`,
      description,
      url,
      siteName: site.displayName,
      images: person.profileUrl ? [{ url: person.profileUrl, alt: person.name }] : undefined
    }
  };
}

export default async function PublicPersonPage({ params }: Params) {
  const { id: slug } = await params;
  const person = await loadPerson(slug);
  if (!person) notFound();
  const canonical = publicPersonPath(person);
  if (canonical !== `/people/${slug}`) permanentRedirect(canonical);

  return (
    <>
      <PublicHeader />
      <main className="mx-auto w-full max-w-4xl px-5 pb-16 pt-5 sm:pb-20">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "People" }, { label: person.name }]} />
        <div className="mt-4 overflow-hidden rounded-[22px] border border-white/[0.08] bg-[#0a0a0c]">
          <PersonDetail id={person.id} mode="public" />
          <div className="mx-5 mb-7 flex flex-col gap-3 border-t border-white/[0.08] pt-6 sm:mx-8 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <p className="display text-lg text-white">Track what you watch</p>
              <p className="mt-1 text-sm text-white/55">Build your library and always know what comes next.</p>
            </div>
            <Button asChild className="h-11 px-5"><Link href="/signup">Create account</Link></Button>
          </div>
        </div>
        <TmdbAttribution className="mt-6" />
      </main>
      <MarketingFooter auth={false} />
    </>
  );
}
