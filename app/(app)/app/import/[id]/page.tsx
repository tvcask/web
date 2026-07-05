import Link from "next/link";
import { confirmImportAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { getUserId } from "@/lib/auth/session";
import { getImport } from "@/lib/services/import-service";

export default async function ImportPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserId();
  const { id } = await params;
  const record = await getImport(userId, id);

  if (!record) {
    return (
      <div className="mx-auto max-w-2xl rounded-[16px] border border-[#241f19] bg-[#131110] p-8">
        <h1 className="display text-2xl text-[#F3EDE4]">Import not found</h1>
        <Button asChild className="mt-5">
          <Link href="/app/import">Back to import</Link>
        </Button>
      </div>
    );
  }

  const stats = [
    ["Titles", record.totalTitles],
    ["Episodes", record.totalEpisodes],
    ["Matched", record.matchedTitles],
    ["Unmatched", record.unmatchedTitles]
  ] as const;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="display text-3xl text-[#F3EDE4]">Import preview</h1>
        <p className="mt-1 text-[#8a8076]">{record.originalFilename}</p>
      </div>

      {record.errorMessage ? (
        <p className="rounded-[12px] border border-[#5a2b26] bg-[#1c110f] p-4 text-[#ef6d5a]">{record.errorMessage}</p>
      ) : null}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded-[14px] border border-[#241f19] bg-[#131110] p-4">
            <p className="display text-2xl text-[#F3EDE4]">{value}</p>
            <p className="eyebrow mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="divide-y divide-[#1c1813] rounded-[14px] border border-[#241f19] bg-[#131110]">
        {record.items.slice(0, 60).map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-4 p-4">
            <div className="min-w-0">
              <p className="truncate text-[15px] text-[#e7ddd0]">{item.rawTitle}</p>
              <p className="text-[13px] text-[#6f665c]">{item.matchConfidence ?? 0}% match</p>
            </div>
            <span
              className={
                item.matchStatus === "matched"
                  ? "shrink-0 rounded-full border border-[#2c5238] px-2.5 py-0.5 text-[11px] font-semibold text-[#34c26a]"
                  : "shrink-0 rounded-full border border-[#5a4a1f] px-2.5 py-0.5 text-[11px] font-semibold text-[#E0A960]"
              }
            >
              {item.matchStatus}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <form action={confirmImportAction}>
          <input type="hidden" name="importId" value={record.id} />
          <Button disabled={record.status === "failed"}>Confirm import</Button>
        </form>
        <Button asChild variant="secondary">
          <a
            href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(record.rawPreview ?? {}, null, 2))}`}
            download={`tvcask-preview-${record.id}.json`}
          >
            Download JSON
          </a>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/app/import">Cancel</Link>
        </Button>
      </div>
    </div>
  );
}
