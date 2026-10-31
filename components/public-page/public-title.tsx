import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";

import { MarketingFooter } from "@/components/marketing/footer";
import { Breadcrumbs, PublicHeader } from "@/components/public-page/public-header";
import { Poster } from "@/components/titles/poster";
import { TmdbAttribution } from "@/components/tmdb-attribution";
import { Button } from "@/components/ui/button";
import { getPublicTitleCast, getPublicTitleDetail, getRelatedTitles, type TitleDetail } from "@/lib/data";
import { publicPersonPath, publicTitlePath, titleIdFromSlug, type TitleKind } from "@/lib/public-urls";
import { site } from "@/lib/site";

const EPISODE_PREVIEW = 12;

function seasonCount(detail: TitleDetail): number {
  return new Set(detail.episodes.map((e) => e.seasonNumber)).size;
}

/** "2022 · 2 seasons · Drama": the same summary line the iPhone app shows. */
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

export async function titleMetadata(kind: TitleKind, slug: string): Promise<Metadata> {
  const id = titleIdFromSlug(kind, slug);
  const detail = id ? await getPublicTitleDetail(id) : null;
  if (!detail) return { title: `Not found | ${site.displayName}`, robots: { index: false } };

  const title = `${detail.title} | ${site.displayName}`;
  const description = shareDescription(detail);
  const url = publicTitlePath(detail);
  // The backdrop is the closest thing to a 1200x630 card. Poster is a decent
  // second; both are absolute TMDB URLs so they pass through metadataBase.
  const image = detail.backdropUrl ?? detail.posterUrl ?? "/og-brand.png";

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: detail.type === "movie" ? "video.movie" : "video.tv_show",
      url,
      siteName: site.displayName,
      images: [{ url: image, alt: detail.title }]
    },
    twitter: { card: "summary_large_image", title, description, images: [image] }
  };
}

