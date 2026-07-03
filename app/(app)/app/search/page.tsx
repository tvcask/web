import { addTitleAction } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MediaRail } from "@/components/titles/media-rail";
import { Poster } from "@/components/titles/poster";
import { getDiscoverSections, searchTitles } from "@/lib/services/metadata-service";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const results = q ? await searchTitles(q) : [];
  const sections = q ? [] : await getDiscoverSections();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-4xl font-black">Explore</h1>
          <p className="mt-2 text-[#A79B8E]">Real metadata from TMDB. Add anything to your TV Cask history.</p>
        </div>
        <div className="flex gap-2">
          {["Feed", "Discover", "Activity"].map((tab, index) => (
            <span key={tab} className={index === 1 ? "rounded-full bg-[#D88945] px-4 py-2 text-sm font-black text-black" : "rounded-full bg-[#181818] px-4 py-2 text-sm font-black text-[#CFCFCF]"}>
              {tab}
            </span>
          ))}
        </div>
      </div>
      <form className="flex max-w-2xl gap-3">
        <Input name="q" placeholder="Search shows, movies, anime, or K-dramas" defaultValue={q} />
        <Button>Search</Button>
      </form>

      {!q ? (
        <div className="space-y-8">
          {sections.length === 0 ? (
            <Card className="p-6 text-[#A79B8E]">Add `TMDB_API_KEY` to show discovery rails.</Card>
          ) : (
            sections.map((section) => <MediaRail key={section.title} title={section.title} items={section.items} />)
          )}
        </div>
      ) : results.length === 0 ? (
        <Card className="p-6 text-[#A79B8E]">No results found. Check `TMDB_API_KEY` or try another title.</Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {results.map((title) => (
            <Card key={title.id} className="grid grid-cols-[96px_1fr] gap-4 p-3">
              <Poster src={title.posterUrl} title={title.title} />
              <div className="min-w-0 space-y-3">
                <div>
                  <h2 className="truncate font-semibold">{title.title}</h2>
                  <p className="text-sm text-[#A79B8E]">{[title.year, title.category.replace("_", " ")].filter(Boolean).join(" · ")}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {title.genres.slice(0, 3).map((genre) => <Badge key={genre}>{genre}</Badge>)}
                </div>
                <form action={addTitleAction} className="flex gap-2">
                  <input type="hidden" name="payload" value={JSON.stringify({ title, status: "watchlist", favorite: false })} />
                  <Button className="h-9 px-3">Add</Button>
                </form>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
