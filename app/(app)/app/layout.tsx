import { AppShell } from "@/components/app-shell/app-shell";
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
    <AppShell user={user}>
      {children}
      {modal}
    </AppShell>
  );
}
