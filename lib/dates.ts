import type { Calendar, CalendarEpisode } from "@/lib/data";

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Air dates from the catalog are plain calendar dates ("2026-07-14").
 * `new Date("2026-07-14")` would read that as midnight UTC, which renders as
 * the wrong day for anyone west of Greenwich. Parse it as a local date.
 */
export function parseDate(iso: string): Date {
  if (DATE_ONLY.test(iso)) {
    const [year, month, day] = iso.split("-").map(Number);
    return new Date(year, month - 1, day);
  }
  return new Date(iso);
}

/** "2026-07-14" for the current calendar date where this code runs. */
export function localDate(d: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** "Wed 15 Jul" */
export function formatAirDate(iso: string): string {
  return parseDate(iso).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

const LATER_CAP = 40;

/**
 * Buckets the flat episode list into Today / This week / Later by comparing
 * date strings against the local calendar date. Air dates are plain dates, so
 * only the viewer's device can decide what "today" means. The API's own groups
 * are computed in UTC and drift near midnight. Older API deployments have no
 * `episodes` field and their server-side groups pass through untouched.
 */
export function groupCalendar(data: Calendar): Calendar {
  if (!data.episodes) {
    return data;
  }

  const today = localDate();
  const end = new Date();
  end.setDate(end.getDate() + 7);
  const weekEnd = localDate(end);

  const todayList: CalendarEpisode[] = [];
  const thisWeek: CalendarEpisode[] = [];
  const later: CalendarEpisode[] = [];
  for (const episode of data.episodes) {
    const d = episode.airDate;
    if (!d) {
      continue;
    }
    if (d === today) {
      todayList.push(episode);
    } else if (d > today && d <= weekEnd) {
      thisWeek.push(episode);
    } else if (d > weekEnd && later.length < LATER_CAP) {
      later.push(episode);
    }
  }
  return { today: todayList, thisWeek, later, episodes: data.episodes };
}
