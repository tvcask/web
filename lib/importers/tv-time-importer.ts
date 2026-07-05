import type { ParsedEpisode, ParsedImport, ParsedTitle } from "@/lib/services/types";

export type UploadedFile = {
  name: string;
  type?: string;
  text(): Promise<string>;
};

export interface Importer {
  canParse(file: UploadedFile): Promise<boolean>;
  parse(file: UploadedFile): Promise<ParsedImport>;
}

function coerceTitle(row: Record<string, unknown>): ParsedTitle | null {
  const title =
    row.title ??
    row.name ??
    row.show ??
    row.movie ??
    row.series ??
    row["Title"] ??
    row["Name"] ??
    row["Show"];

  if (!title || typeof title !== "string") {
    return null;
  }

  const yearValue = row.year ?? row.release_year ?? row["Year"];
  const statusValue = String(row.status ?? row.state ?? row["Status"] ?? "watching").toLowerCase();
  const typeValue = String(row.type ?? row.kind ?? row["Type"] ?? "unknown").toLowerCase();
  const listValue = row.list ?? row.lists ?? row.collection ?? row.collections ?? row["List"] ?? row["Lists"];
  const listNames =
    typeof listValue === "string"
      ? listValue
          .split(/[;,|]/)
          .map((item) => item.trim())
          .filter(Boolean)
      : Array.isArray(listValue)
        ? listValue.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
        : undefined;

  return {
    sourceId: typeof row.id === "string" ? row.id : undefined,
    title,
    originalTitle: typeof row.originalTitle === "string" ? row.originalTitle : undefined,
    type: typeValue.includes("movie") ? "movie" : typeValue.includes("anime") ? "anime" : typeValue.includes("tv") || typeValue.includes("show") ? "tv" : "unknown",
    year: typeof yearValue === "number" ? yearValue : typeof yearValue === "string" ? Number(yearValue.slice(0, 4)) || undefined : undefined,
    status:
      statusValue.includes("complete") || statusValue.includes("watched")
        ? "completed"
        : statusValue.includes("drop")
          ? "dropped"
          : statusValue.includes("plan") || statusValue.includes("watchlist")
            ? "watchlist"
            : "watching",
    favorite: Boolean(row.favorite ?? row.favorited),
    rating: typeof row.rating === "number" ? row.rating : typeof row.rating === "string" ? Number(row.rating) || undefined : undefined,
    listNames
  };
}

function coerceEpisode(row: Record<string, unknown>): ParsedEpisode | null {
  const title = row.title ?? row.name ?? row.show ?? row.series ?? row["Title"] ?? row["Show"];
  if (!title || typeof title !== "string") {
    return null;
  }

  const season = row.seasonNumber ?? row.season ?? row["Season"];
  const episode = row.episodeNumber ?? row.episode ?? row["Episode"];
  return {
    title,
    seasonNumber: Number(season) || undefined,
    episodeNumber: Number(episode) || undefined,
    watchedAt: typeof row.watchedAt === "string" ? row.watchedAt : typeof row.date === "string" ? row.date : undefined
  };
}

function parseCsv(text: string) {
  const [headerLine, ...lines] = text.split(/\r?\n/).filter(Boolean);
  const headers = headerLine.split(",").map((header) => header.trim().replace(/^"|"$/g, ""));
  return lines.map((line) => {
    const values = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) ?? [];
    return Object.fromEntries(headers.map((header, index) => [header, values[index]?.trim().replace(/^"|"$/g, "") ?? ""]));
  });
}

function walk(value: unknown, rows: Record<string, unknown>[] = []) {
  if (Array.isArray(value)) {
    value.forEach((item) => walk(item, rows));
  } else if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (coerceTitle(record) || coerceEpisode(record)) {
      rows.push(record);
    }
    Object.values(record).forEach((child) => walk(child, rows));
  }
  return rows;
}

export const tvTimeImporter: Importer = {
  async canParse(file) {
    return /\.(json|csv)$/i.test(file.name) || file.type?.includes("json") || file.type?.includes("csv") || false;
  },
  async parse(file) {
    const body = await file.text();
    const rows = file.name.endsWith(".csv") ? parseCsv(body) : walk(JSON.parse(body));
    const titles = rows.map(coerceTitle).filter(Boolean) as ParsedTitle[];
    const episodes = rows.map(coerceEpisode).filter(Boolean) as ParsedEpisode[];

    const uniqueTitles = new Map<string, ParsedTitle>();
    titles.forEach((title) => uniqueTitles.set(`${title.title}-${title.year ?? ""}`, title));

    return {
      source: "tv_time",
      titles: [...uniqueTitles.values()],
      episodes,
      rawMetadata: {
        filename: file.name,
        detectedRows: rows.length
      }
    };
  }
};
