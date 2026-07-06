import Link from "next/link";
import { ChevronLeft } from "lucide-react";
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
            In the TV Time app, go to <b className="text-white">Settings → Export my data</b> and download the{" "}
            <b className="text-white">.zip</b>. Upload it here and we&apos;ll match your shows and movies against TMDB and
            pull in every watched episode.
          </p>

          <TvTimeUpload apiBase={API_URL} token={token ?? ""} />
        </div>
      )}
    </div>
  );
}
