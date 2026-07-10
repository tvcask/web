import Link from "next/link";
import { signupAction } from "@/app/actions";
import { AuthCard, Banner, Field } from "@/components/auth/auth-card";
import { SubmitButton } from "@/components/auth/submit-button";
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
        <Field label="Name" htmlFor="name">
          <Input id="name" name="name" type="text" placeholder="Your name" autoComplete="name" autoFocus />
        </Field>
        <Field label="Email" htmlFor="email">
          <Input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
        </Field>
        <Field label="Password" htmlFor="password" note="At least 6 characters.">
          <PasswordInput id="password" name="password" placeholder="••••••••" autoComplete="new-password" minLength={6} required />
        </Field>
        <SubmitButton pendingLabel="Creating account">Create account</SubmitButton>
      </form>
    </AuthCard>
  );
}
