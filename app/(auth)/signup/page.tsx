import Link from "next/link";
import { signupAction } from "@/app/actions";
import { AuthCard, Banner, Field } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <AuthCard
      title="Start your cask"
      subtitle="Track every show and movie, and keep every episode you watch."
      footer={
        <>
          Already have an account?{" "}
          <Link className="font-semibold text-[color:var(--accent-text)]" href="/login">
            Log in
          </Link>
        </>
      }
    >
      {error ? <Banner tone="err">Could not create account — try another email.</Banner> : null}
      <form action={signupAction} className="space-y-4">
        <Field label="Name">
          <Input name="name" type="text" placeholder="Your name" />
        </Field>
        <Field label="Email">
          <Input name="email" type="email" placeholder="you@example.com" required />
        </Field>
        <Field label="Password">
          <Input name="password" type="password" placeholder="At least 6 characters" required />
        </Field>
        <Button className="h-11 w-full">Create account</Button>
      </form>
    </AuthCard>
  );
}
