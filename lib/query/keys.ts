// Central query-key factory so reads and cache updates never drift apart.
export const queryKeys = {
  library: (type: "show" | "movie", status?: string) => ["library", type, status ?? null] as const,
  catalog: (kind: string) => ["catalog", kind] as const,
  titleLists: (titleId: string) => ["title-lists", titleId] as const
};
