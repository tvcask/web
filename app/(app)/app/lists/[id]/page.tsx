import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Trash2 } from "lucide-react";
import { deleteListAction, removeListItemAction, updateListAction } from "@/app/actions";
import { AddTitleToList } from "@/components/lists/add-title-to-list";
import { Poster } from "@/components/titles/poster";
import { ConfirmButton } from "@/components/ui/confirm-button";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { getList } from "@/lib/data";

export default async function ListPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const [{ id }, { saved }] = await Promise.all([params, searchParams]);
  const list = await getList(id);
  if (!list) notFound();

  return (
    <div className="mx-auto max-w-[980px] space-y-6">
      <Link href="/app/profile" className="inline-flex items-center gap-1.5 text-xs font-bold text-white/50 hover:text-white">
        <ChevronLeft className="size-4" /> Profile
      </Link>

      <section className="surface rounded-[16px] p-5">
        <div className="flex flex-col gap-5 lg:flex-row">
          <form action={updateListAction} className="min-w-0 flex-1">
            <input type="hidden" name="listId" value={list.id} />
            <label className="block">
              <span className="eyebrow">Name</span>
              <Input name="name" required maxLength={120} defaultValue={list.name} className="mt-2 rounded-[10px]" />
            </label>
            <label className="mt-4 block">
              <span className="eyebrow">Description</span>
              <textarea
                name="description"
                maxLength={500}
                rows={4}
                defaultValue={list.description ?? ""}
                placeholder="Optional"
                className="cask-focus mt-2 w-full resize-none rounded-[10px] border border-[#241f19] bg-[#16130f] px-4 py-3 text-sm text-[#F3EDE4] outline-none transition placeholder:text-[#6f665c] focus:border-[#E0A960]"
              />
            </label>
            <label className="mt-4 flex items-center gap-3 text-sm font-semibold text-white/70">
              <input name="isPublic" type="checkbox" defaultChecked={list.isPublic} className="size-4 accent-[#E0A960]" />
              Public list
            </label>
            {saved ? <p className="mt-4 text-sm font-semibold text-[#A7D28D]">Saved.</p> : null}
            <div className="mt-5">
              <SubmitButton pendingLabel="Saving..." className="accent-fill h-10 rounded-full px-5 text-[13.5px] font-bold">
                Save changes
              </SubmitButton>
            </div>
          </form>

          <div className="lg:w-[240px]">
            <p className="eyebrow">Titles</p>
            <p className="display mt-2 text-3xl text-white">{list.items.length.toLocaleString()}</p>
            {list.importedFrom ? <p className="mt-2 text-sm font-semibold text-white/40">Imported from TV Time</p> : null}
            <form action={deleteListAction} className="mt-6">
              <input type="hidden" name="listId" value={list.id} />
              <ConfirmButton
                message="Delete this list? Titles and watch history stay in your library."
                className="inline-flex h-10 items-center gap-2 rounded-full border border-[#ef6d5a]/40 px-4 text-sm font-bold text-[#ef6d5a] transition hover:bg-[#ef6d5a]/10"
              >
                <Trash2 className="size-4" /> Delete list
              </ConfirmButton>
            </form>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="display text-lg text-white">Titles</h2>
          <span className="text-xs font-bold text-white/40">Custom order</span>
        </div>
        <div className="mb-5">
          <AddTitleToList listId={list.id} existingTitleIds={list.items.map((item) => item.titleId)} />
        </div>
        {list.items.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {list.items.map((item) => (
              <div key={item.id} className="group">
                <Link href={`/app/titles/${item.title.id}?returnTo=/app/lists/${list.id}`} className="block overflow-hidden rounded-[14px] lift">
                  <Poster src={item.title.posterUrl} title={item.title.title} className="rounded-[14px]" />
                </Link>
                <div className="mt-2 flex items-start gap-2">
                  <p className="min-w-0 flex-1 truncate text-sm font-bold text-white">{item.title.title}</p>
                  <form action={removeListItemAction}>
                    <input type="hidden" name="listId" value={list.id} />
                    <input type="hidden" name="titleId" value={item.titleId} />
                    <ConfirmButton
                      message="Remove this title from the list?"
                      className="grid size-7 place-items-center rounded-full text-white/35 transition hover:bg-white/5 hover:text-white"
                      aria-label={`Remove ${item.title.title}`}
                    >
                      <Trash2 className="size-4" />
                    </ConfirmButton>
                  </form>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="surface rounded-[14px] p-6">
            <p className="text-sm text-white/55">This list is empty.</p>
          </div>
        )}
      </section>
    </div>
  );
}
