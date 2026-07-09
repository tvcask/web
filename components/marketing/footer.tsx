import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/marketing/logo";

export function MarketingFooter() {
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="mx-auto w-full max-w-6xl px-5 py-11">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.7fr_0.7fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/45">
              An independent watch tracker, built for people whose history needed a new home.
            </p>
          </div>

          <nav className="space-y-3 text-sm">
            <p className="eyebrow">Product</p>
            <Link href="/import-tv-time" className="block font-bold text-white/55 transition hover:text-white">
              TV Time import
            </Link>
            <Link href="/signup" className="block font-bold text-white/55 transition hover:text-white">
              Create account
            </Link>
            <Link href="/login" className="block font-bold text-white/55 transition hover:text-white">
              Log in
            </Link>
          </nav>

          <nav className="space-y-3 text-sm">
            <p className="eyebrow">Company</p>
            <Link href="/about" className="block font-bold text-white/55 transition hover:text-white">
              About tvcask
            </Link>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/[0.06] pt-6 text-xs font-semibold text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright {new Date().getFullYear()} tvcask. Not affiliated with TV Time or Whip Media.</p>
          <Link href="/about" className="inline-flex items-center font-bold transition hover:text-white">
            Why I built this <ArrowRight className="ml-1.5 size-3.5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
