import { Card } from "@/components/ui/card";
import { Poster } from "@/components/titles/poster";
import { getUserId } from "@/lib/auth/session";
import { getCalendar } from "@/lib/services/calendar-service";

export default async function CalendarPage() {
  const userId = await getUserId();
  const calendar = getCalendar(userId);
  const sections = [
    ["Today", calendar.today],
    ["This Week", calendar.thisWeek],
    ["Upcoming", calendar.upcoming]
  ] as const;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Calendar</h1>
        <p className="mt-2 text-[#A79B8E]">Upcoming episodes from tracked shows once episode metadata is loaded.</p>
      </div>
      {sections.every(([, items]) => items.length === 0) ? (
        <Card className="p-6 text-[#A79B8E]">No upcoming episodes yet. Import history and load real episode metadata to populate the calendar.</Card>
      ) : (
        sections.map(([label, items]) => (
          <section key={label} className="space-y-3">
            <h2 className="text-xl font-semibold">{label}</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {items.map((episode) => (
                <Card key={episode.id} className="grid grid-cols-[64px_1fr] gap-4 p-3">
                  <Poster src={episode.title?.posterUrl} title={episode.title?.title ?? "Episode"} />
                  <div>
                    <p className="font-semibold">{episode.title?.title}</p>
                    <p className="text-sm text-[#A79B8E]">S{episode.seasonNumber} E{episode.episodeNumber} · {episode.name}</p>
                    <p className="mt-1 text-sm text-[#F0A85A]">{episode.airDate}</p>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
