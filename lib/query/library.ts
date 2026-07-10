"use client";

import { useInfiniteQuery, useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { mutate } from "@/lib/mutate";
import { apiGet } from "@/lib/query/client";
import { queryKeys } from "@/lib/query/keys";
import { toast } from "@/lib/toast";
import type { LibraryPage } from "@/lib/data";
import type { UserTitleWithTitle } from "@/lib/services/types";

const PAGE = 40;

type LibraryArgs = {
  type: "show" | "movie";
  status?: string;
  favorite?: boolean;
  initial: UserTitleWithTitle[];
  total: number;
};

// Infinite library list, seeded from the server render so the first page is
// instant and never refetched on mount.
export function useLibrary({ type, status, favorite, initial, total }: LibraryArgs) {
  return useInfiniteQuery({
    queryKey: queryKeys.library(type, status, favorite),
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams({ type, limit: String(PAGE), offset: String(pageParam) });
      if (status) {
        params.set("status", status);
      }
      if (favorite) {
        params.set("favorite", "true");
      }
      return apiGet<LibraryPage>(`/api/library?${params}`);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((n, page) => n + page.items.length, 0);
      if (lastPage.items.length === 0 || loaded >= (lastPage.total ?? total)) {
        return undefined;
      }
      return loaded;
    },
    initialData: {
      pageParams: [0],
      pages: [{ items: initial, total, limit: initial.length, offset: 0 }]
    }
  });
}

function withoutItem(data: InfiniteData<LibraryPage> | undefined, id: string) {
  if (!data) {
    return data;
  }
  return {
    ...data,
    pages: data.pages.map((page) => ({ ...page, items: page.items.filter((item) => item.id !== id) }))
  };
}

// Optimistically drop a title from a library list; RQ restores the snapshot on
// failure. Used both by "mark movie watched" and by the up-next completion.
export function useCompleteFromLibrary(type: "show" | "movie", status?: string, favorite?: boolean) {
  const queryClient = useQueryClient();
  const key = queryKeys.library(type, status, favorite);

  function removeLocally(id: string) {
    queryClient.setQueryData<InfiniteData<LibraryPage>>(key, (old) => withoutItem(old, id));
  }

  const markComplete = useMutation({
    mutationFn: (item: UserTitleWithTitle) =>
      mutate(`me/titles/${item.title.id}`, "PATCH", { status: "completed" }),
    onMutate: async (item) => {
      await queryClient.cancelQueries({ queryKey: key });
      const prev = queryClient.getQueryData<InfiniteData<LibraryPage>>(key);
      removeLocally(item.id);
      return { prev };
    },
    onError: (_error, _item, context) => {
      if (context?.prev) {
        queryClient.setQueryData(key, context.prev);
      }
      toast("Couldn't save your change. Try again.");
    }
  });

  return { markComplete, removeLocally };
}
