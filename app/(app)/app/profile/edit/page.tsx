import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons';
import Link from "next/link";
import { updateProfileAction } from "@/app/actions";
import { getCurrentUser } from "@/lib/auth/session";
import { Avatar } from "@/components/ui/avatar";
import { PublicPageToggle } from "@/components/public-page/public-page-toggle";
import { getSettings } from "@/lib/data";

const INPUT_CLASS = "cask-focus mt-1.5 h-11 w-full rounded-[10px] bg-white/5 px-3.5 text-sm text-white outline-none";
const FIELD_ERRORS: Record<string, string> = {
  bio: "Bios are 160 characters at most, with links in the fields below.",
  instagram: "Enter just your Instagram username.",
  letterboxd: "Enter just your Letterboxd username.",
  website: "Your website must be an https link."
};

export default async function EditProfilePage({
  searchParams
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const [user, settings] = await Promise.all([getCurrentUser(), getSettings()]);
  const { saved, error } = await searchParams;

  return (
    <div className="mx-auto max-w-[600px]">
      <Link href="/app/profile" className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold text-white/50 hover:text-white">
        <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" /> Profile
      </Link>
      <h1 className="display mb-7 text-2xl text-white">Edit profile</h1>

      <form action={updateProfileAction} className="surface rounded-[16px] p-5">
        <div className="flex items-center gap-4">
          <Avatar src={user?.avatarUrl} name={user?.name} size={72} className="ring-2 ring-white/10" />
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
            title="3 to 20 characters: letters, numbers, or underscore"
            className="h-11 w-full rounded-r-[10px] bg-transparent pl-1 pr-3.5 text-sm text-white outline-none"
          />
        </div>
        <p className="mt-1.5 text-xs text-white/35">
          3 to 20 characters: letters, numbers, underscore. This is your public handle.
        </p>
        {error === "username" ? <p className="mt-2 text-xs font-semibold text-[#ef6d5a]">That username is taken.</p> : null}

        <label htmlFor="bio" className="mt-5 block text-[13px] font-semibold text-white/60">Bio</label>
        <textarea
          id="bio"
          name="bio"
          rows={2}
          maxLength={160}
          defaultValue={user?.bio ?? ""}
          placeholder="What you love to watch"
          className="cask-focus mt-1.5 w-full resize-none rounded-[10px] bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none"
        />

        <div className="mt-5 grid gap-x-3 sm:grid-cols-2">
          <div>
            <label htmlFor="instagram" className="block text-[13px] font-semibold text-white/60">Instagram</label>
            <input id="instagram" name="instagram" defaultValue={user?.instagram ?? ""} placeholder="username" className={INPUT_CLASS} />
          </div>
          <div className="mt-5 sm:mt-0">
            <label htmlFor="letterboxd" className="block text-[13px] font-semibold text-white/60">Letterboxd</label>
            <input id="letterboxd" name="letterboxd" defaultValue={user?.letterboxd ?? ""} placeholder="username" className={INPUT_CLASS} />
          </div>
        </div>
        <label htmlFor="website" className="mt-5 block text-[13px] font-semibold text-white/60">Website</label>
        <input id="website" name="website" defaultValue={user?.website ?? ""} placeholder="https://…" className={INPUT_CLASS} />
        <p className="mt-1.5 text-xs text-white/35">Your bio and links only appear on your public page.</p>

        {error && FIELD_ERRORS[error] ? <p className="mt-4 text-xs font-semibold text-[#ef6d5a]">{FIELD_ERRORS[error]}</p> : null}
        {saved ? <p className="mt-4 text-xs font-semibold text-[color:var(--accent-text)]">Profile saved.</p> : null}
        {error === "profile" ? <p className="mt-4 text-xs font-semibold text-[#ef6d5a]">Could not save profile.</p> : null}

        <button className="accent-fill mt-5 h-11 rounded-full px-6 text-sm font-extrabold">Save profile</button>
      </form>

      <PublicPageToggle
        initial={settings.publicPage ?? false}
        username={user?.username}
        isPrivate={settings.privateProfile ?? false}
        name={user?.name ?? "My page"}
      />
    </div>
  );
}
