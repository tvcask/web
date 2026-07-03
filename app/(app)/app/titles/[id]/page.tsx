import Link from "next/link";
import { addTitleAction, markNextAction } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Poster } from "@/components/titles/poster";
import { getUserId } from "@/lib/auth/session";
import { getEpisodesForTitle, getTitle } from "@/lib/services/metadata-service";
import { getUserList } from "@/lib/services/tracking-service";

export default async function TitleDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserId();
  const { id } = await params;
  const title = getTitle(id);

  if (!title) {
    return (
      <Card className="p-6">
        <h1 className="text-2xl font-semibold">Title not found</h1>
        <p className="mt-2 text-[#A79B8E]">Search TMDB or import TV Time data to add this title.</p>
        <Button asChild className="mt-5"><Link href="/app/search">Search titles</Link></Button>
      </Card>
    );
  }

  const userTitle = getUserList(userId).find((item) => item.titleId === title.id);
  const episodes = getEpisodesForTitle(title.id);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-xl border border-[#33281F] bg-[#181410]">
        {title.backdropUrl ? <img src={title.backdropUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" /> : null}
        <div className="relative grid gap-6 p-5 md:grid-cols-[180px_1fr] md:p-8">
          <Poster src={title.posterUrl} title={title.title} />
          <div className="space-y-5">
            <div>
              <h1 className="text-4xl font-semibold">{title.title}</h1>
              <p className="mt-2 text-[#A79B8E]">{[title.year, title.category.replace("_", " ")].filter(Boolean).join(" · ")}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {title.genres.map((genre) => <Badge key={genre}>{genre}</Badge>)}
            </div>
            <p className="max-w-3xl leading-7 text-[#d7cec4]">{title.overview || "No overview is available from the configured metadata provider."}</p>
            {userTitle ? (
              <div className="flex flex-wrap gap-3">
                <Badge className="border-[#22C55E]/40 text-[#22C55E]">{userTitle.status}</Badge>
                <form action={markNextAction}>
                  <input type="hidden" name="userTitleId" value={userTitle.id} />
                  <Button>Mark next episode watched</Button>
                </form>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {["watchlist", "watching", "completed"].map((status) => (
                  <form key={status} action={addTitleAction}>
                    <input type="hidden" name="payload" value={JSON.stringify({ title, status, favorite: false })} />
                    <Button variant={status === "watchlist" ? "primary" : "secondary"}>Mark {status}</Button>
                  </form>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {title.type !== "movie" ? (
        <Card className="overflow-hidden">
          <div className="border-b border-[#33281F] p-4 font-semibold">Episodes</div>
          {episodes.length === 0 ? (
            <p className="p-4 text-[#A79B8E]">Episode metadata has not been loaded for this title yet.</p>
          ) : (
            <div className="divide-y divide-[#33281F]">
              {episodes.map((episode) => (
                <div key={episode.id} className="p-4">
                  <p className="font-medium">S{episode.seasonNumber} E{episode.episodeNumber} · {episode.name}</p>
                  <p className="text-sm text-[#A79B8E]">{episode.airDate ?? "No air date"}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      ) : null}
    </div>
  );
}
