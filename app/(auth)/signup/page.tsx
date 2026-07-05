import Link from "next/link";
import { signupAction } from "@/app/actions";
import { MarketingHeader } from "@/components/marketing/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <>
      <MarketingHeader />
      <main className="mx-auto max-w-md px-5 py-16">
        <Card className="p-6">
          <h1 className="display text-2xl text-white">Create account</h1>
          {error ? <p className="mt-3 text-sm text-[#ef6d5a]">Could not create account. Try another email.</p> : null}
          <form action={signupAction} className="mt-6 space-y-3">
            <Input name="name" type="text" placeholder="Name" />
            <Input name="email" type="email" placeholder="you@example.com" required />
            <Input name="password" type="password" placeholder="Password (min 6)" required />
            <Button className="h-11 w-full">Create account</Button>
          </form>
          <p className="mt-4 text-sm text-white/50">
            Already have an account?{" "}
            <Link className="font-semibold text-[color:var(--accent-text)]" href="/login">
              Log in
            </Link>
          </p>
        </Card>
      </main>
    </>
  );
}
