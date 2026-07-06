import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { updateProfileAction } from "@/app/actions";
import { getCurrentUser } from "@/lib/auth/session";
import { Avatar } from "@/components/ui/avatar";

export default async function EditProfilePage({
  searchParams
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const user = await getCurrentUser();
  const { saved, error } = await searchParams;

  return (
    <div className="mx-auto max-w-[600px]">
      <Link href="/app/profile" className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold text-white/50 hover:text-white">
        <ChevronLeft className="size-4" /> Profile
      </Link>
      <h1 className="display mb-7 text-2xl text-white">Edit profile</h1>

      <form action={updateProfileAction} className="surface rounded-[16px] p-5">
        <div className="flex items-center gap-4">
          <Avatar src={user?.avatarUrl} size={72} className="ring-2 ring-white/10" />
          <div className="min-w-0 flex-1">
            <label className="block text-[13px] font-semibold text-white/60">Avatar URL</label>
            <input
              name="avatarUrl"
              defaultValue={user?.avatarUrl ?? ""}
              placeholder="https://…"
              className="cask-focus mt-1.5 h-11 w-full rounded-[10px] bg-white/5 px-3.5 text-sm text-white outline-none placeholder:text-white/30"
            />
          </div>
        </div>

        <label className="mt-5 block text-[13px] font-semibold text-white/60">Display name</label>
        <input
          name="name"
          defaultValue={user?.name ?? ""}
          className="cask-focus mt-1.5 h-11 w-full rounded-[10px] bg-white/5 px-3.5 text-sm text-white outline-none"
        />

        <label className="mt-5 block text-[13px] font-semibold text-white/60">Username</label>
        <div className="mt-1.5 flex items-center rounded-[10px] bg-white/5 focus-within:ring-2 focus-within:ring-[color:var(--accent)]/35">
          <span className="pl-3.5 text-sm font-semibold text-white/40">@</span>
          <input
            name="username"
            defaultValue={user?.username ?? ""}
            pattern="[a-zA-Z0-9_]{3,20}"
            title="3–20 characters: letters, numbers, or underscore"
            className="h-11 w-full rounded-r-[10px] bg-transparent pl-1 pr-3.5 text-sm text-white outline-none"
          />
        </div>
        <p className="mt-1.5 text-xs text-white/35">
          3–20 characters: letters, numbers, underscore. This is your public handle.
        </p>
        {error === "username" ? <p className="mt-2 text-xs font-semibold text-[#ef6d5a]">That username is taken.</p> : null}

        {saved ? <p className="mt-4 text-xs font-semibold text-[color:var(--accent-text)]">Profile saved.</p> : null}
        {error === "profile" ? <p className="mt-4 text-xs font-semibold text-[#ef6d5a]">Could not save profile.</p> : null}

        <button className="accent-fill mt-5 h-11 rounded-full px-6 text-sm font-extrabold">Save profile</button>
      </form>
    </div>
  );
}
