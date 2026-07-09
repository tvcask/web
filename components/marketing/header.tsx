import Link from "next/link";
import { Logo } from "@/components/marketing/logo";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#08080a]/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" aria-label={`${site.displayName} home`}>
          <Logo />
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/import-tv-time" className="hidden px-3 text-sm font-bold text-white/55 transition hover:text-white sm:inline-flex">
            TV Time import
          </Link>
          <Button asChild variant="ghost">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Create account</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
