import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon, ArrowLeft01Icon, ArrowRight01Icon, FileUploadIcon } from '@hugeicons/core-free-icons';
import Link from "next/link";
import {
  changePasswordAction,
  deleteAccountAction,
  logoutEverywhereAction,
  resendVerificationAction,
  updateWatchRegionAction
} from "@/app/actions";
import { getCurrentUser } from "@/lib/auth/session";
import { getCatalogStatus, getSettings } from "@/lib/data";
import { WATCH_REGIONS } from "@/lib/regions";
import { NotificationToggles } from "@/components/settings/notification-toggles";
import { ConfirmButton } from "@/components/ui/confirm-button";
import { PasswordInput } from "@/components/ui/password-input";
import { SubmitButton } from "@/components/ui/submit-button";
import { site } from "@/lib/site";
import packageJson from "@/package.json";

const { version } = packageJson;

export default async function SettingsPage({
  searchParams
}: {
  searchParams: Promise<{ saved?: string; error?: string; verify?: string }>;
}) {
  const [user, catalog, settings] = await Promise.all([getCurrentUser(), getCatalogStatus(), getSettings()]);
  const { saved, error, verify } = await searchParams;

  return (
    <div className="mx-auto max-w-[600px]">
      <Link href="/app/profile" className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold text-white/50 hover:text-white">
        <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" /> Profile
      </Link>
      <h1 className="display mb-7 text-2xl text-white">Settings</h1>

      <Section title="Account">
        <div className="surface overflow-hidden rounded-[14px]">
          <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3.5">
            <span className="truncate text-sm font-semibold text-white">{user?.email ?? "—"}</span>
            {user?.emailVerified ? (
              <span className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ background: "rgba(224,169,96,0.12)", color: "var(--accent-text)" }}>
                Verified
              </span>
            ) : (
              <span className="shrink-0 rounded-full bg-white/8 px-2.5 py-1 text-[11px] font-bold text-white/50">Unverified</span>
            )}
          </div>
          {!user?.emailVerified ? (
            <form action={resendVerificationAction} className="border-b border-white/[0.06] px-4 pb-3.5">
              {verify === "sent" ? (
                <Note tone="ok">Verification email sent. Check your inbox.</Note>
              ) : (
                <SubmitButton
                  pendingLabel="Sending…"
                  className="h-10 rounded-full border border-white/12 px-5 text-sm font-bold text-white hover:bg-white/5"
                >
                  Resend verification email
                </SubmitButton>
              )}
            </form>
          ) : null}
          <SettingsLink href="/app/profile/edit" label="Edit profile" />
          <details className="group border-t border-white/[0.06]">
            <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3.5 transition hover:bg-white/[0.025]">
              <span className="text-sm font-bold text-white">Security</span>
              <HugeiconsIcon icon={ArrowDown01Icon} className="size-4 text-white/35 transition group-open:rotate-180" />
            </summary>
            <div className="border-t border-white/[0.06] bg-white/[0.012] p-4">
              <form action={changePasswordAction}>
                <PasswordInput
                  name="currentPassword"
                  placeholder="Current password"
                  required
                  inputClassName="h-10 rounded-[10px] border border-white/[0.06] bg-white/[0.04] px-3.5 pr-11 text-sm text-white placeholder:text-white/30 focus:border-white/15"
                />
                <PasswordInput
                  name="newPassword"
                  placeholder="New password (min 6)"
                  required
                  className="mt-3"
                  inputClassName="h-10 rounded-[10px] border border-white/[0.06] bg-white/[0.04] px-3.5 pr-11 text-sm text-white placeholder:text-white/30 focus:border-white/15"
                />
                {saved === "password" ? <Note tone="ok">Password changed.</Note> : null}
                {error === "password" ? <Note tone="err">Current password is incorrect.</Note> : null}
                <button className="mt-4 h-10 rounded-full border border-white/12 px-5 text-sm font-bold text-white transition hover:bg-white/[0.05]">Update password</button>
              </form>
              <form action={logoutEverywhereAction} className="mt-4 border-t border-white/[0.06] pt-3">
                <ConfirmButton
                  message="Sign out of every device? You'll need to log in again."
                  className="text-sm font-semibold text-white/55 transition hover:text-white"
                >
                  Log out of all devices
                </ConfirmButton>
              </form>
            </div>
          </details>
        </div>
      </Section>

      {/* Preferences */}
      <Section title="Preferences">
        <form action={updateWatchRegionAction} className="surface rounded-[14px] p-4">
          <label htmlFor="watchRegion" className="text-sm font-bold text-white">Watch region</label>
          <p className="mt-1 text-xs leading-5 text-white/45">Controls which streaming services appear on title pages.</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <select
                id="watchRegion"
                name="watchRegion"
                defaultValue={settings.watchRegion || "US"}
                className="h-11 w-full appearance-none rounded-[10px] border border-white/10 bg-[#151518] px-3 pr-10 text-sm font-semibold text-white outline-none transition focus:border-white/20"
              >
                {WATCH_REGIONS.map((region) => (
                  <option key={region.code} value={region.code}>{region.flag} {region.name}</option>
                ))}
              </select>
              <HugeiconsIcon icon={ArrowDown01Icon} className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-white/45" />
            </div>
            <SubmitButton pendingLabel="Saving…" className="h-11 rounded-full border border-white/12 px-5 text-sm font-bold text-white hover:bg-white/5 sm:shrink-0">
              Save
            </SubmitButton>
          </div>
          {saved === "region" ? <Note tone="ok">Watch region updated.</Note> : null}
          {error === "region" ? <Note tone="err">Could not update watch region.</Note> : null}
        </form>
      </Section>

      {/* Notifications */}
      <Section title="Notifications">
        <NotificationToggles
          initial={{ newEpisodeAlerts: settings.newEpisodeAlerts ?? true, badgeAlerts: settings.badgeAlerts ?? true }}
        />
      </Section>

      {/* Import */}
      <Section title="Import">
        <Link href="/app/import" className="surface flex items-center gap-3 rounded-[14px] p-4 transition hover:bg-white/[0.04]">
          <HugeiconsIcon icon={FileUploadIcon} className="size-5 text-white/50" />
          <div>
            <p className="text-sm font-bold text-white">Import from TV Time</p>
            <p className="text-xs text-white/45">Bring over your shows, movies and watched episodes.</p>
          </div>
        </Link>
      </Section>

      {/* Catalog */}
      {catalog?.lastUpdatedAt ? (
        <Section title="Catalog">
          <div className="surface rounded-[14px]">
            <StatusRow label="Data updated" value={timeAgo(catalog.lastUpdatedAt)} border={false} />
          </div>
        </Section>
      ) : null}

      <Section title="About">
        <div className="surface overflow-hidden rounded-[14px]">
          <SettingsLink href="/terms" label="Terms of Service" />
          <SettingsLink href="/privacy" label="Privacy Policy" border />
          <SettingsLink href="/guidelines" label="Community Guidelines" border />
          <SettingsLink href="/about" label="About tvcask" border />
          <SettingsLink href="/support" label="Support" border />
          <SettingsLink href={site.feedback} label="Feedback & bug reports" border external />
        </div>
      </Section>

      <Section title="Data sources & credits">
        <div className="surface overflow-hidden rounded-[14px]">
          <SettingsLink href={site.tmdb} label="The Movie Database (TMDB)" external />
          <SettingsLink href={site.tvdb} label="TheTVDB episode metadata" border external />
          <SettingsLink href={site.justwatch} label="JustWatch availability" border external />
        </div>
      </Section>

      {/* Danger zone */}
      <Section title="Danger zone">
        <details className="group surface overflow-hidden rounded-[14px]">
          <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3.5">
            <span className="text-sm font-bold text-[#ef6d5a]">Delete account</span>
            <HugeiconsIcon icon={ArrowDown01Icon} className="size-4 text-white/40 transition group-open:rotate-180" />
          </summary>
          <div className="border-t border-white/[0.06] px-4 py-4">
            <p className="text-sm leading-6 text-white/50">
              This permanently deletes your account and all your tracking data. This can&apos;t be undone.
            </p>
            <form action={deleteAccountAction} className="mt-4">
              <ConfirmButton
                message="Delete your account and all your tracking data? This cannot be undone."
                className="h-11 rounded-full border border-[#ef6d5a]/40 px-6 text-sm font-bold text-[#ef6d5a] transition hover:bg-[#ef6d5a]/10"
              >
                Delete my account
              </ConfirmButton>
            </form>
          </div>
        </details>
      </Section>

      <p className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-white/35">Version {version}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <p className="eyebrow mb-2.5 px-0.5">{title}</p>
      {children}
    </section>
  );
}

