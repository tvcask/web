"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileUp, Loader2 } from "lucide-react";
import type { ImportRecord } from "@/lib/data";
import { forgetActiveImport, readActiveImport, rememberActiveImport } from "@/components/import/active-import";

// 40MB — matches the API's maxUploadBytes. We upload straight to the Go API so the
// zip never hits Vercel (Server Actions/Route Handlers cap request bodies at 4.5MB).
const MAX_BYTES = 40 * 1024 * 1024;

type Phase = "idle" | "uploading" | "error";

export function TvTimeUpload({ apiBase, token, requestedId }: { apiBase: string; token: string; requestedId?: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(true);

  useEffect(() => {
    const activeId = readActiveImport();
    if (activeId && activeId !== requestedId) {
      router.replace(`/app/import?id=${encodeURIComponent(activeId)}`);
      return;
    }
    if (activeId && activeId === requestedId) {
      forgetActiveImport(activeId);
    }
    setRestoring(false);
  }, [requestedId, router]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const file = inputRef.current?.files?.[0];
    if (!file) {
      setError("Please choose your TV Time .zip file.");
      setPhase("error");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("That file is over 40MB. Make sure it's the TV Time export, not something else.");
      setPhase("error");
      return;
    }

    const body = new FormData();
    body.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${apiBase}/v1/me/import/tv-time`);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);

    xhr.upload.onprogress = (ev) => {
      if (ev.lengthComputable) {
        setProgress(Math.round((ev.loaded / ev.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const rec = JSON.parse(xhr.responseText) as ImportRecord;
        rememberActiveImport(rec.id);
        router.push(`/app/import?id=${rec.id}`);
        return;
      }
      // Surface the API's real error text instead of a generic "upload failed".
      const msg = apiErrorMessage(xhr.responseText, xhr.status);
      console.error("[import] upload failed", { status: xhr.status, body: xhr.responseText });
      setError(msg);
      setPhase("error");
    };

    xhr.onerror = () => {
      console.error("[import] upload network error", { status: xhr.status });
      setError("Couldn't reach the server. Check your connection and try again.");
      setPhase("error");
    };

    setPhase("uploading");
    setProgress(0);
    setError(null);
    xhr.send(body);
  }

  const uploading = phase === "uploading";

  if (restoring) {
    return (
      <div className="mt-6 flex items-center gap-2 text-sm text-white/50">
        <Loader2 className="size-4 animate-spin" /> Restoring your import…
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <label className="flex cursor-pointer flex-col items-center gap-2 rounded-[12px] border border-dashed border-white/20 px-4 py-8 text-center transition hover:border-white/40">
        <FileUp className="size-6 text-white/50" />
        <span className="max-w-full truncate text-sm font-semibold text-white">
          {fileName ?? "Choose your TV Time export ZIP"}
        </span>
        <span className="text-xs text-white/40">Official GDPR or TV Time Out .zip</span>
        <span className="mt-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold text-white">
          {fileName ? "Change file" : "Browse files"}
        </span>
        <input
          ref={inputRef}
          type="file"
          name="file"
          accept=".zip,application/zip"
          required
          disabled={uploading}
          onChange={(e) => {
            setFileName(e.target.files?.[0]?.name ?? null);
            if (phase === "error") setPhase("idle");
          }}
          className="sr-only"
        />
      </label>

      {phase === "error" && error ? (
        <p className="text-sm text-[#ef6d5a]">{error}</p>
      ) : null}

      {uploading ? (
        <div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full transition-all duration-200"
              style={{ width: `${progress}%`, background: "var(--accent)" }}
            />
          </div>
          <p className="mt-2 text-xs text-white/50">Uploading… {progress}%</p>
        </div>
      ) : (
        <button
          type="submit"
          className="h-11 w-full rounded-full text-sm font-bold"
          style={{ background: "var(--accent)", color: "var(--on-accent)" }}
        >
          Start import
        </button>
      )}
    </form>
  );
}

function apiErrorMessage(responseText: string, status: number): string {
  try {
    const parsed = JSON.parse(responseText) as { error?: string };
    if (parsed.error) return parsed.error;
  } catch {
    // not JSON — fall through
  }
  if (status === 413) return "That file is too large to upload. The export must be under 40MB.";
  if (status === 401) return "Your session expired. Refresh the page and try again.";
  return "Upload failed. Choose the official TV Time GDPR .zip or the TV Time Out .zip.";
}
