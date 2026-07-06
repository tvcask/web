import Link from "next/link";
import { loginAction } from "@/app/actions";
import { MarketingHeader } from "@/components/marketing/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <>
      <MarketingHeader />
      <main className="mx-auto max-w-md px-5 py-16">
        <Card className="p-6">
          <h1 className="display text-2xl text-white">Log in</h1>
          {error ? <p className="mt-3 text-sm text-[#ef6d5a]">Invalid email or password.</p> : null}
          <form action={loginAction} className="mt-6 space-y-3">
            <Input name="email" type="email" placeholder="you@example.com" required />
            <Input name="password" type="password" placeholder="Password" required />
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
