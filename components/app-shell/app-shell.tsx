import { AppBottomNav } from "@/components/app-shell/app-bottom-nav";
import { AppTopNav } from "@/components/app-shell/app-top-nav";
import { Toaster } from "@/components/ui/toaster";

type AppShellUser = {
  name?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
};

export function AppShell({
  children,
  modal,
  user
}: {
  children: React.ReactNode;
  modal?: React.ReactNode;
  user: AppShellUser;
}) {
  return (
    <div className="min-h-screen bg-[#0d0c0b] text-[#F4EEE6]">
      <AppTopNav user={user} />
      <main className="soft-enter px-5 pb-28 pt-8 sm:px-8 lg:pb-16">{children}</main>
      {/* The modal lives outside <main> on purpose: <main>'s soft-enter animation
          leaves a transform behind, which would make the drawer's position:fixed
          relative to <main> instead of the viewport (breaking it on long pages). */}
      {modal}
      <AppBottomNav />
      <Toaster />
    </div>
  );
}
