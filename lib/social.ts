import { api, ApiError } from "@/lib/api";

// Mirrors the API's userCard: the only shape another user is ever returned in.
// It deliberately has no email, because models.User is never serialized.
export type UserCard = {
  id: string;
  username: string;
  name: string;
  avatarUrl?: string;
  viewerFollows: boolean;
};

export type UserProfile = UserCard & {
  createdAt: string;
  followerCount: number;
  followingCount: number;
  viewerBlocked: boolean;
  isSelf: boolean;
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

export async function getFollowList(handle: string, side: FollowSide, cursor?: string): Promise<UserPage> {
  const params = new URLSearchParams();
  if (cursor) {
    params.set("cursor", cursor);
  }
  const query = params.size ? `?${params}` : "";
  return api<UserPage>(`/v1/users/${encodeURIComponent(handle)}/${side}${query}`);
}
