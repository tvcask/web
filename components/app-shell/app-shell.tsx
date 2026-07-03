import { AppTopNav } from "@/components/app-shell/app-top-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-[#F8F3EC]">
      <AppTopNav />
      <main className="soft-enter min-h-[calc(100vh-72px)] px-5 pb-10 pt-6 sm:px-8">{children}</main>
    </div>
  );
}
