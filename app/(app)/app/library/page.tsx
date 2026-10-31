import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft02Icon, Search01Icon } from '@hugeicons/core-free-icons';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { InfiniteLibrary } from "@/components/titles/infinite-library";
import { TitleRail } from "@/components/titles/title-rail";
import { getLibraryPage } from "@/lib/data";

const SHOW_GROUPS = [
  { title: "In progress", status: "watching" },
  { title: "Not started", status: "watchlist" },
  { title: "Finished", status: "completed" },
  { title: "Dropped", status: "dropped" }
] as const;
const GROUP_PREVIEW_COUNT = 12;
const OVERVIEW_PATH = "/app/library?type=show";

export default async function LibraryPage({
  searchParams
}: {
  searchParams: Promise<{ type?: string; favorite?: string; status?: string }>;
}) {
  const { type: typeParam, favorite: favoriteParam, status: statusParam } = await searchParams;
  const type = typeParam === "movie" ? "movie" : "show";
  const favorite = favoriteParam === "true";
  const group = type === "show" ? SHOW_GROUPS.find((g) => g.status === statusParam) : undefined;

  if (type === "show" && !favorite && !group) {
    return ShowsOverview();
  }

  const status = group?.status;
  const { items, total } = await getLibraryPage({ type, status, favorite: favorite || undefined, limit: 40 });

  const noun = type === "movie" ? "movies" : "shows";
  const heading = group?.title ?? (favorite ? `Favorite ${noun}` : `All ${noun}`);
  const returnTo = status
    ? `${OVERVIEW_PATH}&status=${status}`
    : `/app/library?type=${type}${favorite ? "&favorite=true" : ""}`;

  return (
    <LibraryShell heading={heading} total={total} backHref={status ? OVERVIEW_PATH : "/app/profile"}>
      {total === 0 ? (
        <EmptyLibrary body={favorite ? "Mark titles as favorites from their page to see them here." : "Track titles to build your library."} />
      ) : (
        <InfiniteLibrary key={status} type={type} view="grid" status={status} favorite={favorite} initial={items} total={total} returnTo={returnTo} />
      )}
    </LibraryShell>
  );
}

async function ShowsOverview() {
  const pages = await Promise.all(
    SHOW_GROUPS.map((g) => getLibraryPage({ type: "show", status: g.status, limit: GROUP_PREVIEW_COUNT }))
  );
  const total = pages.reduce((sum, page) => sum + page.total, 0);

  return (
    <LibraryShell heading="Shows" total={total} backHref="/app/profile">
      {total === 0 ? (
        <EmptyLibrary body="Track titles to build your library." />
      ) : (
        <div className="space-y-8">
          {SHOW_GROUPS.map((g, index) => (
            <TitleRail
              key={g.status}
              title={g.title}
              count={pages[index].total}
              href={`${OVERVIEW_PATH}&status=${g.status}`}
              items={pages[index].items.map((item) => item.title)}
              returnTo={OVERVIEW_PATH}
            />
          ))}
        </div>
      )}
    </LibraryShell>
  );
}

function LibraryShell({
  heading,
  total,
  backHref,
  children
}: {
  heading: string;
  total: number;
  backHref: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[1300px]">
      <header className="mb-6 flex items-center gap-3">
        <Link
          href={backHref}
          className="grid size-9 shrink-0 place-items-center rounded-full border border-white/12 text-white/70 transition hover:bg-white/5 hover:text-white"
          aria-label={backHref === "/app/profile" ? "Back to profile" : "Back to shows"}
        >
          <HugeiconsIcon icon={ArrowLeft02Icon} className="size-4" />
        </Link>
        <h1 className="display text-xl capitalize text-white sm:text-2xl">{heading}</h1>
        {total > 0 ? (
          <span className="rounded-full bg-white/8 px-2.5 py-0.5 text-xs font-bold text-white/45">
            {total.toLocaleString()}
          </span>
        ) : null}
      </header>
      {children}
    </div>
  );
}

function EmptyLibrary({ body }: { body: string }) {
  return (
    <div className="surface rounded-[16px] p-8">
      <h2 className="display text-lg text-white">Nothing here yet.</h2>
      <p className="mt-2 max-w-md text-sm text-white/50">{body}</p>
      <Button asChild className="mt-5">
        <Link href="/app/explore">
          <HugeiconsIcon icon={Search01Icon} className="size-4" /> Explore
        </Link>
      </Button>
    </div>
  );
}
