import { Card } from "@/components/ui/card";
import { getUserId } from "@/lib/auth/session";
import { getStats } from "@/lib/services/stats-service";

export default async function StatsPage() {
  const userId = await getUserId();
  const stats = getStats(userId);
  const hours = Math.round(stats.estimatedWatchTimeMinutes / 60);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Stats</h1>
        <p className="mt-2 text-[#A79B8E]">Your watch history is safe.</p>
      </div>
      <Card className="p-6">
        <p className="text-2xl font-semibold">
          You imported {stats.titlesImported} titles and {stats.episodesWatched} watched episodes.
        </p>
        <p className="mt-2 text-[#A79B8E]">Estimated watch time: {hours} hours.</p>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Shows watched", stats.showsWatched],
          ["Movies watched", stats.moviesWatched],
          ["Completed titles", stats.completedTitles],
          ["Favorites", stats.favorites]
        ].map(([label, value]) => (
          <Card key={label} className="p-5">
            <p className="text-sm text-[#A79B8E]">{label}</p>
            <p className="mt-2 text-3xl font-semibold">{value}</p>
          </Card>
        ))}
      </div>
      <Card className="p-5">
        <h2 className="font-semibold">Most watched genres</h2>
        {stats.mostWatchedGenres.length === 0 ? (
          <p className="mt-3 text-[#A79B8E]">Genre stats will appear after tracked titles have real metadata.</p>
        ) : (
          <div className="mt-4 space-y-2">
            {stats.mostWatchedGenres.map(([genre, count]) => (
              <div key={genre} className="flex justify-between border-b border-[#33281F] py-2 text-sm">
                <span>{genre}</span>
                <span className="text-[#A79B8E]">{count}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
