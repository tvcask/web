import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { FileUp } from "lucide-react";
import {
  changePasswordAction,
  deleteAccountAction,
  endSession,
  setThemeAction,
  toggleSettingAction,
  updateProfileAction
} from "@/app/actions";
import { getCurrentUser } from "@/lib/auth/session";
import { getSettings } from "@/lib/data";
import { cn } from "@/lib/utils";

const nav = [
  { value: "account", label: "Account" },
  { value: "app", label: "App" },
  { value: "upcoming", label: "Upcoming" }
];

export default async function SettingsPage({
  searchParams
}: {
  searchParams: Promise<{ section?: string; saved?: string; error?: string }>;
}) {
  const [user, settings] = await Promise.all([getCurrentUser(), getSettings()]);
  const { section, saved, error } = await searchParams;
  const active = nav.some((n) => n.value === section) ? section! : "account";

  return (
    <div className="mx-auto grid max-w-[900px] gap-8 md:grid-cols-[200px_1fr]">
      <aside>
        <Link href="/app/profile" className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold text-white/50 hover:text-white">
          <ChevronLeft className="size-4" /> Profile
        </Link>
        <h1 className="display mb-4 text-xl text-white">Settings</h1>
        <nav className="flex flex-col gap-1">
          {nav.map((item) => (
            <Link
              key={item.value}
              href={`/app/settings?section=${item.value}`}
              className={cn(
                "rounded-[11px] px-3.5 py-2.5 text-sm font-semibold transition",
                active === item.value ? "bg-white/5 text-white" : "text-white/60 hover:text-white"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="max-w-[560px]">
        {active === "account" ? (
          <>
            <p className="eyebrow mb-2.5 px-0.5">Profile</p>
            <form action={updateProfileAction} className="surface mb-5 rounded-[14px] p-4">
              <label className="block text-[13px] font-semibold text-white/60">Display name</label>
              <input
                name="name"
                defaultValue={user?.name ?? ""}
                className="cask-focus mt-1.5 h-11 w-full rounded-[10px] bg-white/5 px-3.5 text-sm text-white outline-none"
              />
              <label className="mt-4 block text-[13px] font-semibold text-white/60">Avatar URL</label>
              <input
                name="avatarUrl"
                defaultValue={user?.avatarUrl ?? ""}
                placeholder="https://…"
                className="cask-focus mt-1.5 h-11 w-full rounded-[10px] bg-white/5 px-3.5 text-sm text-white outline-none placeholder:text-white/30"
              />
              {saved === "profile" ? <p className="mt-3 text-xs font-semibold text-[color:var(--accent-text)]">Profile saved.</p> : null}
              {error === "profile" ? <p className="mt-3 text-xs font-semibold text-[#ef6d5a]">Could not save profile.</p> : null}
              <button className="accent-fill mt-4 h-11 rounded-full px-6 text-sm font-extrabold">Save profile</button>
            </form>

            <p className="eyebrow mb-2.5 px-0.5">Identification</p>
            <div className="surface mb-5 overflow-hidden rounded-[14px]">
              <Row label="Email" value={user?.email ?? "—"} border={false} />
            </div>

            <p className="eyebrow mb-2.5 px-0.5">Import</p>
            <Link href="/app/import" className="surface mb-5 flex items-center gap-3 rounded-[14px] p-4 transition hover:bg-white/[0.04]">
              <FileUp className="size-5 text-white/50" />
              <div>
                <p className="text-sm font-bold text-white">Import from TV Time</p>
                <p className="text-xs text-white/45">Bring over your shows, movies and watched episodes.</p>
              </div>
            </Link>

            <p className="eyebrow mb-2.5 px-0.5">Change password</p>
            <form action={changePasswordAction} className="surface mb-5 rounded-[14px] p-4">
              <input
                name="currentPassword"
                type="password"
                placeholder="Current password"
                required
                className="cask-focus h-11 w-full rounded-[10px] bg-white/5 px-3.5 text-sm text-white outline-none placeholder:text-white/30"
              />
              <input
                name="newPassword"
                type="password"
                placeholder="New password (min 6)"
                required
                className="cask-focus mt-3 h-11 w-full rounded-[10px] bg-white/5 px-3.5 text-sm text-white outline-none placeholder:text-white/30"
              />
              {saved === "password" ? <p className="mt-3 text-xs font-semibold text-[color:var(--accent-text)]">Password changed.</p> : null}
              {error === "password" ? <p className="mt-3 text-xs font-semibold text-[#ef6d5a]">Current password is incorrect.</p> : null}
              <button className="mt-4 h-11 rounded-full border border-white/12 px-6 text-sm font-bold text-white">Update password</button>
            </form>

            <div className="flex gap-3">
              <form action={endSession} className="flex-1">
                <button className="accent-fill h-[52px] w-full rounded-full text-sm font-extrabold">Log out</button>
              </form>
              <form action={deleteAccountAction}>
                <button className="h-[52px] rounded-full border border-white/12 px-6 text-sm font-bold" style={{ color: "var(--accent-text)" }}>
                  Delete account
                </button>
              </form>
            </div>
          </>
        ) : null}

        {active === "app" ? (
          <>
            <p className="eyebrow mb-2.5 px-0.5">Theme</p>
            <div className="surface mb-5 overflow-hidden rounded-[14px]">
              {["dark", "light", "system"].map((theme, i, arr) => (
                <form key={theme} action={setThemeAction}>
                  <input type="hidden" name="theme" value={theme} />
                  <button className={cn("flex w-full items-center justify-between px-4 py-3.5 text-left", i < arr.length - 1 && "border-b border-white/[0.06]")}>
                    <span className="text-sm font-semibold capitalize text-white">{theme === "system" ? "Sync with device" : theme}</span>
                    <span
                      className="grid size-[21px] place-items-center rounded-full"
                      style={{ boxShadow: `inset 0 0 0 2px ${settings.theme === theme ? "var(--accent)" : "rgba(255,255,255,0.25)"}` }}
                    >
                      {settings.theme === theme ? <span className="size-[11px] rounded-full" style={{ background: "var(--accent)" }} /> : null}
                    </span>
                  </button>
                </form>
              ))}
            </div>
            <p className="eyebrow mb-2.5 px-0.5">Preferences</p>
            <div className="surface overflow-hidden rounded-[14px]">
              <Toggle label="Titles in your language" name="titlesInLanguage" on={settings.titlesInLanguage} border={false} />
            </div>
            <p className="mt-5 text-[11px] font-semibold uppercase tracking-wider text-white/35">Version 1.0.0</p>
          </>
        ) : null}

        {active === "upcoming" ? (
          <>
            <p className="eyebrow mb-2.5 px-0.5">Notifications</p>
            <div className="surface overflow-hidden rounded-[14px]">
              <Toggle label="New episode alerts" name="newEpisodeAlerts" on={settings.newEpisodeAlerts} />
              <Toggle label="Premiere reminders" name="premiereReminders" on={settings.premiereReminders} />
              <Toggle label="Weekly digest" name="weeklyDigest" on={settings.weeklyDigest} border={false} />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

function Row({ label, value, border = true }: { label: string; value: string; border?: boolean }) {
  return (
    <div className={cn("flex items-center justify-between px-4 py-3.5", border && "border-b border-white/[0.06]")}>
      <span className="text-[13.5px] text-white/50">{label}</span>
      <span className="truncate pl-4 text-[13.5px] font-semibold text-white">{value}</span>
    </div>
  );
}

function Toggle({ label, name, on, border = true }: { label: string; name: string; on: boolean; border?: boolean }) {
  return (
    <form action={toggleSettingAction}>
      <input type="hidden" name="key" value={name} />
      <button className={cn("flex w-full items-center justify-between px-4 py-3.5 text-left", border && "border-b border-white/[0.06]")}>
        <span className="text-[13.5px] font-semibold text-white">{label}</span>
        <span
          className="relative h-[27px] w-[46px] rounded-full transition"
          style={{ background: on ? "var(--accent)" : "rgba(255,255,255,0.15)" }}
        >
          <span
            className="absolute top-[3px] size-[21px] rounded-full bg-white transition-all"
            style={{ left: on ? "22px" : "3px" }}
          />
        </span>
      </button>
    </form>
  );
}
