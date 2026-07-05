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
          <h1 className="display text-2xl text-white">Log in</h1>
          <form action={startDevSession} className="mt-6 space-y-3">
            <Input name="email" type="email" placeholder="you@example.com" />
            <Input name="password" type="password" placeholder="Password" />
            <Button className="h-11 w-full">Log in</Button>
          </form>
          <p className="mt-4 text-sm text-white/50">
            New here?{" "}
            <Link className="font-semibold text-[color:var(--accent-text)]" href="/signup">
              Create an account
            </Link>
          </p>
        </Card>
      </main>
    </>
  );
}
