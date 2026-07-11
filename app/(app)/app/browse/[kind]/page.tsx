import { notFound } from "next/navigation";
import { getCollection, getLibrary } from "@/lib/data";
import { InfiniteCatalog } from "@/components/titles/infinite-catalog";

export default async function BrowsePage({ params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;

  // The API is the source of truth for categories: it returns the label for a
  // known kind and an empty one otherwise, so an unknown kind is a 404.
  const [{ title, items, hasMore }, library] = await Promise.all([getCollection(kind, 1), getLibrary({ limit: 100 })]);
  if (!title) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-[1300px]">
      <h1 className="display mb-6 text-2xl text-white">{title}</h1>
      <InfiniteCatalog kind={kind} initial={items} hasMore={hasMore} trackedIds={library.map((i) => i.titleId)} />
    </div>
  );
}
