import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons';
import Link from "next/link";
import { createListAction } from "@/app/actions";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

export default function NewListPage() {
  return (
    <div className="mx-auto max-w-[620px]">
      <Link href="/app/profile" className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold text-white/50 hover:text-white">
        <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" /> Profile
      </Link>
      <h1 className="display mb-7 text-2xl text-white">New list</h1>

      <form action={createListAction} className="surface rounded-[16px] p-5">
        <label className="block">
          <span className="eyebrow">Name</span>
          <Input name="name" required maxLength={120} placeholder="Weekend watches" className="mt-2 rounded-[10px]" />
        </label>
        <label className="mt-4 block">
          <span className="eyebrow">Description</span>
          <textarea
            name="description"
            maxLength={500}
            rows={4}
            placeholder="Optional"
            className="cask-focus mt-2 w-full resize-none rounded-[10px] border border-[#241f19] bg-[#16130f] px-4 py-3 text-sm text-[#F3EDE4] outline-none transition placeholder:text-[#6f665c] focus:border-[#E0A960]"
          />
        </label>
        <label className="mt-4 flex items-center gap-3 text-sm font-semibold text-white/70">
          <input name="isPublic" type="checkbox" className="size-4 accent-[#E0A960]" />
          Public list
        </label>
        <div className="mt-6 flex gap-3">
          <SubmitButton pendingLabel="Creating..." className="accent-fill h-10 rounded-full px-5 text-[13.5px] font-bold">
            Create list
          </SubmitButton>
          <Link href="/app/profile" className="inline-flex h-10 items-center rounded-full border border-white/12 px-5 text-[13.5px] font-bold text-white">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
