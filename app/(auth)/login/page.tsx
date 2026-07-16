import Link from "next/link";
import { loginAction } from "@/app/actions";
import { AuthCard, Banner, Field } from "@/components/auth/auth-card";
import { SubmitButton } from "@/components/auth/submit-button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { getCurrentUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; reset?: string; returnTo?: string }> }) {
  if (await getCurrentUser()) {
    redirect("/app/shows");
  }

  const { error, reset, returnTo } = await searchParams;
  const safeReturnTo = typeof returnTo === "string" && returnTo.startsWith("/app/") ? returnTo : "";
  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to pick up where you left off."
      footer={
        <>
          New to tvcask?{" "}
          <Link className="font-semibold text-[color:var(--accent-text)]" href={`/signup${safeReturnTo ? `?returnTo=${encodeURIComponent(safeReturnTo)}` : ""}`}>
            Create an account
          </Link>
        </>
      }
    >
      {reset ? <Banner tone="ok">Password updated. Log in with your new one.</Banner> : null}
      {error ? <Banner tone="err">Invalid email or password.</Banner> : null}
      <form action={loginAction} className="space-y-4">
        {safeReturnTo ? <input type="hidden" name="returnTo" value={safeReturnTo} /> : null}
        <Field label="Email" htmlFor="email">
          <Input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" autoFocus required />
        </Field>
        <Field
          label="Password"
          htmlFor="password"
          hint={
            <Link href="/forgot-password" className="text-xs font-semibold text-white/45 transition hover:text-white">
              Forgot?
            </Link>
          }
        >
          <PasswordInput id="password" name="password" placeholder="••••••••" autoComplete="current-password" required />
        </Field>
        <SubmitButton pendingLabel="Logging in">Log in</SubmitButton>
      </form>
    </AuthCard>
  );
}
