// Central query-key factory so reads and cache updates never drift apart.
export const queryKeys = {
  library: (type: "show" | "movie", status?: string, favorite?: boolean) =>
    ["library", type, status ?? null, favorite ?? false] as const,
  catalog: (kind: string) => ["catalog", kind] as const,
  titleCast: (titleId: string) => ["title", titleId, "cast"] as const,
  titleLists: (titleId: string) => ["title-lists", titleId] as const,
  notifications: ["notifications"] as const,
  peopleSearch: (query: string) => [socialPrefix.peopleSearch, query] as const,
  userProfile: (handle: string) => [socialPrefix.userProfile, handle] as const,
  followList: (handle: string, side: "followers" | "following") =>
    [socialPrefix.followList, handle, side] as const,
  feed: () => [socialPrefix.feed] as const
};

// Prefixes, so a partial-match invalidation cannot drift from the keys it is
// meant to match. Following someone patches every one of these families.
export const socialPrefix = {
  peopleSearch: "people-search",
  userProfile: "user-profile",
  followList: "follow-list",
  feed: "activity-feed"
} as const;
