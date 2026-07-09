"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, ListPlus, Loader2, Plus } from "lucide-react";
import { mutate } from "@/lib/mutate";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

type TitleList = {
  id: string;
  name: string;
  itemCount: number;
  containsTitle: boolean;
};

export function TitleListMembership({ titleId }: { titleId: string }) {
  const router = useRouter();
  const [lists, setLists] = useState<TitleList[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    let alive = true;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/v1/me/titles/${titleId}/lists`);
        const data = (await res.json()) as { lists?: TitleList[] };
        if (alive) {
          setLists(
            (data.lists ?? [])
              .filter((list) => list.id && list.name)
              .map((list) => ({ ...list, itemCount: Number(list.itemCount ?? 0) }))
          );
        }
      } catch {
        if (alive) setLists([]);
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => {
      alive = false;
    };
  }, [titleId]);

  const selected = useMemo(() => lists.filter((list) => list.containsTitle), [lists]);
  const orderedLists = useMemo(
    () => [...lists].sort((a, b) => Number(b.containsTitle) - Number(a.containsTitle)),
    [lists]
  );

  async function toggle(list: TitleList) {
    const nextContains = !list.containsTitle;
    const previous = lists;
    setSaving(list.id);
    setLists((current) =>
      current.map((item) =>
        item.id === list.id
          ? {
              ...item,
              containsTitle: nextContains,
              itemCount: Math.max(0, item.itemCount + (nextContains ? 1 : -1))
            }
          : item
      )
    );
    try {
      if (nextContains) {
        await mutate(`me/lists/${list.id}/items`, "POST", { titleId });
      } else {
        await mutate(`me/lists/${list.id}/items/${titleId}`, "DELETE");
      }
      router.refresh();
    } catch {
      setLists(previous);
      toast("Couldn't update lists. Try again.");
    } finally {
      setSaving(null);
    }
  }

  async function createList() {
    const name = newName.trim();
    if (!name) return;
    setCreating(true);
    try {
      const res = await fetch("/api/v1/me/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description: "", isPublic: false })
      });
      if (!res.ok) throw new Error(await res.text());
      const list = (await res.json()) as TitleList;
      await mutate(`me/lists/${list.id}/items`, "POST", { titleId });
      setLists((current) => [{ ...list, itemCount: 1, containsTitle: true }, ...current]);
      setNewName("");
      setOpen(true);
      router.refresh();
    } catch {
      toast("Couldn't create this list. Try again.");
    } finally {
      setCreating(false);
    }
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
            {loading
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
          {loading ? (
            <div className="flex items-center gap-2 py-2 text-sm font-semibold text-white/45">
              <Loader2 className="size-4 animate-spin" /> Loading lists
            </div>
          ) : lists.length > 0 ? (
            <div className="max-h-[230px] space-y-1 overflow-y-auto pr-1 sm:max-h-[280px]">
              {orderedLists.map((list) => (
                <button
                  key={list.id}
                  type="button"
                  disabled={saving === list.id}
                  onClick={() => toggle(list)}
                  className="flex min-h-11 w-full items-center gap-3 rounded-[10px] px-2.5 py-2 text-left transition hover:bg-white/[0.04] disabled:opacity-60"
                >
                  <span
                    className={cn(
                      "grid size-5 shrink-0 place-items-center rounded-full border transition",
                      list.containsTitle ? "border-transparent accent-fill" : "border-white/20 text-transparent"
                    )}
                  >
                    {saving === list.id ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3" />}
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
              disabled={creating || !newName.trim()}
              onClick={createList}
              className="grid size-10 shrink-0 place-items-center rounded-full border border-white/12 text-white/70 transition hover:bg-white/5 hover:text-white disabled:opacity-40"
              aria-label="Create list"
            >
              {creating ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
