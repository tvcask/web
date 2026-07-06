import Link from "next/link";
import { forgotPasswordAction } from "@/app/actions";
import { AuthCard, Banner, Field } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<{ sent?: string }> }) {
  const { sent } = await searchParams;
  return (
    <AuthCard
      title="Reset your password"
      subtitle={sent ? undefined : "Enter your email and we'll send a reset link."}
      footer={
        <Link className="font-semibold text-[color:var(--accent-text)]" href="/login">
          Back to log in
        </Link>
      }
    >
      {sent ? (
        <Banner tone="ok">If an account exists for that email, a reset link is on its way. Check your inbox.</Banner>
      ) : (
        <form action={forgotPasswordAction} className="space-y-4">
          <Field label="Email">
            <Input name="email" type="email" placeholder="you@example.com" required />
          </Field>
          <Button className="h-11 w-full">Send reset link</Button>
        </form>
      )}
    </AuthCard>
  );
}
