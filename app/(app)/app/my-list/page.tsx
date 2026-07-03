import Link from "next/link";
import { FileUp, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MediaRail } from "@/components/titles/media-rail";
import { TitleGrid } from "@/components/titles/title-grid";
import { WatchRow } from "@/components/titles/watch-row";
import { getUserId } from "@/lib/auth/session";
import { getDiscoverSections } from "@/lib/services/metadata-service";
import { getUserList } from "@/lib/services/tracking-service";

export default async function MyListPage() {
  const userId = await getUserId();
  const list = getUserList(userId);
  const discoverSections = list.length === 0 ? await getDiscoverSections() : [];
  const sections = [
    ["Continue Watching", list.filter((item) => item.status === "watching")],
    ["Watchlist", list.filter((item) => item.status === "watchlist")],
    ["Completed", list.filter((item) => item.status === "completed")],
    ["Favorites", list.filter((item) => item.favorite)]
  ] as const;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-4xl font-black">My List</h1>
          <p className="mt-2 text-[#A79B8E]">Watch next, saved titles, favorites, and completed history.</p>
        </div>
        <div className="flex rounded-full border border-[#242424] bg-[#070707] p-1">
          <span className="rounded-full bg-[#D88945] px-4 py-2 text-sm font-black text-black">Watch List</span>
          <span className="px-4 py-2 text-sm font-black text-[#888]">Upcoming</span>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="space-y-8">
          <Card className="overflow-hidden border-[#2a2018] bg-[#080604]">
            <div className="grid gap-6 p-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="text-3xl font-black">Your watch history is waiting.</h2>
                <p className="mt-3 max-w-xl text-[#A79B8E]">Import your TV Time data or start adding shows manually. Nothing is saved until you confirm.</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild>
                  <Link href="/app/import">
                    <FileUp className="size-4" /> Import TV Time data
                  </Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href="/app/search">
                    <Search className="size-4" /> Explore titles
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
          {discoverSections.slice(0, 2).map((section) => <MediaRail key={section.title} title={section.title} items={section.items} />)}
        </div>
      ) : (
        <>
          {sections[0][1].length > 0 ? (
            <section className="space-y-3">
              <div className="mx-auto w-fit rounded-full bg-[#777] px-4 py-1 text-xs font-black uppercase text-white">Watch next</div>
              <div className="space-y-3">
                {sections[0][1].map((item) => <WatchRow key={item.id} item={item} />)}
              </div>
            </section>
          ) : null}
          {sections.slice(1).map(([title, items]) =>
            items.length > 0 ? (
              <section key={title} className="space-y-4">
                <h2 className="text-2xl font-black">{title}</h2>
                <TitleGrid items={items} />
              </section>
            ) : null
          )}
        </>
      )}
    </div>
  );
}
