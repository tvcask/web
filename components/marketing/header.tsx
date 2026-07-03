import Link from "next/link";
import { Logo } from "@/components/marketing/logo";
import { Button } from "@/components/ui/button";

export function MarketingHeader() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5">
      <Link href="/">
        <Logo />
      </Link>
      <nav className="hidden items-center gap-6 text-sm text-[#A79B8E] md:flex">
        <Link href="/import-tv-time">Import TV Time</Link>
        <Link href="/pricing">Pricing</Link>
      </nav>
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost">
          <Link href="/login">Log in</Link>
        </Button>
        <Button asChild>
          <Link href="/signup">Create account</Link>
        </Button>
      </div>
    </header>
  );
}
