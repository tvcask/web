import Link from "next/link";
import { startDevSession } from "@/app/actions";
import { MarketingHeader } from "@/components/marketing/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  return (
    <>
      <MarketingHeader />
      <main className="mx-auto max-w-md px-5 py-16">
        <Card className="p-6">
          <h1 className="text-2xl font-semibold">Log in</h1>
          <form action={startDevSession} className="mt-6 space-y-4">
            <Input name="email" type="email" placeholder="you@example.com" />
            <Input name="password" type="password" placeholder="Password" />
            <Button className="w-full">Log in</Button>
          </form>
          <p className="mt-4 text-sm text-[#A79B8E]">
            New here? <Link className="text-[#F0A85A]" href="/signup">Create an account</Link>
          </p>
        </Card>
      </main>
    </>
  );
}
