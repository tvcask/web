import Link from "next/link";
import { signupAction } from "@/app/actions";
import { AuthCard, Banner, Field } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ error?: string; returnTo?: string }> }) {
  const { error, returnTo } = await searchParams;
  const safeReturnTo = typeof returnTo === "string" && returnTo.startsWith("/app/") ? returnTo : "";
  return (
    <AuthCard
      title="Start your cask"
      subtitle="Track every show and movie, and keep every episode you watch."
      footer={
        <>
          Already have an account?{" "}
          <Link className="font-semibold text-[color:var(--accent-text)]" href={`/login${safeReturnTo ? `?returnTo=${encodeURIComponent(safeReturnTo)}` : ""}`}>
            Log in
          </Link>
        </>
      }
    >
      {error ? <Banner tone="err">Could not create account. Try another email.</Banner> : null}
      <form action={signupAction} className="space-y-4">
        {safeReturnTo ? <input type="hidden" name="returnTo" value={safeReturnTo} /> : null}
        <Field label="Name">
          <Input name="name" type="text" placeholder="Your name" />
        </Field>
        <Field label="Email">
          <Input name="email" type="email" placeholder="you@example.com" required />
        </Field>
        <Field label="Password">
          <PasswordInput name="password" placeholder="At least 6 characters" required />
        </Field>
        <Button className="h-11 w-full">Create account</Button>
      </form>
    </AuthCard>
  );
}
