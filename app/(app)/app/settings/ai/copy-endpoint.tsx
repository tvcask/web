"use client";
import { useState } from "react";
export function CopyEndpoint({value}: {value: string}) {
 const [message, setMessage] = useState("");
 return <div><div className="flex flex-wrap gap-2"><input aria-label="MCP server address" readOnly value={value} onFocus={e=>e.target.select()} className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm text-white"/><button type="button" className="rounded-xl bg-[var(--accent-text)] px-4 py-3 text-sm font-bold text-black" onClick={async()=>{try{await navigator.clipboard.writeText(value);setMessage("Copied");}catch{setMessage("Select the address and copy it manually.");}}}>Copy address</button></div><p role="status" className="mt-2 text-xs text-white/60">{message}</p></div>;
}
