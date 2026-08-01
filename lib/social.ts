import { api, ApiError } from "@/lib/api";
import type { BadgesResult, LibraryPage, Stats } from "@/lib/data";

// Mirrors the API's userCard: the only shape another user is ever returned in.
// It deliberately has no email, because models.User is never serialized.
export type UserCard = {
  id: string;
  username: string;
  name: string;
  avatarUrl?: string;
  viewerFollows: boolean;
};

// Summary of someone's library, shown on their profile. The deeper views have
// their own endpoints under the same handle.
export type ProfileSummaryStats = {
  shows: number;
  movies: number;
  episodesWatched: number;
  completedTitles: number;
  tvTimeMinutes: number;
  movieTimeMinutes: number;
};

export type ProfileTitle = {
  id: string;
  title: string;
  type: string;
  year?: number;
  posterUrl?: string;
};

export type ProfileListSummary = {
  id: string;
  name: string;
  itemCount: number;
  titles: ProfileTitle[];
};

export type UserProfile = UserCard & {
  createdAt: string;
  followerCount: number;
  followingCount: number;
  viewerBlocked: boolean;
  isSelf: boolean;
  stats: ProfileSummaryStats;
  level: number;
  badgesEarned: number;
  favoriteShows: ProfileTitle[];
  favoriteMovies: ProfileTitle[];
  lists: ProfileListSummary[];
};

// Keyset paging: the cursor is opaque and only ever handed back as given.
export type UserPage = {
  items: UserCard[];
  nextCursor?: string;
};

export type FollowSide = "followers" | "following";

// A handle is a username or a user id; the API resolves both. Pages link by
// username because those URLs are shareable, notifications deep-link by id
// because usernames can change.
export async function getUserProfile(handle: string): Promise<UserProfile | null> {
  try {
    return await api<UserProfile>(`/v1/users/${encodeURIComponent(handle)}`);
  } catch (e) {
    // Hidden and missing users are both 404 by design, so there is nothing to
    // tell apart here. Anything else is a real failure and should surface.
    if (e instanceof ApiError && e.status === 404) {
      return null;
    }
    throw e;
  }
}

// The by-handle mirrors of the /v1/me reads. Same response shapes, so the
// components that render your own stats and badges render anyone else's.
export async function getUserStats(handle: string): Promise<Stats | null> {
  return byHandle<Stats>(`/v1/users/${encodeURIComponent(handle)}/stats`);
}

export async function getUserBadges(handle: string): Promise<BadgesResult | null> {
  return byHandle<BadgesResult>(`/v1/users/${encodeURIComponent(handle)}/badges`);
}

export async function getUserLibrary(
  handle: string,
  query: { type?: string; favorite?: boolean; limit?: number; offset?: number } = {}
): Promise<LibraryPage | null> {
  const params = new URLSearchParams();
  if (query.type) params.set("type", query.type);
  if (query.favorite) params.set("favorite", "true");
  if (query.limit != null) params.set("limit", String(query.limit));
  if (query.offset != null) params.set("offset", String(query.offset));
  const suffix = params.size ? `?${params}` : "";
  return byHandle<LibraryPage>(`/v1/users/${encodeURIComponent(handle)}/library${suffix}`);
}

// A hidden, blocked or missing account is 404 on every one of these, and they
// are meant to be indistinguishable. Anything else is a real failure.
async function byHandle<T>(path: string): Promise<T | null> {
  try {
    return await api<T>(path);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) {
      return null;
    }
    throw e;
  }
}

export async function getFollowList(handle: string, side: FollowSide, cursor?: string): Promise<UserPage> {
  const params = new URLSearchParams();
  if (cursor) {
    params.set("cursor", cursor);
  }
  const query = params.size ? `?${params}` : "";
  return api<UserPage>(`/v1/users/${encodeURIComponent(handle)}/${side}${query}`);
}
