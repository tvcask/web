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
            Upload the official <b className="text-white">TV Time GDPR .zip</b> and
            we&apos;ll bring over your shows, movies, watched episodes, favorites,
            and custom lists. The JSON export from the TV Time Out extension is
            supported too.
          </p>

          <details open className="group mt-5 rounded-[12px] border border-white/[0.08] open:bg-white/[0.02]">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-bold text-white [&::-webkit-details-marker]:hidden">
              Official TV Time export
              <ChevronDown className="size-4 shrink-0 text-white/50 transition group-open:rotate-180" />
            </summary>
            <ol className="space-y-3 px-4 pb-4 text-sm text-white/60">
              <li>
                <span className="font-semibold text-white/80">1.</span> Open the{" "}
                <a
                  href="https://gdpr.tvtime.com/gdpr/self-service"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-[color:var(--accent-text)] underline underline-offset-2"
                >
                  TV Time GDPR export page
                </a>{" "}
                and sign in to the account that holds your history.
              </li>
              <li>
                <span className="font-semibold text-white/80">2.</span> Request
                your data, then download <b className="text-white/80">gdpr-data.zip</b>{" "}
                when it is ready.
              </li>
              <li>
                <span className="font-semibold text-white/80">3.</span> Keep the
                ZIP intact and upload it below.
              </li>
            </ol>
          </details>

          <details className="group mt-3 rounded-[12px] border border-white/[0.08] open:bg-white/[0.02]">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-bold text-white [&::-webkit-details-marker]:hidden">
              Already exported with TV Time Out?
              <ChevronDown className="size-4 shrink-0 text-white/50 transition group-open:rotate-180" />
            </summary>
            <p className="px-4 pb-4 text-sm leading-6 text-white/60">
              Upload the JSON ZIP from the TV Time Out browser extension. There
              is no need to export again.
            </p>
          </details>

          <p className="mt-4 text-xs leading-5 text-white/40">
            TV Time shuts down on July 15, 2026. Download and keep a local copy
            of your export before then.
          </p>

          <TvTimeUpload apiBase={API_URL} token={token ?? ""} />
        </div>
      )}
    </div>
  );
}
