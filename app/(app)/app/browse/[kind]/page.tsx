import { notFound } from "next/navigation";
import { getCollection, getLibrary } from "@/lib/data";
import { InfiniteCatalog } from "@/components/titles/infinite-catalog";

const labels: Record<string, string> = {
  "trending-tv": "Trending shows",
  "top-tv": "Top shows",
  "trending-movie": "Trending movies",
  "top-movie": "Popular movies"
};

export default async function BrowsePage({ params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  const label = labels[kind];
  if (!label) {
    notFound();
  }

  const [{ items, hasMore }, library] = await Promise.all([getCollection(kind, 1), getLibrary({ limit: 100 })]);

  return (
    <div className="mx-auto max-w-[1300px]">
      <h1 className="display mb-6 text-2xl text-white">{label}</h1>
      <InfiniteCatalog kind={kind} initial={items} hasMore={hasMore} trackedIds={library.map((i) => i.titleId)} />
    </div>
  );
}