export async function PublicTitleRoute({ kind, slug }: { kind: TitleKind; slug: string }) {
  const id = titleIdFromSlug(kind, slug);
  if (!id) notFound();
  const [detail, related, castResult] = await Promise.all([
    getPublicTitleDetail(id),
    getRelatedTitles(id),
    getPublicTitleCast(id)
  ]);
  if (!detail) notFound();
  // A renamed title, or a link with the wrong words, lands on the one real URL.
  const canonical = publicTitlePath(detail);
  if (canonical !== `/${kind}/${slug}`) permanentRedirect(canonical);

  const isMovie = detail.type === "movie";
  const cast = (castResult.status === "ready" ? castResult.items : detail.cast).slice(0, 12);
  const episodes = isMovie ? [] : detail.episodes.filter((episode) => episode.seasonNumber > 0);
  const trackHref = `/signup?returnTo=${encodeURIComponent(`/app/titles/${detail.id}`)}`;

  return (
    <>
      <PublicHeader />
      <main className="mx-auto w-full max-w-4xl px-5 pb-16 pt-5 sm:pb-20">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: isMovie ? "Movies" : "Series" }, { label: detail.title }]} />

        <section className="mt-4 overflow-hidden rounded-[22px] border border-white/[0.08] bg-[#0a0a0c]">
          <div className="relative h-[170px] w-full bg-white/5 sm:h-[250px]">
            {detail.backdropUrl ? (
              <Image src={detail.backdropUrl} alt="" fill sizes="(max-width: 896px) 100vw, 896px" className="object-cover object-[center_25%]" priority />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/25 to-transparent" />
          </div>

          <div className="relative px-5 pb-6 sm:px-7 sm:pb-7">
            <div className="-mt-16 flex items-end gap-4 sm:-mt-24 sm:gap-6">
              <div className="w-[96px] shrink-0 overflow-hidden rounded-[12px] shadow-xl shadow-black/40 ring-1 ring-white/10 sm:w-[148px]">
                <Poster src={detail.posterUrl} title={detail.title} alt={`${detail.title} poster`} className="rounded-[12px]" />
              </div>
              <div className="min-w-0 pb-0.5">
                <h1 className="display break-words text-2xl leading-[1.08] text-white sm:text-[38px]">{detail.title}</h1>
                <p className="mt-1.5 text-sm font-medium text-white/55">{summaryLine(detail)}</p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Button asChild className="h-11 px-6">
                <Link href={trackHref}>Track this {isMovie ? "movie" : "show"}</Link>
              </Button>
              {typeof detail.rating === "number" && detail.rating > 0 ? (
                <p className="flex items-baseline gap-2">
                  <span className="display text-2xl text-[var(--accent-text)]">{detail.rating.toFixed(1)}</span>
                  <span className="text-xs font-semibold text-white/40">
                    {detail.ratingCount ? `${detail.ratingCount.toLocaleString()} votes` : "Catalog rating"}
                  </span>
                </p>
              ) : null}
            </div>

            {detail.watchProviders.length > 0 ? (
              <div className="mt-6">
                <h2 className="eyebrow">Where to watch</h2>
                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  {detail.watchProviders.map((provider) => (
                    <a
                      key={provider.id}
                      href={detail.watchProviderLink || undefined}
                      target={detail.watchProviderLink ? "_blank" : undefined}
                      rel={detail.watchProviderLink ? "nofollow noreferrer" : undefined}
                      className="flex items-center gap-2 rounded-full bg-white/[0.05] py-1 pl-1 pr-3 transition hover:bg-white/10"
                    >
                      {provider.logoUrl ? (
                        <Image src={provider.logoUrl} alt="" width={26} height={26} className="size-[26px] rounded-full object-cover" />
                      ) : null}
                      <span className="text-sm font-semibold text-white/80">{provider.name}</span>
                    </a>
                  ))}
                </div>
                <p className="mt-2 text-[11px] text-white/30">{detail.watchProviderAttribution}</p>
              </div>
            ) : null}

            {detail.overview ? (
              <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-white/70">{detail.overview}</p>
            ) : null}
          </div>
        </section>

        {cast.length > 0 ? (
          <section className="mt-9">
            <h2 className="eyebrow">Cast</h2>
            <ul className="mt-4 grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-6">
              {cast.map((member) => (
                <li key={member.id} className="min-w-0">
                  <Link href={publicPersonPath(member)} className="group block text-center">
                    <div className="relative mx-auto aspect-square w-full max-w-[92px] overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10 transition group-hover:ring-white/25">
                      {member.profileUrl ? (
                        <Image src={member.profileUrl} alt={member.name} fill sizes="92px" className="object-cover" />
                      ) : null}
                    </div>
                    <p className="mt-2 text-[13px] font-semibold leading-tight text-white/85">{member.name}</p>
                    {member.character ? <p className="mt-0.5 text-[11px] leading-tight text-white/40">{member.character}</p> : null}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {episodes.length > 0 ? (
          <section className="mt-9">
            <h2 className="eyebrow">Episodes</h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {episodes.slice(0, EPISODE_PREVIEW).map((episode) => (
                <Link
                  key={episode.id}
                  href={`/titles/${detail.id}/episodes/${episode.id}`}
                  className="group flex min-w-0 items-center gap-3 rounded-[14px] bg-white/[0.025] p-2 transition hover:bg-white/[0.05]"
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
            {episodes.length > EPISODE_PREVIEW ? (
              <p className="mt-3 text-sm text-white/45">
                And {(episodes.length - EPISODE_PREVIEW).toLocaleString()} more.{" "}
                <Link href={trackHref} className="font-bold text-white/70 transition hover:text-white">Track all of them</Link>
              </p>
            ) : null}
          </section>
        ) : null}

        {related.length > 0 ? (
          <section className="mt-9">
            <h2 className="eyebrow">More like this</h2>
            <div className="nos mt-3 flex gap-3 overflow-x-auto pb-2">
              {related.slice(0, 12).map((item) => (
                <Link key={item.id} href={publicTitlePath(item)} className="lift w-[116px] shrink-0">
                  <Poster src={item.posterUrl} title={item.title} alt={`${item.title} poster`} className="rounded-[12px]" />
                  <p className="mt-2 truncate text-[13px] font-bold text-white/85">{item.title}</p>
                  {item.year ? <p className="mt-0.5 text-xs text-white/40">{item.year}</p> : null}
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <div className="mt-10 space-y-1 border-t border-white/[0.06] pt-4">
          <TmdbAttribution />
          {detail.episodeMetadataAttribution ? (
            <p className="text-xs leading-5 text-white/35">
              <a href={detail.episodeMetadataUrl || site.tvdb} target="_blank" rel="noreferrer" className="underline transition hover:text-white/60">
                {detail.episodeMetadataAttribution}
              </a>
            </p>
          ) : null}
        </div>
      </main>
      <MarketingFooter auth={false} />
    </>
  );
}
