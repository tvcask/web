// Central query-key factory so reads and cache updates never drift apart.
export const queryKeys = {
  library: (type: "show" | "movie", status?: string, favorite?: boolean) =>
    ["library", type, status ?? null, favorite ?? false] as const,
  catalog: (kind: string) => ["catalog", kind] as const,
  titleLists: (titleId: string) => ["title-lists", titleId] as const
};
