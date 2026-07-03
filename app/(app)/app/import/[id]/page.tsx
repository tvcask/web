import Link from "next/link";
import { confirmImportAction } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getUserId } from "@/lib/auth/session";
import { getImport } from "@/lib/services/import-service";

export default async function ImportPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserId();
  const { id } = await params;
  const record = getImport(userId, id);

  if (!record) {
    return (
      <Card className="p-6">
        <h1 className="text-2xl font-semibold">Import not found</h1>
        <Button asChild className="mt-5"><Link href="/app/import">Back to import</Link></Button>
      </Card>
    );
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Import preview</h1>
        <p className="mt-2 text-[#A79B8E]">{record.originalFilename}</p>
      </div>

      {record.errorMessage ? <Card className="border-[#EF4444]/50 p-4 text-[#EF4444]">{record.errorMessage}</Card> : null}

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          ["Titles", record.totalTitles],
          ["Episodes", record.totalEpisodes],
          ["Matched", record.matchedTitles],
          ["Unmatched", record.unmatchedTitles]
        ].map(([label, value]) => (
          <Card key={label} className="p-4">
            <p className="text-sm text-[#A79B8E]">{label}</p>
            <p className="mt-1 text-3xl font-semibold">{value}</p>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-[#33281F] p-4 font-semibold">Matched titles</div>
        <div className="divide-y divide-[#33281F]">
          {record.items.slice(0, 60).map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 p-4">
              <div>
                <p className="font-medium">{item.rawTitle}</p>
                <p className="text-sm text-[#A79B8E]">Confidence {item.matchConfidence ?? 0}%</p>
              </div>
              <Badge className={item.matchStatus === "matched" ? "border-[#22C55E]/40 text-[#22C55E]" : "border-[#F59E0B]/40 text-[#F59E0B]"}>
                {item.matchStatus}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex flex-wrap gap-3">
        <form action={confirmImportAction}>
          <input type="hidden" name="importId" value={record.id} />
          <Button disabled={record.status === "failed"}>Confirm import</Button>
        </form>
        <Button asChild variant="secondary">
          <a href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(record.rawPreview ?? {}, null, 2))}`} download={`tvcask-preview-${record.id}.json`}>
            Download preview JSON
          </a>
        </Button>
        <Button asChild variant="ghost"><Link href="/app/import">Cancel</Link></Button>
      </div>
    </div>
  );
}
