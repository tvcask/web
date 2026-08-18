"use client";

import { useQuery } from "@tanstack/react-query";

import { apiGet } from "@/lib/query/client";
import { queryKeys } from "@/lib/query/keys";
import type { TitleCast } from "@/lib/services/types";

const CAST_STALE_TIME = 7 * 24 * 60 * 60_000;
const MAX_PENDING_CAST_RESPONSES = 3;

export function useTitleCast(titleId: string) {
  return useQuery({
    queryKey: queryKeys.titleCast(titleId),
    queryFn: () => apiGet<TitleCast>(`/api/v1/titles/${encodeURIComponent(titleId)}/cast`),
    enabled: titleId.length > 0,
    staleTime: (query) => (query.state.data?.status === "ready" ? CAST_STALE_TIME : 0),
    // The API's first request already waits briefly for a cache miss. Two
    // follow-ups cover normal enrichment without polling through an outage.
    refetchInterval: (query) =>
      query.state.data?.status === "pending" && query.state.dataUpdateCount < MAX_PENDING_CAST_RESPONSES
        ? 2_500
        : false
  });
}
