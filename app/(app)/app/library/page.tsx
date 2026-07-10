import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfiniteLibrary } from "@/components/titles/infinite-library";
import { getLibraryPage } from "@/lib/data";

export default async function LibraryPage({
  searchParams
}: {
  searchParams: Promise<{ type?: string; favorite?: string }>;
}) {
  const { type: typeParam, favorite: favoriteParam } = await searchParams;
  const type = typeParam === "movie" ? "movie" : "show";
  const favorite = favoriteParam === "true";

  const { items, total } = await getLibraryPage({ type, favorite: favorite || undefined, limit: 40 });

  const noun = type === "movie" ? "movies" : "shows";
  const heading = favorite ? `Favorite ${noun}` : `All ${noun}`;
  const returnTo = `/app/library?type=${type}${favorite ? "&favorite=true" : ""}`;

  return (
    <div className="mx-auto max-w-[1300px]">
      <header className="mb-6 flex items-center gap-3">
        <Link
          href="/app/profile"
          className="grid size-9 shrink-0 place-items-center rounded-full border border-white/12 text-white/70 transition hover:bg-white/5 hover:text-white"
          aria-label="Back to profile"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <h1 className="display text-xl capitalize text-white sm:text-2xl">{heading}</h1>
        {total > 0 ? (
          <span className="rounded-full bg-white/8 px-2.5 py-0.5 text-xs font-bold text-white/45">
            {total.toLocaleString()}
          </span>
        ) : null}
      </header>

      {total === 0 ? (
        <div className="surface rounded-[16px] p-8">
          <h2 className="display text-lg text-white">Nothing here yet.</h2>
          <p className="mt-2 max-w-md text-sm text-white/50">
            {favorite ? "Mark titles as favorites from their page to see them here." : "Track titles to build your library."}
          </p>
          <Button asChild className="mt-5">
            <Link href="/app/explore">
              <Search className="size-4" /> Explore
            </Link>
          </Button>
        </div>
      ) : (
        <InfiniteLibrary type={type} view="grid" favorite={favorite} initial={items} total={total} returnTo={returnTo} />
      )}
    </div>
  );
}
