"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Loader2, Plus } from "lucide-react";
import { mutate } from "@/lib/mutate";
import { LIBRARY_IDS_KEY, useIsTracked, useSetTracked } from "@/lib/query/tracking";
import { toast } from "@/lib/toast";

// Optimistic "add to library" badge on posters (rails, search, browse). Derives
// tracked state from the shared library-ids Set, so untracking anywhere flips it.
export function AddToLibraryButton({
  titleId,
  title,
  tracked: initialTracked
}: {
  titleId: string;
  title: string;
  tracked: boolean;
}) {
  const queryClient = useQueryClient();
  const tracked = useIsTracked(titleId, initialTracked);
  const setTracked = useSetTracked();

  const add = useMutation({
    mutationFn: () => mutate("me/titles", "POST", { titleId, status: "watchlist" }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: LIBRARY_IDS_KEY });
      setTracked(titleId, true);
    },
    onError: () => {
      setTracked(titleId, false);
      toast("Couldn't add to your library. Try again.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: LIBRARY_IDS_KEY });
      queryClient.invalidateQueries({ queryKey: ["library"] });
    }
  });

  const badge = "cask-focus grid size-[30px] place-items-center rounded-[9px] bg-black/45";
  const style = { color: "var(--accent-text)", boxShadow: "inset 0 0 0 1.5px var(--accent)" } as const;

  if (tracked) {
    return (
      <span className={badge} style={style} aria-hidden>
        {add.isPending ? <Loader2 className="size-[15px] animate-spin" /> : <Check className="size-[15px]" />}
      </span>
    );
  }

  return (
    <button onClick={() => add.mutate()} className={badge} style={style} aria-label={`Add ${title}`}>
      <Plus className="size-[15px]" />
    </button>
  );
}