function SettingsLink({ href, label, border = false, external = false }: { href: string; label: string; border?: boolean; external?: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-between px-4 py-3.5 transition hover:bg-white/[0.04] ${border ? "border-t border-white/[0.06]" : ""}`}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      <span className="text-sm font-bold text-white">{label}</span>
      <HugeiconsIcon icon={ArrowRight01Icon} className="size-4 text-white/35" />
    </Link>
  );
}

function Note({ tone, children }: { tone: "ok" | "err"; children: React.ReactNode }) {
  return (
    <p className={`mt-3 text-xs font-semibold ${tone === "ok" ? "text-[color:var(--accent-text)]" : "text-[#ef6d5a]"}`}>
      {children}
    </p>
  );
}

function StatusRow({ label, value, bad = false, border = true }: { label: string; value: string; bad?: boolean; border?: boolean }) {
  return (
    <div className={`flex items-center justify-between px-4 py-3 ${border ? "border-b border-white/[0.06]" : ""}`}>
      <span className="text-[13px] text-white/50">{label}</span>
      <span className={`text-[13px] font-semibold ${bad ? "text-[#ef6d5a]" : "text-white"}`}>{value}</span>
    </div>
  );
}

function timeAgo(iso: string): string {
  const secs = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (secs < 60) return "just now";
  const mins = Math.round(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}
