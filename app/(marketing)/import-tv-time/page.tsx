import Link from "next/link";
import { MarketingHeader } from "@/components/marketing/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ImportTvTimePage() {
  return (
    <>
      <MarketingHeader />
      <main className="mx-auto max-w-4xl px-5 py-16">
        <h1 className="text-4xl font-semibold">Import from TV Time</h1>
        <p className="mt-4 max-w-2xl text-[#A79B8E]">
          Upload the export file you downloaded from TV Time. TV Cask parses it first, shows a preview, and saves only after you confirm.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {["JSON and CSV exports", "Title matching through TMDB", "Unmatched items kept for review", "Export your TV Cask data anytime"].map((item) => (
            <Card key={item} className="p-5 text-sm text-[#F8F3EC]">
              {item}
            </Card>
          ))}
        </div>
        <Button asChild className="mt-8">
          <Link href="/app/import">Start import</Link>
        </Button>
      </main>
    </>
  );
}
