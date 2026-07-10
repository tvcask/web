"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mutate } from "@/lib/mutate";
import { apiGet } from "@/lib/query/client";
import { queryKeys } from "@/lib/query/keys";
import { toast } from "@/lib/toast";

export type TitleList = {
  id: string;
  name: string;
  itemCount: number;
  containsTitle: boolean;
};

export function useTitleLists(titleId: string) {
  return useQuery({
    queryKey: queryKeys.titleLists(titleId),
    queryFn: async () => {
      const data = await apiGet<{ lists?: TitleList[] }>(`/api/v1/me/titles/${titleId}/lists`);
      return (data.lists ?? [])
        .filter((list) => list.id && list.name)
        .map((list) => ({ ...list, itemCount: Number(list.itemCount ?? 0) }));
    }
  });
}

export function useToggleListMembership(titleId: string) {
  const queryClient = useQueryClient();
  const key = queryKeys.titleLists(titleId);

  return useMutation({
    mutationFn: ({ list, nextContains }: { list: TitleList; nextContains: boolean }) =>
      nextContains
        ? mutate(`me/lists/${list.id}/items`, "POST", { titleId })
        : mutate(`me/lists/${list.id}/items/${titleId}`, "DELETE"),
    onMutate: async ({ list, nextContains }) => {
      await queryClient.cancelQueries({ queryKey: key });
      const prev = queryClient.getQueryData<TitleList[]>(key);
      queryClient.setQueryData<TitleList[]>(key, (old) =>
        (old ?? []).map((item) =>
          item.id === list.id
            ? {
                ...item,
                containsTitle: nextContains,
                itemCount: Math.max(0, item.itemCount + (nextContains ? 1 : -1))
              }
            : item
        )
      );
      return { prev };
    },
    onError: (_error, _vars, context) => {
      if (context?.prev) {
        queryClient.setQueryData(key, context.prev);
      }
      toast("Couldn't update lists. Try again.");
    }
  });
}

export function useCreateList(titleId: string) {
  const queryClient = useQueryClient();
  const key = queryKeys.titleLists(titleId);

  return useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch("/api/v1/me/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description: "", isPublic: false })
      });
      if (!res.ok) {
        throw new Error(await res.text());
      }
      const list = (await res.json()) as TitleList;
      await mutate(`me/lists/${list.id}/items`, "POST", { titleId });
      return list;
    },
    onSuccess: (list) => {
      queryClient.setQueryData<TitleList[]>(key, (old) => [
        { ...list, itemCount: 1, containsTitle: true },
        ...(old ?? [])
      ]);
    },
    onError: () => toast("Couldn't create this list. Try again.")
  });
}
