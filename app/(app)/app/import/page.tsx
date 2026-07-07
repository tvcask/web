import Link from "next/link";
import { ChevronDown, ChevronLeft } from "lucide-react";
import { API_URL, getToken } from "@/lib/api";
import { getImport } from "@/lib/data";
import { ImportProgress } from "@/components/import/import-progress";
import { TvTimeUpload } from "@/components/import/tv-time-upload";

export default async function ImportPage({
  searchParams
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const record = id ? await getImport(id) : null;
  const token = await getToken();

  return (
    <div className="mx-auto max-w-[640px]">
      <Link href="/app/settings" className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold text-white/50 hover:text-white">
        <ChevronLeft className="size-4" /> Settings
      </Link>
      <h1 className="display mb-6 text-2xl text-white">Import from TV Time</h1>

      {record ? (
        <ImportProgress initial={record} />
      ) : (
        <div className="surface rounded-[16px] p-7">
          <p className="text-white/60">
            TV Time has no built-in export, so grab your history with the free{" "}
            <b className="text-white">TV Time Out</b> browser extension and upload the{" "}
            <b className="text-white">.zip</b> here. We&apos;ll match your shows and movies against TMDB and pull in every
            watched episode.
          </p>

          <details className="group mt-5 rounded-[12px] border border-white/[0.08] open:bg-white/[0.02]">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-bold text-white [&::-webkit-details-marker]:hidden">
              How do I export my TV Time data?
              <ChevronDown className="size-4 shrink-0 text-white/50 transition group-open:rotate-180" />
            </summary>
            <ol className="space-y-3 px-4 pb-4 text-sm text-white/60">
              <li>
                <span className="font-semibold text-white/80">1.</span> Install{" "}
                <a
                  href="https://chromewebstore.google.com/detail/tv-time-out-by-refract/pmejpdpjbkjklfceogdkolmgclldogbi"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-[color:var(--accent-text)] underline underline-offset-2"
                >
                  TV Time Out by Refract
                </a>{" "}
                from the Chrome Web Store (works in Chrome and Edge).
              </li>
              <li>
                <span className="font-semibold text-white/80">2.</span> Open{" "}
                <b className="text-white/80">app.tvtime.com</b> and log in.
              </li>
              <li>
                <span className="font-semibold text-white/80">3.</span> Click the extension icon, pick the{" "}
                <b className="text-white/80">JSON</b> format, and hit <b className="text-white/80">Export my data</b>.
              </li>
              <li>
                <span className="font-semibold text-white/80">4.</span> It saves a <b className="text-white/80">.zip</b> to
                your downloads — upload that file below.
              </li>
              <li className="border-t border-white/[0.06] pt-3 text-xs text-white/40">
                TV Time shuts down on July 15, 2026 and deletes all data, so export before then.
              </li>
            </ol>
          </details>

          <TvTimeUpload apiBase={API_URL} token={token ?? ""} />
        </div>
      )}
    </div>
  );
}
