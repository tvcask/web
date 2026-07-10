"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, ListPlus, Loader2, Plus } from "lucide-react";
import { useCreateList, useTitleLists, useToggleListMembership, type TitleList } from "@/lib/query/lists";
import { cn } from "@/lib/utils";

export function TitleListMembership({ titleId }: { titleId: string }) {
  const { data: lists = [], isLoading } = useTitleLists(titleId);
  const toggle = useToggleListMembership(titleId);
  const create = useCreateList(titleId);
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState("");

  const selected = useMemo(() => lists.filter((list) => list.containsTitle), [lists]);
  const orderedLists = useMemo(
    () => [...lists].sort((a, b) => Number(b.containsTitle) - Number(a.containsTitle)),
    [lists]
  );

  const savingId = toggle.isPending ? toggle.variables?.list.id : null;

  function createList() {
    const name = newName.trim();
    if (!name) {
      return;
    }
    create.mutate(name, {
      onSuccess: () => {
        setNewName("");
        setOpen(true);
      }
    });
  }

  return (
    <section className="rounded-[14px] border border-white/[0.08] bg-white/[0.03] p-3.5">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center gap-3 text-left"
        aria-expanded={open}
      >
        <div className="grid size-9 shrink-0 place-items-center rounded-full bg-white/6 text-white/70">
          <ListPlus className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-white">Lists</p>
          <p className="truncate text-xs font-semibold text-white/45">
            {isLoading
              ? "Loading..."
              : selected.length > 0
                ? `In ${selected.map((list) => list.name).join(", ")}`
                : lists.length > 0
                  ? "Add this title to a list"
                  : "Create your first list"}
          </p>
        </div>
        <ChevronDown className={cn("size-4 shrink-0 text-white/35 transition", open && "rotate-180")} />
      </button>

      {open ? (
        <div className="mt-3 space-y-3 border-t border-white/[0.06] pt-3">
          {isLoading ? (
            <div className="flex items-center gap-2 py-2 text-sm font-semibold text-white/45">
              <Loader2 className="size-4 animate-spin" /> Loading lists
            </div>
          ) : lists.length > 0 ? (
            <div className="max-h-[230px] space-y-1 overflow-y-auto pr-1 sm:max-h-[280px]">
              {orderedLists.map((list) => (
                <button
                  key={list.id}
                  type="button"
                  disabled={savingId === list.id}
                  onClick={() => toggle.mutate({ list, nextContains: !list.containsTitle })}
                  className="flex min-h-11 w-full items-center gap-3 rounded-[10px] px-2.5 py-2 text-left transition hover:bg-white/[0.04] disabled:opacity-60"
                >
                  <span
                    className={cn(
                      "grid size-5 shrink-0 place-items-center rounded-full border transition",
                      list.containsTitle ? "border-transparent accent-fill" : "border-white/20 text-transparent"
                    )}
                  >
                    {savingId === list.id ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-white">{list.name}</span>
                    <span className="text-xs font-semibold text-white/35">{list.itemCount.toLocaleString()} titles</span>
                  </span>
                </button>
              ))}
            </div>
          ) : null}

          <div className="flex gap-2">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") createList();
              }}
              maxLength={120}
              placeholder="New list"
              className="cask-focus h-10 min-w-0 flex-1 rounded-full border border-[#241f19] bg-[#16130f] px-3.5 text-sm text-[#F3EDE4] outline-none transition placeholder:text-[#6f665c] focus:border-[#E0A960]"
            />
            <button
              type="button"
              disabled={create.isPending || !newName.trim()}
              onClick={createList}
              className="grid size-10 shrink-0 place-items-center rounded-full border border-white/12 text-white/70 transition hover:bg-white/5 hover:text-white disabled:opacity-40"
              aria-label="Create list"
            >
              {create.isPending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
