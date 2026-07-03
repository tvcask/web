import { MarketingHeader } from "@/components/marketing/header";
import { Card } from "@/components/ui/card";

export default function PricingPage() {
  return (
    <>
      <MarketingHeader />
      <main className="mx-auto max-w-3xl px-5 py-16">
        <h1 className="text-4xl font-semibold">Pricing</h1>
        <Card className="mt-8 p-6">
          <p className="text-lg font-semibold">Free during MVP</p>
          <p className="mt-2 text-[#A79B8E]">Import, track, and export your watch history while TV Cask is being validated.</p>
        </Card>
      </main>
    </>
  );
}
