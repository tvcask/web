import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AppStoreBadge } from "@/components/marketing/app-store-badge";
import { MarketingFooter } from "@/components/marketing/footer";
import { MarketingHeader } from "@/components/marketing/header";
import { Button } from "@/components/ui/button";
import { Poster } from "@/components/titles/poster";
import { getToken } from "@/lib/api";
import { getPublicTitleDetail, getRelatedTitles } from "@/lib/data";
import { site } from "@/lib/site";
import type { TitleDetail } from "@/lib/data";

type Params = { params: Promise<{ id: string }> };

function seasonCount(detail: TitleDetail): number {
  return new Set(detail.episodes.map((e) => e.seasonNumber)).size;
}

/** "2022 · 2 seasons · Drama" — the same summary line the iPhone app shows. */
function summaryLine(detail: TitleDetail): string {
  const parts: string[] = [];
  if (detail.year) parts.push(String(detail.year));
  if (detail.type === "movie") {
    parts.push("Movie");
  } else {
    const seasons = seasonCount(detail);
    if (seasons > 0) parts.push(seasons === 1 ? "1 season" : `${seasons} seasons`);
  }
  if (detail.genres.length > 0) parts.push(detail.genres.slice(0, 2).join(", "));
  return parts.join(" · ");
}

function shareDescription(detail: TitleDetail): string {
  if (detail.overview) {
    return detail.overview.length > 200 ? `${detail.overview.slice(0, 197).trimEnd()}...` : detail.overview;
  }
  return `${detail.title} on ${site.displayName}. ${site.description}`;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const detail = await getPublicTitleDetail(id);
  if (!detail) {
    return { title: `Not found | ${site.displayName}` };
  }

  const title = `${detail.title} | ${site.displayName}`;
  const description = shareDescription(detail);
  // The backdrop is the closest thing to a 1200x630 card. Poster is a decent
  // second; both are absolute TMDB URLs so they pass through metadataBase.
  const image = detail.backdropUrl ?? detail.posterUrl ?? "/og-brand.png";

  return {
    title,
    description,
    alternates: { canonical: `/titles/${detail.id}` },
    openGraph: {
      title,
      description,
      type: detail.type === "movie" ? "video.movie" : "video.tv_show",
      url: `/titles/${detail.id}`,
      siteName: site.displayName,
      images: [{ url: image, alt: detail.title }]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image]
    }
  };
}

