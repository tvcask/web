import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { api } from "@/lib/api";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";

export default async function VerifyEmailPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  let verified = false;
  if (token) {
    try {
      await api("/v1/auth/verify-email", { method: "POST", body: { token }, auth: false });
      verified = true;
    } catch {
      verified = false;
    }
  }

  return (
    <AuthCard title={verified ? "Email verified" : "Verification failed"}>
      <div className="flex flex-col items-center text-center">
        {verified ? (
          <CheckCircle2 className="size-12" style={{ color: "var(--accent-text)" }} />
        ) : (
          <XCircle className="size-12 text-[#ef6d5a]" />
        )}
        <p className="mt-4 text-sm leading-6 text-white/55">
          {verified
            ? "Your email is confirmed. You're all set."
            : "This verification link is invalid or has expired. You can request a new one from Settings."}
        </p>
        <Button asChild className="mt-6 h-11 w-full">
          <Link href="/app/shows">Go to tvcask</Link>
        </Button>
      </div>
    </AuthCard>
  );
}
