import Link from "next/link";
import { Logo } from "@/components/marketing/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh overflow-hidden">
      {/* Warm cask glow — light through whisky. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-[-12%] h-[520px] w-[860px] -translate-x-1/2 rounded-full opacity-25 blur-[130px]"
          style={{ background: "radial-gradient(circle, oklch(0.72 0.15 68), transparent 70%)" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(1100px 560px at 50% -10%, rgba(224,169,96,0.06), transparent 60%)" }}
        />
      </div>

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center px-5 py-5">
        <Link href="/" aria-label="tvcask home">
          <Logo />
        </Link>
      </header>

      <main className="relative z-10 flex min-h-[calc(100dvh-72px)] items-start justify-center px-5 pb-16 pt-6 sm:items-center sm:pt-0">
        {children}
      </main>
    </div>
  );
}
