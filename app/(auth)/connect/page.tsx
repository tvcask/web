import { api } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { SubmitButton } from "@/components/ui/submit-button";
async function decide(query: string, form: FormData) {
 "use server";
 const result = await api<{redirectUrl: string}>("/v1/me/ai/consent", {method: "POST", body: {query, allow: form.get("decision") === "allow"}});
 redirect(result.redirectUrl);
}
export default async function Consent({searchParams}: {searchParams: Promise<Record<string,string|string[]|undefined>>}) {
 const params=await searchParams;
 const query=new URLSearchParams();
 for(const [key,value] of Object.entries(params)) if(typeof value === "string") query.set(key,value);
 const encoded=query.toString();
 const user=await getCurrentUser();
 if(!user) redirect(`/login?returnTo=${encodeURIComponent("/connect?"+encoded)}`);
 let info: {clientName: string; redirectUri: string};
 try {info=await api("/v1/me/ai/consent?"+encoded);} catch {return <div className="surface mx-auto max-w-md rounded-2xl p-6 text-white"><h1 className="text-xl font-bold">This connection couldn’t be verified</h1><p className="mt-3 text-sm text-white/60">Return to your assistant and start the connection again. No access has been granted.</p></div>;}
 return <div className="surface mx-auto max-w-md space-y-5 rounded-2xl p-6 text-white"><p className="text-xs font-bold uppercase tracking-widest text-[var(--accent-text)]">Connect to TVCask</p><h1 className="text-2xl font-bold">Allow {info.clientName} to read your library?</h1><p className="text-sm text-white/60">Signed in as {user.email}</p><ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-white/75"><li>Watched, watching, watchlist and dropped titles</li><li>Ratings, favorites, lists and episode progress</li><li>Watch region and catalog information</li></ul><p className="text-sm text-white/60">It cannot edit your library or account. You can disconnect it in Settings → AI connections.</p><p className="break-all text-xs text-white/45">Application names are supplied by the connecting application. Continue only if you recognize this callback: {info.redirectUri}</p><form action={decide.bind(null,encoded)} className="flex flex-wrap gap-3"><SubmitButton name="decision" value="allow" pendingLabel="Connecting…" className="rounded-full bg-[var(--accent-text)] px-5 py-3 text-sm font-bold text-black">Allow read access</SubmitButton><button name="decision" value="deny" className="rounded-full border border-white/15 px-5 py-3 text-sm font-bold">Cancel</button></form></div>;
}
