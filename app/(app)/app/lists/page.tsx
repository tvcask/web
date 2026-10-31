import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ListCard } from "@/components/lists/list-card";
import { getList, getLists, type UserListDetail } from "@/lib/data";

export default async function ListsPage() {
  const lists = await getLists();
  // ponytail: one request per list for the poster previews, same as Profile. Add a
  // summaries endpoint if people end up with hundreds of lists.
  const details = (await Promise.all(lists.map((list) => getList(list.id)))).filter(Boolean) as UserListDetail[];

  return (
    <div className="mx-auto max-w-[1300px]">
      <header className="mb-6 flex items-center gap-3">
        <Link
          href="/app/profile"
          className="grid size-9 shrink-0 place-items-center rounded-full border border-white/12 text-white/70 transition hover:bg-white/5 hover:text-white"
          aria-label="Back to profile"
        >
          <HugeiconsIcon icon={ArrowLeft02Icon} className="size-4" />
        </Link>
        <h1 className="display text-xl text-white sm:text-2xl">Lists</h1>
        {lists.length > 0 ? (
          <span className="rounded-full bg-white/8 px-2.5 py-0.5 text-xs font-bold text-white/45">{lists.length.toLocaleString()}</span>
        ) : null}
        <Link
          href="/app/lists/new"
          className="ml-auto grid size-9 place-items-center rounded-full border border-white/12 text-white/70 transition hover:bg-white/5 hover:text-white"
          aria-label="Create list"
        >
          <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
        </Link>
      </header>

      {details.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2">
          {details.map((list) => <ListCard key={list.id} list={list} />)}
        </div>
      ) : (
        <div className="surface rounded-[14px] p-5">
          <p className="text-sm text-white/55">Create custom lists for themes, rankings, or watch plans.</p>
          <Button asChild className="mt-4">
            <Link href="/app/lists/new">Create list</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
