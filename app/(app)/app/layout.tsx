import { AppShell } from "@/components/app-shell/app-shell";
import { Providers } from "@/components/providers";
import { requireUser } from "@/lib/auth/session";

export default async function ProtectedLayout({
  children,
  modal
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const user = await requireUser();
  return (
    <Providers>
      <AppShell user={user} modal={modal}>
        {children}
      </AppShell>
    </Providers>
  );
}
