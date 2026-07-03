import { Upload } from "lucide-react";
import { uploadTvTimeExport } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getUserId } from "@/lib/auth/session";
import { getImports } from "@/lib/services/import-service";

export default async function ImportPage() {
  const userId = await getUserId();
  const imports = getImports(userId);

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Import TV Time data</h1>
        <p className="mt-2 text-[#A79B8E]">
          Upload the export file you downloaded from TV Time. We&apos;ll parse your shows, movies, episodes, and watch history before saving anything.
        </p>
      </div>

      <Card className="p-6">
        <form action={uploadTvTimeExport} className="space-y-5">
          <label className="grid min-h-48 cursor-pointer place-items-center rounded-lg border border-dashed border-[#5a3821] bg-[#211A14]/65 p-6 text-center">
            <span>
              <Upload className="mx-auto mb-4 size-8 text-[#F0A85A]" />
              <span className="block font-semibold">Choose your TV Time export</span>
              <span className="mt-2 block text-sm text-[#A79B8E]">JSON and CSV are parsed now. ZIP uploads are accepted for later processing.</span>
            </span>
            <input className="sr-only" name="file" type="file" accept=".json,.csv,.zip,application/json,text/csv,application/zip" required />
          </label>
          <Button>Parse import</Button>
        </form>
      </Card>

      {imports.length > 0 ? (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Import history</h2>
          <div className="space-y-3">
            {imports.map((item) => (
              <Card key={item.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{item.originalFilename}</p>
                  <p className="text-sm text-[#A79B8E]">{item.totalTitles} titles · {item.status}</p>
                </div>
                <a className="text-sm text-[#F0A85A]" href={`/app/import/${item.id}`}>Open</a>
              </Card>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
