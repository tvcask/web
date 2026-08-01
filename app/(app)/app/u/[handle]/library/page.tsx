import Link from "next/link";
import { notFound } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { Poster } from "@/components/titles/poster";
import { getUserLibrary } from "@/lib/social";

type Params = {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ type?: string; favorite?: string }>;
};

function heading(type?: string, favorite?: boolean): string {
  const kind = type === "movie" ? "Movies" : "Shows";
  return favorite ? `Favorite ${kind.toLowerCase()}` : kind;
}

export default async function UserLibraryPage({ params, searchParams }: Params) {
  const { handle } = await params;
  const { type, favorite } = await searchParams;
  const isFavorite = favorite === "true";

  const page = await getUserLibrary(handle, { type, favorite: isFavorite, limit: 60 });
  if (!page) {
    notFound();
  }

  const base = `/app/u/${handle}`;
  return (
    <div className="mx-auto max-w-[1300px] space-y-6">
      <Link href={base} className="inline-flex items-center gap-1 text-sm font-semibold text-white/60 hover:text-white">
        <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" /> @{handle}
      </Link>

      <div className="flex items-baseline gap-2">
        <h1 className="display text-2xl text-white">{heading(type, isFavorite)}</h1>
        <span className="text-sm font-semibold text-white/40">{page.total.toLocaleString()}</span>
      </div>

      {page.items.length === 0 ? (
        <p className="py-10 text-center text-sm text-white/45">Nothing here yet.</p>
      ) : (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-8">
          {page.items.map((item) => (
            <Link
              key={item.id}
              href={`/app/titles/${item.title.id}?returnTo=${encodeURIComponent(base)}`}
              className="lift overflow-hidden rounded-[12px]"
            >
              <Poster src={item.title.posterUrl} title={item.title.title} className="rounded-[12px]" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
