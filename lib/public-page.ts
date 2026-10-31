import { api, ApiError } from "@/lib/api";

export { publicListPath, publicPagePath } from "@/lib/public-page-paths";

export type PublicTitle = { id: string; title: string; type: string; year?: number; posterUrl?: string };

export type PublicOwner = {
  username: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
  instagram?: string;
  letterboxd?: string;
  website?: string;
};

export type PublicListSummary = { id: string; name: string; itemCount: number; titles: PublicTitle[] };

export type PublicProfile = PublicOwner & { lists: PublicListSummary[] };

export type PublicList = {
  id: string;
  name: string;
  description?: string;
  itemCount: number;
  owner: PublicOwner;
  titles: PublicTitle[];
};

async function orNull<T>(path: string): Promise<T | null> {
  try {
    return await api<T>(path, { auth: false });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export const getPublicProfile = (handle: string) =>
  orNull<PublicProfile>(`/v1/public/users/${encodeURIComponent(handle)}`);

export const getPublicList = (id: string) => orNull<PublicList>(`/v1/public/lists/${encodeURIComponent(id)}`);

export function socialLinks(owner: PublicOwner): { label: string; href: string }[] {
  const links: { label: string; href: string }[] = [];
  if (owner.letterboxd) links.push({ label: "Letterboxd", href: `https://letterboxd.com/${encodeURIComponent(owner.letterboxd)}/` });
  if (owner.instagram) links.push({ label: "Instagram", href: `https://www.instagram.com/${encodeURIComponent(owner.instagram)}/` });
  // The API only stores https links. Checked again here because this ends up in an
  // href on a page anyone can open.
  if (owner.website?.startsWith("https://")) {
    links.push({ label: new URL(owner.website).hostname.replace(/^www\./, ""), href: owner.website });
  }
  return links;
}
