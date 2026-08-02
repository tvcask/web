"use client";

import { useInfiniteQuery, useMutation, useQuery, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { mutate } from "@/lib/mutate";
import { apiGet } from "@/lib/query/client";
import { queryKeys, socialPrefix } from "@/lib/query/keys";
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

// Query families a follow can touch. Cancelling and snapshotting is scoped to
// these: an unscoped cancelQueries() would abort every request in the app on
// each click.
const TOUCHED = [[socialPrefix.peopleSearch], [socialPrefix.followList], [socialPrefix.userProfile]] as const;

// Following someone changes their follower count, the viewer's own following
// count, and their card wherever it is currently rendered. Rather than
// invalidate and flash, patch each cache in place and roll the set back
// together if the write fails.
export function useToggleFollow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ user, following }: { user: UserCard; following: boolean }) =>
      following ? mutate(`me/following/${user.id}`, "POST") : mutate(`me/following/${user.id}`, "DELETE"),

    onMutate: async ({ user, following }) => {
      const step = following ? 1 : -1;
      await Promise.all(TOUCHED.map((queryKey) => queryClient.cancelQueries({ queryKey })));
      const snapshots = TOUCHED.flatMap((queryKey) => queryClient.getQueriesData({ queryKey }));

      queryClient.setQueriesData<{ items: UserCard[] }>({ queryKey: [socialPrefix.peopleSearch] }, (old) =>
        old
          ? {
              items: old.items.map((item) =>
                item.id === user.id ? { ...item, viewerFollows: following } : item
              )
            }
          : old
      );

      queryClient.setQueriesData<InfiniteData<UserPage>>({ queryKey: [socialPrefix.followList] }, (old) =>
        old
          ? {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                items: page.items.map((item) =>
                  item.id === user.id ? { ...item, viewerFollows: following } : item
                )
              }))
            }
          : old
      );

      // One pass over every cached profile. The target gains or loses a
      // follower; the viewer's own profile, whichever handle it is cached
      // under, gains or loses a following. Deriving both from isSelf avoids
      // having to be told who the viewer is.
      queryClient.setQueriesData<UserProfile>({ queryKey: [socialPrefix.userProfile] }, (old) => {
        if (!old) {
          return old;
        }
        if (old.id === user.id) {
          return { ...old, viewerFollows: following, followerCount: Math.max(0, old.followerCount + step) };
        }
        if (old.isSelf) {
          return { ...old, followingCount: Math.max(0, old.followingCount + step) };
        }
        return old;
      });

      return { snapshots };
    },

    onError: (_error, _vars, context) => {
      context?.snapshots.forEach(([key, data]) => queryClient.setQueryData(key, data));
      toast("Couldn't update. Try again.");
    }
  });
}
