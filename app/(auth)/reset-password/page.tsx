import Link from "next/link";
import { resetPasswordAction } from "@/app/actions";
import { AuthCard, Banner, Field } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function ResetPasswordPage({
  searchParams
}: {
  searchParams: Promise<{ token?: string; error?: string }>;
}) {
  const { token, error } = await searchParams;

  if (!token) {
    return (
      <AuthCard
        title="Invalid link"
        subtitle="This reset link is missing its token. Request a new one."
        footer={
          <Link className="font-semibold text-[color:var(--accent-text)]" href="/forgot-password">
            Request a reset link
          </Link>
        }
      >
        <></>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Choose a new password"
      subtitle="Pick something you'll remember. This link works once."
      footer={
        <Link className="font-semibold text-[color:var(--accent-text)]" href="/login">
          Back to log in
        </Link>
      }
    >
      {error ? <Banner tone="err">This link is invalid or has expired.</Banner> : null}
      <form action={resetPasswordAction} className="space-y-4">
        <input type="hidden" name="token" value={token} />
        <Field label="New password">
          <Input name="newPassword" type="password" placeholder="At least 6 characters" required />
        </Field>
        <Button className="h-11 w-full">Reset password</Button>
      </form>
    </AuthCard>
  );
}
