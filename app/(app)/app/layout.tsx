import { AppShell } from "@/components/app-shell/app-shell";
import { Providers } from "@/components/providers";
import { requireUser } from "@/lib/auth/session";
import { getLatestImport } from "@/lib/data";

export default async function ProtectedLayout({
  children,
  modal
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const user = await requireUser();
  const latestImport = await getLatestImport().catch(() => null);
  return (
    <Providers>
      <AppShell user={user} modal={modal} latestImport={latestImport}>
        {children}
      </AppShell>
    </Providers>
  );
}
