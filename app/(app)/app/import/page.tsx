import Link from "next/link";
import { ChevronLeft, FileUp } from "lucide-react";
import { importTvTimeAction } from "@/app/actions";
import { getImport } from "@/lib/data";
import { ImportProgress } from "@/components/import/import-progress";

export default async function ImportPage({
  searchParams
}: {
  searchParams: Promise<{ id?: string; error?: string }>;
}) {
  const { id, error } = await searchParams;
  const record = id ? await getImport(id) : null;

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
            In the TV Time app, go to <b className="text-white">Settings → Export my data</b> and download the{" "}
            <b className="text-white">.zip</b>. Upload it here and we&apos;ll match your shows and movies against TMDB and
            pull in every watched episode.
          </p>

          {error ? (
            <p className="mt-4 text-sm text-[#ef6d5a]">
              {error === "nofile" ? "Please choose your TV Time .zip file." : "Upload failed. Make sure it's the .zip you downloaded."}
            </p>
          ) : null}

          <form action={importTvTimeAction} className="mt-6 space-y-4">
            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-[12px] border border-dashed border-white/20 px-4 py-8 text-center transition hover:border-white/40">
              <FileUp className="size-6 text-white/50" />
              <span className="text-sm font-semibold text-white">Choose your TV Time export</span>
              <span className="text-xs text-white/40">.zip file</span>
              <input type="file" name="file" accept=".zip,application/zip" required className="mt-2 text-xs text-white/60 file:mr-3 file:rounded-full file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-white" />
            </label>
            <button
              className="h-11 w-full rounded-full text-sm font-bold"
              style={{ background: "var(--accent)", color: "var(--on-accent)" }}
            >
              Start import
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
