"use client";

import { useInfiniteQuery, useMutation, useQuery, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { mutate } from "@/lib/mutate";
import { apiGet } from "@/lib/query/client";
import { queryKeys } from "@/lib/query/keys";
import { toast } from "@/lib/toast";
import type { FollowSide, UserCard, UserPage, UserProfile } from "@/lib/social";

// The API rejects anything shorter, so there is no point spending a request.
export const MIN_SEARCH_CHARS = 2;

export function usePeopleSearch(query: string) {
  const trimmed = query.trim();
  return useQuery({
    queryKey: queryKeys.peopleSearch(trimmed),
    queryFn: () => apiGet<{ items: UserCard[] }>(`/api/v1/users/search?q=${encodeURIComponent(trimmed)}`),
    enabled: trimmed.length >= MIN_SEARCH_CHARS,
    // Results churn slowly and people retype the same handle constantly.
    staleTime: 30_000
  });
}

export function useFollowList(handle: string, side: FollowSide, initial: UserPage) {
  return useInfiniteQuery({
    queryKey: queryKeys.followList(handle, side),
    queryFn: ({ pageParam }) => {
      const query = pageParam ? `?cursor=${encodeURIComponent(pageParam)}` : "";
      return apiGet<UserPage>(`/api/v1/users/${encodeURIComponent(handle)}/${side}${query}`);
    },
    initialPageParam: "",
    // An absent cursor is the end of the list, which is what the API omits it for.
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
    initialData: { pageParams: [""], pages: [initial] }
  });
}

// Following someone changes their follower count, the viewer's following count,
// and their card wherever it is currently rendered. Rather than invalidate and
// flash, patch each cache in place and roll the whole set back together.
export function useToggleFollow(handle?: string) {
  const queryClient = useQueryClient();

  function patchCard(user: UserCard, following: boolean): UserCard {
    return { ...user, viewerFollows: following };
  }

  return useMutation({
    mutationFn: ({ user, following }: { user: UserCard; following: boolean }) =>
      following ? mutate(`me/following/${user.id}`, "POST") : mutate(`me/following/${user.id}`, "DELETE"),

    onMutate: async ({ user, following }) => {
      await queryClient.cancelQueries();
      const snapshot = queryClient.getQueriesData({ queryKey: ["people-search"] });
      const listSnapshot = queryClient.getQueriesData({ queryKey: ["follow-list"] });
      const profileKey = queryKeys.userProfile(user.username);
      const previousProfile = queryClient.getQueryData<UserProfile>(profileKey);

      queryClient.setQueriesData<{ items: UserCard[] }>({ queryKey: ["people-search"] }, (old) =>
        old ? { items: old.items.map((item) => (item.id === user.id ? patchCard(item, following) : item)) } : old
      );

      queryClient.setQueriesData<InfiniteData<UserPage>>({ queryKey: ["follow-list"] }, (old) =>
        old
          ? {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                items: page.items.map((item) => (item.id === user.id ? patchCard(item, following) : item))
              }))
            }
          : old
      );

      queryClient.setQueryData<UserProfile>(profileKey, (old) =>
        old
          ? { ...old, viewerFollows: following, followerCount: Math.max(0, old.followerCount + (following ? 1 : -1)) }
          : old
      );

      // The viewer's own following count moved too, if their profile is open.
      if (handle) {
        queryClient.setQueryData<UserProfile>(queryKeys.userProfile(handle), (old) =>
          old?.isSelf
            ? { ...old, followingCount: Math.max(0, old.followingCount + (following ? 1 : -1)) }
            : old
        );
      }

      return { snapshot, listSnapshot, previousProfile, profileKey };
    },

    onError: (_error, _vars, context) => {
      context?.snapshot.forEach(([key, data]) => queryClient.setQueryData(key, data));
      context?.listSnapshot.forEach(([key, data]) => queryClient.setQueryData(key, data));
      if (context?.previousProfile) {
        queryClient.setQueryData(context.profileKey, context.previousProfile);
      }
      toast("Couldn't update. Try again.");
    }
  });
}
