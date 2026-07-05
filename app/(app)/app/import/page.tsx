import { Upload } from "lucide-react";
import { uploadTvTimeExport } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { getUserId } from "@/lib/auth/session";
import { getImports } from "@/lib/services/import-service";

export default async function ImportPage() {
  const userId = await getUserId();
  const imports = await getImports(userId);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="display text-3xl text-[#F3EDE4]">Import from TV Time</h1>
        <p className="mt-2 text-[#9a9086]">Upload your export. Nothing is saved until you confirm the preview.</p>
      </div>

      <form action={uploadTvTimeExport} className="space-y-4">
        <label className="grid min-h-52 cursor-pointer place-items-center rounded-[16px] border border-dashed border-[#332a20] bg-[#131110] p-6 text-center transition hover:border-[#E0A960]/50">
          <span>
            <Upload className="mx-auto mb-3 size-7 text-[#E0A960]" />
            <span className="display block text-[15px] text-[#F3EDE4]">Choose your export</span>
            <span className="mt-1 block text-[13px] text-[#6f665c]">JSON or CSV</span>
          </span>
          <input className="sr-only" name="file" type="file" accept=".json,.csv,.zip,application/json,text/csv,application/zip" required />
        </label>
        <Button>Parse import</Button>
      </form>

      {imports.length > 0 ? (
        <section className="space-y-3">
          <p className="eyebrow">History</p>
          <div className="divide-y divide-[#1c1813] rounded-[14px] border border-[#241f19] bg-[#131110]">
            {imports.map((item) => (
              <a key={item.id} href={`/app/import/${item.id}`} className="flex items-center justify-between p-4 transition hover:bg-[#16130f]">
                <div className="min-w-0">
                  <p className="truncate text-[15px] text-[#e7ddd0]">{item.originalFilename}</p>
                  <p className="text-[13px] text-[#6f665c]">{item.totalTitles} titles · {item.status}</p>
                </div>
                <span className="text-[13px] font-semibold text-[#E0A960]">Open</span>
              </a>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
