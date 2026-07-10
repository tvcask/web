"use client";

import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet } from "@/lib/query/client";

// Single source of truth for "which titles are in my library": one cached Set of
// title IDs, fetched once. Every poster derives its tracked state from it, and
// tracking/untracking anywhere updates the one Set — so all of them stay in sync.
export const LIBRARY_IDS_KEY = ["library-ids"] as const;

export function useLibraryIds() {
  return useQuery({
    queryKey: LIBRARY_IDS_KEY,
    queryFn: async () => {
      const data = await apiGet<{ ids: string[] }>("/api/v1/me/tracked-ids");
      return new Set(data.ids ?? []);
    },
    staleTime: 60_000
  });
}

// Falls back to the server-rendered value until the Set loads, so there's no flash.
export function useIsTracked(titleId: string, initial: boolean) {
  const { data } = useLibraryIds();
  return data ? data.has(titleId) : initial;
}

export function useSetTracked() {
  const queryClient = useQueryClient();
  return useCallback(
    (titleId: string, value: boolean) => {
      queryClient.setQueryData<Set<string>>(LIBRARY_IDS_KEY, (old) => {
        const next = new Set(old ?? []);
        if (value) {
          next.add(titleId);
        } else {
          next.delete(titleId);
        }
        return next;
      });
    },
    [queryClient]
  );
}