export default async function PublicTitlePage({ params }: Params) {
  const { id } = await params;
  const [detail, related] = await Promise.all([getPublicTitleDetail(id), getRelatedTitles(id)]);
  if (!detail) {
    notFound();
  }

  const isAuthenticated = Boolean(await getToken());
  const cast = detail.cast.slice(0, 8);

  return (
    <>
      <MarketingHeader />
      <main className="mx-auto w-full max-w-4xl px-5 pb-16 pt-8 sm:pb-20">
        <section className="overflow-hidden rounded-[22px] border border-white/[0.08] bg-[#0a0a0c]">
          <div className="relative aspect-[16/9] w-full bg-white/5">
            {detail.backdropUrl ? (
              <Image src={detail.backdropUrl} alt="" fill sizes="(max-width: 896px) 100vw, 896px" className="object-cover" priority />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/35 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
              <h1 className="display text-3xl leading-[1.05] text-white sm:text-[42px]">{detail.title}</h1>
              <p className="mt-2 text-sm font-medium text-white/60">{summaryLine(detail)}</p>
            </div>
          </div>

          <div className="p-5 sm:p-7">
            {typeof detail.rating === "number" && detail.rating > 0 ? (
              <div className="mb-6 flex items-end gap-2">
                <span className="display text-3xl text-[var(--accent-text)]">{detail.rating.toFixed(1)}</span>
                <span className="pb-1 text-xs font-bold uppercase tracking-[0.1em] text-white/40">
                  Catalog rating{detail.ratingCount ? ` · ${detail.ratingCount.toLocaleString()} votes` : ""}
                </span>
              </div>
            ) : null}
            {detail.overview ? (
              <p className="max-w-2xl text-[15px] leading-relaxed text-white/70">{detail.overview}</p>
            ) : null}

            <div className="mt-7 flex flex-col gap-3 border-t border-white/[0.08] pt-6 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <p className="display text-lg text-white">Keep track of {detail.title}</p>
                <p className="mt-1 text-sm text-white/55">
                  Mark episodes watched, see what airs next, and pick up where you left off.
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                {isAuthenticated ? (
                  <Button asChild className="h-11 px-5">
                    <Link href={`/app/titles/${detail.id}`}>Open in {site.displayName}</Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild className="h-11 px-5">
                      <Link href="/signup">Create account</Link>
                    </Button>
                    <AppStoreBadge />
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {detail.watchProviders.length > 0 ? (
          <section className="mt-8">
            <p className="eyebrow" style={{ color: "var(--accent-text)" }}>
              Where to watch
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2.5">
              {detail.watchProviders.map((provider) => (
                <a
                  key={provider.id}
                  href={detail.watchProviderLink || undefined}
                  target={detail.watchProviderLink ? "_blank" : undefined}
                  rel={detail.watchProviderLink ? "noreferrer" : undefined}
                  className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] py-1.5 pl-1.5 pr-3.5"
                >
                  {provider.logoUrl ? (
                    <Image
                      src={provider.logoUrl}
                      alt=""
                      width={28}
                      height={28}
                      className="size-7 rounded-full object-cover"
                    />
                  ) : null}
                  <span className="text-sm font-semibold text-white/80">{provider.name}</span>
                </a>
              ))}
            </div>
            <p className="mt-3 text-xs text-white/35">{detail.watchProviderAttribution}</p>
          </section>
        ) : null}

        {cast.length > 0 ? (
          <section className="mt-8">
            <p className="eyebrow" style={{ color: "var(--accent-text)" }}>
              Cast
            </p>
            <ul className="nos mt-3 flex gap-4 overflow-x-auto pb-2">
              {cast.map((member) => (
                <li key={member.id} className="w-[92px] shrink-0">
                  <Link href={`/people/${member.id}`} className="group block">
                  <div className="relative aspect-square w-full overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10 transition group-hover:ring-white/25">
                    {member.profileUrl ? (
                      <Image src={member.profileUrl} alt="" fill sizes="92px" className="object-cover" />
                    ) : null}
                  </div>
                  <p className="mt-2 text-center text-[13px] font-semibold leading-tight text-white/85">{member.name}</p>
                  {member.character ? (
                    <p className="mt-0.5 text-center text-[11px] leading-tight text-white/40">{member.character}</p>
                  ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {detail.type !== "movie" && detail.episodes.length > 0 ? (
          <section className="mt-9">
            <p className="eyebrow" style={{ color: "var(--accent-text)" }}>Episodes</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {detail.episodes
                .filter((episode) => episode.seasonNumber > 0)
                .slice(0, 12)
                .map((episode) => (
                  <Link
                    key={episode.id}
                    href={`/titles/${detail.id}/episodes/${episode.id}`}
                    className="group flex min-w-0 items-center gap-3 rounded-[14px] border border-white/[0.07] bg-white/[0.025] p-2 transition hover:bg-white/[0.05]"
                  >
                    <div className="relative h-[54px] w-24 shrink-0 overflow-hidden rounded-[8px] bg-white/5">
                      {episode.stillUrl ? <Image src={episode.stillUrl} alt="" fill sizes="96px" className="object-cover" /> : null}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-extrabold text-[var(--accent-text)]">S{episode.seasonNumber} · E{episode.episodeNumber}</p>
                      <p className="mt-1 truncate text-sm font-bold text-white/80 transition group-hover:text-white">{episode.name || "Episode details"}</p>
                    </div>
                  </Link>
                ))}
            </div>
          </section>
        ) : null}

        {related.length > 0 ? (
          <section className="mt-9">
            <p className="eyebrow" style={{ color: "var(--accent-text)" }}>More like this</p>
            <div className="nos mt-3 flex gap-4 overflow-x-auto pb-2">
              {related.slice(0, 12).map((item) => (
                <Link key={item.id} href={`/titles/${item.id}`} className="lift w-[124px] shrink-0">
                  <Poster src={item.posterUrl} title={item.title} className="rounded-[14px]" />
                  <p className="mt-2 truncate text-sm font-bold text-white/85">{item.title}</p>
                  {item.year ? <p className="mt-0.5 text-xs text-white/40">{item.year}</p> : null}
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </main>
      <MarketingFooter />
    </>
  );
}
