"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
    staleTime: 30_000
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

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => mutate(`me/notifications/${id}/read`, "PATCH"),
    onMutate: (id) => {
      queryClient.setQueryData<NotificationsPage>(queryKeys.notifications, (page) => markReadInCache(page, id));
    },
    onSettled: () => void queryClient.invalidateQueries({ queryKey: queryKeys.notifications })
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => mutate("me/notifications/read-all", "POST"),
    onMutate: () => {
      queryClient.setQueryData<NotificationsPage>(queryKeys.notifications, (page) => markReadInCache(page));
    },
    onSettled: () => void queryClient.invalidateQueries({ queryKey: queryKeys.notifications })
  });
}
