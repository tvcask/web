"use client";

import { useInfiniteQuery, useMutation, useQuery, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { mutate } from "@/lib/mutate";
import { apiGet } from "@/lib/query/client";
import { queryKeys } from "@/lib/query/keys";

export type NotificationItem = {
  id: string;
  type: string;
  title: string;
  body: string;
  actionPath: string;
  imageUrl: string;
  badgeKey?: string;
  badgeArt?: string;
  badgeTier?: string;
  readAt?: string | null;
  createdAt: string;
};

export type NotificationsPage = {
  items: NotificationItem[];
  unreadCount: number;
  nextCursor?: string;
};

export function useNotifications() {
  return useQuery({
    queryKey: queryKeys.notifications,
    queryFn: () => apiGet<NotificationsPage>("/api/v1/me/notifications"),
    staleTime: 30_000,
    refetchInterval: 60_000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: "always"
  });
}

export function useInfiniteNotifications() {
  return useInfiniteQuery({
    queryKey: [...queryKeys.notifications, "infinite"],
    queryFn: ({ pageParam }) =>
      apiGet<NotificationsPage>(
        `/api/v1/me/notifications${pageParam ? `?before=${encodeURIComponent(pageParam)}` : ""}`
      ),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextCursor
  });
}

// Patch the cached page instead of refetching, so the row and the bell count
// update the instant the user clicks.
function markReadInCache(page: NotificationsPage | undefined, id?: string): NotificationsPage | undefined {
  if (!page) {
    return page;
  }
  const now = new Date().toISOString();
  const items = page.items.map((n) => (n.readAt || (id && n.id !== id) ? n : { ...n, readAt: now }));
  const unreadCount = id ? Math.max(0, page.unreadCount - 1) : 0;
  return { ...page, items, unreadCount };
}

function updateNotificationCaches(queryClient: ReturnType<typeof useQueryClient>, id?: string) {
  queryClient.setQueryData<NotificationsPage>(queryKeys.notifications, (page) => markReadInCache(page, id));
  queryClient.setQueryData<InfiniteData<NotificationsPage, string | undefined>>(
    [...queryKeys.notifications, "infinite"],
    (data) =>
      data
        ? { ...data, pages: data.pages.map((page) => markReadInCache(page, id) ?? page) }
        : data
  );
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => mutate(`me/notifications/${id}/read`, "PATCH"),
    onMutate: (id) => {
      updateNotificationCaches(queryClient, id);
    },
    onSettled: () => void queryClient.invalidateQueries({ queryKey: queryKeys.notifications })
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => mutate("me/notifications/read-all", "POST"),
    onMutate: () => {
      updateNotificationCaches(queryClient);
    },
    onSettled: () => void queryClient.invalidateQueries({ queryKey: queryKeys.notifications })
  });
}
