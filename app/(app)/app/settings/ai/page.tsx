import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { api, ApiError } from "@/lib/api";
import { SubmitButton } from "@/components/ui/submit-button";
import { CopyEndpoint } from "./copy-endpoint";

type Connections = {
  mcpUrl: string;
  items: { id: string; clientName: string; createdAt: string }[];
};
const docsURL = "https://developers.openai.com/plugins/deploy/connect-chatgpt";

async function disconnect(form: FormData) {
  "use server";
  const id = form.get("id");
  if (typeof id !== "string" || !/^[a-f0-9-]{36}$/.test(id)) return;
  try {
    await api(`/v1/me/ai/connections/${id}`, { method: "DELETE" });
  } catch {
    redirect("/app/settings/ai?error=disconnect");
  }
  revalidatePath("/app/settings/ai");
  redirect("/app/settings/ai?disconnected=1");
}

export default async function AIConnections({ searchParams }: {
  searchParams: Promise<{ disconnected?: string; error?: string }>;
}) {
  const params = await searchParams;
  let data: Connections | null = null;
  let unavailable = false;
  try {
    data = await api<Connections>("/v1/me/ai/connections");
  } catch (e) {
    unavailable = !(e instanceof ApiError && e.status === 404);
  }

  return (
    <div className="mx-auto max-w-[600px] space-y-6 pb-12">
      <Link href="/app/settings" className="inline-flex items-center gap-1.5 text-xs font-bold text-white/50 hover:text-white">
        <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" /> Settings
      </Link>
      <header>
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[var(--accent-text)]">Your library, connected</p>
        <h1 className="display text-3xl text-white">AI connections</h1>
        <p className="mt-3 text-sm leading-6 text-white/60">
          Better recommendations start with what you’ve already watched. Connect TVCask so your assistant can check your library every time you ask.
        </p>
        <span className="mt-4 inline-flex rounded-full bg-[var(--accent-text)]/10 px-3 py-1 text-xs font-bold text-[var(--accent-text)]">Read-only access</span>
      </header>

      {params.disconnected && <p role="status" className="rounded-xl border border-white/10 p-4 text-sm text-white/80">Disconnected. This application can no longer read your TVCask library.</p>}
      {params.error === "disconnect" && <p role="alert" className="rounded-xl border border-red-400/20 p-4 text-sm text-red-200">We couldn’t disconnect the application. Please try again.</p>}

      {!data ? (
        <section className="surface rounded-[14px] p-5">
          <h2 className="font-bold text-white">{unavailable ? "Connections are temporarily unavailable" : "AI connections are coming soon"}</h2>
          <p className="mt-2 text-sm leading-6 text-white/60">{unavailable ? "We couldn’t load your connection settings. Your library is still here; try again in a moment." : "Account linking hasn’t been enabled yet. Once it’s ready, your setup steps and connection address will appear here."}</p>
          {unavailable && <Link href="/app/settings/ai" className="mt-4 inline-flex text-sm font-bold text-[var(--accent-text)]">Try again</Link>}
        </section>
      ) : <>
        <section className="surface rounded-[14px] p-5 sm:p-6" aria-labelledby="connect-heading">
          <h2 id="connect-heading" className="text-lg font-bold text-white">Connect to ChatGPT</h2>
          <p className="mt-2 text-sm leading-6 text-white/60">Keep this page open while you set up TVCask in ChatGPT. Custom connections depend on your account and workspace permissions.</p>
          <ol className="mt-6 space-y-6">
            <Step number={1} title="Add a custom connection">
              Open ChatGPT’s Plugins page. Select <strong>+</strong>, then <strong>Add custom MCP server</strong>. Name it <strong>TVCask</strong>.
            </Step>
            <Step number={2} title="Paste your connection address">
              Choose a public server connection and paste this complete address. For authentication, select <strong>OAuth</strong>.
              <div className="mt-3"><CopyEndpoint value={data.mcpUrl} /></div>
              <p className="mt-2 text-xs text-white/45">You don’t need to copy a TVCask password, API key or login token into ChatGPT.</p>
            </Step>
            <Step number={3} title="Approve access in TVCask">
              Continue through ChatGPT’s connection prompt. Sign in to TVCask if asked, review the permissions and choose <strong>Allow read access</strong>. Finish creating and installing the plugin in ChatGPT.
            </Step>
            <Step number={4} title="Check your library in a new chat">
              Type <strong>@</strong>, select <strong>TVCask</strong>, then ask the question below. Compare the answer with your Watching list to confirm the connection works.
              <blockquote className="mt-3 rounded-xl border border-white/10 bg-black/15 p-4 text-white/85">“Use TVCask to show the series I’m currently watching and my progress.”</blockquote>
            </Step>
          </ol>
          <a href={docsURL} target="_blank" rel="noreferrer" className="mt-5 inline-flex text-xs font-bold text-[var(--accent-text)] hover:underline">Open ChatGPT’s official connection instructions ↗</a>
        </section>

        <section className="surface rounded-[14px] p-5 sm:p-6">
          <h2 className="font-bold text-white">Find your next watch</h2>
          <p className="mt-2 text-sm text-white/55">Once the library check works, try:</p>
          <blockquote className="mt-4 border-l-2 border-[var(--accent-text)] pl-4 text-sm leading-6 text-white/80">“Recommend three K-dramas based on my TVCask favorites. Check that I haven’t watched or dropped them, explain why each fits, and avoid spoilers.”</blockquote>
          <p className="mt-4 text-xs leading-5 text-white/45">Keep tracking shows in TVCask as usual. Your assistant reads your latest library when it calls TVCask; old messages won’t update automatically.</p>
        </section>

        <section aria-labelledby="connections-heading">
          <h2 id="connections-heading" className="mb-3 font-bold text-white">Connected applications</h2>
          {data.items.length === 0 ? (
            <div className="surface rounded-[14px] p-5"><p className="text-sm text-white/60">No applications connected yet.</p><p className="mt-1 text-xs leading-5 text-white/40">After approving access, refresh this page to see your connection.</p></div>
          ) : (
            <ul className="surface divide-y divide-white/10 rounded-[14px]">
              {data.items.map(item => <li key={item.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div className="min-w-0"><p className="break-words font-semibold text-white">{item.clientName}</p><p className="mt-1 text-xs text-white/50">Read access · Connected {new Date(item.createdAt).toLocaleDateString("en-GB")}</p></div>
                <form action={disconnect}>
                  <input type="hidden" name="id" value={item.id} />
                  <SubmitButton pendingLabel="Disconnecting…" aria-label={`Disconnect ${item.clientName}`} className="rounded-full border border-white/15 px-4 py-2 text-sm text-white hover:bg-white/5">Disconnect</SubmitButton>
                </form>
              </li>)}
            </ul>
          )}
          <p className="mt-3 text-xs leading-5 text-white/45">Disconnecting stops future access. It doesn’t delete information already shared in a chat. You can connect again whenever you want.</p>
        </section>
      </>}

      <section className="surface divide-y divide-white/10 rounded-[14px]" aria-label="Connection help">
        <Help title="What can my assistant see?">Your watched and watching titles, watchlist, ratings, favorites, lists, episode progress and watch region, plus the TVCask catalog. It cannot edit your library or account. Your TVCask password is never shared with the assistant.</Help>
        <Help title="I can’t find the custom connection option">Your ChatGPT account or workspace may not allow custom MCP servers. Check the official instructions above or ask your workspace administrator. TVCask doesn’t enable that option inside ChatGPT.</Help>
        <Help title="Connected, but the assistant doesn’t use my library">Start a new conversation and select TVCask with @ before asking. Explicitly ask it to read your TVCask library. If you signed out of all devices or changed your password, reconnect TVCask.</Help>
        <Help title="Can I use another AI assistant?">Yes, if it supports remote MCP over HTTP and OAuth account linking. Use the same server address and approve access through TVCask. Each application gets its own connection.</Help>
      </section>
    </div>
  );
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return <li className="flex gap-3"><span aria-hidden className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent-text)]/10 text-xs font-bold text-[var(--accent-text)]">{number}</span><div className="min-w-0 flex-1"><h3 className="pt-0.5 text-sm font-bold text-white">{title}</h3><div className="mt-2 text-sm leading-6 text-white/65">{children}</div></div></li>;
}
function Help({ title, children }: { title: string; children: React.ReactNode }) {
  return <details className="p-5"><summary className="cursor-pointer text-sm font-bold text-white/80">{title}</summary><p className="mt-3 text-sm leading-6 text-white/55">{children}</p></details>;
}
