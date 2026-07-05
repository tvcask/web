import { AppBottomNav } from "@/components/app-shell/app-bottom-nav";
import { AppTopNav } from "@/components/app-shell/app-top-nav";

type AppShellUser = {
  name?: string | null;
  email?: string | null;
};

export function AppShell({ children, user }: { children: React.ReactNode; user: AppShellUser }) {
  return (
    <div className="min-h-screen bg-[#0d0c0b] text-[#F4EEE6]">
      <AppTopNav user={user} />
      <main className="soft-enter px-5 pb-28 pt-8 sm:px-8 lg:pb-16">{children}</main>
      <AppBottomNav />
    </div>
  );
}
