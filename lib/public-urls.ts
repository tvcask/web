// Every public link to a title or person goes through here, so the readable URLs
// can't drift. The trailing number is what identifies the page, and the words are
// for people: a renamed show keeps working and redirects to its new slug.

export type TitleKind = "shows" | "movies";

type TitleRef = { id: string; title: string };
type PersonRef = { id: string | number; name: string };

const MEDIA_BY_KIND: Record<TitleKind, string> = { shows: "tv", movies: "movie" };

export function slugify(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const withId = (name: string, id: string | number) => [slugify(name), id].filter(Boolean).join("-");
const trailingId = (slug: string) => slug.match(/(?:^|-)(\d+)$/)?.[1];

/** Falls back to the id route for anything that isn't a TMDB title id. */
export function publicTitlePath({ id, title }: TitleRef): string {
  const match = id.match(/^tmdb-(tv|movie)-(\d+)$/);
  if (!match) return `/titles/${id}`;
  return `/${match[1] === "tv" ? "shows" : "movies"}/${withId(title, match[2])}`;
}

export function titleIdFromSlug(kind: TitleKind, slug: string): string | null {
  const id = trailingId(slug);
  return id ? `tmdb-${MEDIA_BY_KIND[kind]}-${id}` : null;
}

export const publicPersonPath = ({ id, name }: PersonRef) => `/people/${withId(name, id)}`;
export const personIdFromSlug = (slug: string) => trailingId(slug) ?? null;
