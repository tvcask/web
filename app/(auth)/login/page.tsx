import Link from "next/link";
import { loginAction } from "@/app/actions";
import { AuthCard, Banner, Field } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; reset?: string }> }) {
  const { error, reset } = await searchParams;
  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to pick up where you left off."
      footer={
        <>
          New to TV Cask?{" "}
          <Link className="font-semibold text-[color:var(--accent-text)]" href="/signup">
            Create an account
          </Link>
        </>
      }
    >
      {reset ? <Banner tone="ok">Password updated. Log in with your new one.</Banner> : null}
      {error ? <Banner tone="err">Invalid email or password.</Banner> : null}
      <form action={loginAction} className="space-y-4">
        <Field label="Email">
          <Input name="email" type="email" placeholder="you@example.com" required />
        </Field>
        <Field
          label="Password"
          hint={
            <Link href="/forgot-password" className="text-xs font-semibold text-white/45 transition hover:text-white">
              Forgot?
            </Link>
          }
        >
          <Input name="password" type="password" placeholder="••••••••" required />
        </Field>
        <Button className="h-11 w-full">Log in</Button>
      </form>
    </AuthCard>
  );
}
