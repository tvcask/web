import Link from "next/link";
import { ArrowRight, CheckCircle2, Database, FileUp, ShieldCheck } from "lucide-react";
import { MarketingHeader } from "@/components/marketing/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const featureSections = [
  { title: "How it works", copy: "Upload your TV Time export, preview matched items, then confirm when it looks right.", Icon: FileUp },
  { title: "What gets imported", copy: "Titles, statuses, favorites, ratings where available, and watched episodes.", Icon: Database },
  { title: "Why TV Cask", copy: "No required social layer. Your watch history is yours, with export built into the product.", Icon: CheckCircle2 }
];

export default function HomePage() {
  return (
    <>
      <MarketingHeader />
      <main>
        <section className="mx-auto grid min-h-[78vh] max-w-6xl items-center gap-10 px-5 pb-10 pt-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#33281F] bg-[#181410] px-3 py-1 text-sm text-[#F0A85A]">
              <ShieldCheck className="size-4" /> Built for former TV Time users
            </div>
            <div className="space-y-5">
              <h1 className="max-w-3xl text-5xl font-semibold leading-tight md:text-7xl">
                Save your TV Time history before it disappears.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[#A79B8E]">
                Import your TV Time export, preserve your watch history, and continue tracking your shows in a modern app.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild className="h-12">
                <Link href="/app/import">
                  Import my TV Time data <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" className="h-12">
                <Link href="/signup">Create account</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-[#33281F] bg-[#181410]/80 p-4 shadow-2xl">
            <div className="grid gap-3">
              {["Export downloaded", "Shows matched", "Episodes preserved", "Ready to continue"].map((label, index) => (
                <div key={label} className="flex items-center gap-4 rounded-lg bg-[#211A14] p-4">
                  <div className="grid size-11 place-items-center rounded-md bg-[#D88945]/15 text-[#F0A85A]">{index + 1}</div>
                  <div>
                    <p className="font-semibold">{label}</p>
                    <p className="text-sm text-[#A79B8E]">Your history stays readable and exportable.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-12">
          <div className="grid gap-4 md:grid-cols-3">
            {featureSections.map(({ title, copy, Icon }) => (
              <Card key={title} className="p-5">
                <Icon className="mb-5 size-6 text-[#F0A85A]" />
                <h2 className="font-semibold">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-[#A79B8E]">{copy}</p>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
