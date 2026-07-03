import { normalizeTitle } from "@/lib/metadata/normalize";
import { getTmdbCollection, searchTmdb } from "@/lib/metadata/tmdb";
import { store, upsertTitle } from "@/lib/services/store";
import type { Title } from "@/lib/services/types";

export async function searchTitles(query: string) {
  const normalizedQuery = normalizeTitle(query);
  const local = store.titles.filter((title) => normalizeTitle(title.title).includes(normalizedQuery));
  if (normalizedQuery.length < 2) {
    return local.slice(0, 20);
  }

  const remote = await searchTmdb(query);
  remote.forEach(upsertTitle);

  const merged = new Map<string, Title>();
  [...local, ...remote].forEach((title) => merged.set(title.id, title));
  return [...merged.values()].slice(0, 24);
}

export async function matchTitle(title: string, year?: number) {
  const normalized = normalizeTitle(title);
  const exact = store.titles.find((item) => {
    const sameTitle = normalizeTitle(item.title) === normalized || normalizeTitle(item.originalTitle ?? "") === normalized;
    return sameTitle && (!year || item.year === year);
  });

  if (exact) {
    return { title: exact, confidence: year && exact.year === year ? 98 : 92 };
  }

  const remote = await searchTmdb(title);
  remote.forEach(upsertTitle);
  const remoteExact =
    remote.find((item) => normalizeTitle(item.title) === normalized && (!year || item.year === year)) ??
    remote.find((item) => normalizeTitle(item.title) === normalized) ??
    remote[0];

  if (!remoteExact) {
    return null;
  }

  return {
    title: remoteExact,
    confidence: normalizeTitle(remoteExact.title) === normalized ? (year && remoteExact.year === year ? 96 : 88) : 72
  };
}

export function getTitle(id: string) {
  return store.titles.find((title) => title.id === id);
}

export function getEpisodesForTitle(titleId: string) {
  return store.episodes.filter((episode) => episode.titleId === titleId);
}

export async function getDiscoverSections() {
  const sections = await Promise.all([
    getTmdbCollection("trending-tv"),
    getTmdbCollection("top-tv"),
    getTmdbCollection("trending-movies"),
    getTmdbCollection("top-movies")
  ]);
  sections.flat().forEach(upsertTitle);

  return [
    { title: "Top shows for you", items: sections[0] },
    { title: "Trending shows", items: sections[1] },
    { title: "Movies to track", items: sections[2] },
    { title: "Popular movies", items: sections[3] }
  ];
}
