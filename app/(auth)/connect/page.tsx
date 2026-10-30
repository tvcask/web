import { api } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { SubmitButton } from "@/components/ui/submit-button";

async function decide(query: string, form: FormData) {
  "use server";
  const result = await api<{ redirectUrl: string }>("/v1/me/ai/consent", {
    method: "POST",
    body: { query, allow: form.get("decision") === "allow", allowWrite: form.get("allowWrite") === "on" },
  });
  redirect(result.redirectUrl);
}

export default async function Consent({ searchParams }: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) if (typeof value === "string") query.set(key, value);
  const encoded = query.toString();
  const user = await getCurrentUser();
  if (!user) redirect(`/login?returnTo=${encodeURIComponent("/connect?" + encoded)}`);
  let info: { clientName: string; redirectUri: string; scope?: string };
  try {
    info = await api("/v1/me/ai/consent?" + encoded);
  } catch {
    return <div className="surface mx-auto max-w-md rounded-2xl p-6 text-white">
      <h1 className="text-xl font-bold">This connection couldn’t be verified</h1>
      <p className="mt-3 text-sm text-white/60">Return to your assistant and start the connection again. No access has been granted.</p>
    </div>;
  }
  const canRequestWrite = info.scope?.split(/\s+/).includes("tvcask:write") ?? false;
  return (
    <div className="surface mx-auto max-w-md space-y-5 rounded-2xl p-6 text-white">
      <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent-text)]">Your library, connected</p>
      <h1 className="display text-2xl">Connect {info.clientName} to TVCask?</h1>
      <p className="text-sm text-white/60">Signed in as {user.email}</p>
      <div>
        <h2 className="text-sm font-bold">Read your library</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-white/70">
          <li>Watched, watching, watchlist and dropped titles</li>
          <li>Ratings, favorites, custom lists and episode progress</li>
          <li>Watch region and catalog information</li>
        </ul>
      </div>
      <form action={decide.bind(null, encoded)} className="space-y-5">
        {canRequestWrite && (
          <label className="flex cursor-pointer gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 has-[:checked]:border-[var(--accent)]">
            <input type="checkbox" name="allowWrite" className="mt-1 size-4 shrink-0 accent-[var(--accent)]" aria-describedby="write-access-description" />
            <span>
              <span className="block text-sm font-bold">Also allow library management</span>
              <span id="write-access-description" className="mt-1 block text-xs leading-5 text-white/60">
                Optional. Let this app change watch status and episode history, create and edit lists, add or remove titles from lists, publish lists, and delete lists. Changes are saved to your TVCask account.
              </span>
            </span>
          </label>
        )}
        <p className="text-sm leading-6 text-white/60">
          {canRequestWrite ? "Leave this unchecked for read-only access. " : "This application is requesting read-only access. "}
          Account and password changes are never allowed. You can disconnect at any time in Settings → AI connections.
        </p>
        <p className="break-all text-xs leading-5 text-white/45">
          Application names are supplied by the connecting application. Continue only if you recognize this callback: {info.redirectUri}
        </p>
        <div className="flex flex-wrap gap-3">
          <SubmitButton name="decision" value="allow" pendingLabel="Connecting…" className="rounded-full bg-[var(--accent-text)] px-5 py-3 text-sm font-bold text-black">
            {canRequestWrite ? "Allow selected access" : "Allow read access"}
          </SubmitButton>
          <button name="decision" value="deny" className="rounded-full border border-white/15 px-5 py-3 text-sm font-bold">Cancel</button>
        </div>
      </form>
    </div>
  );
}
