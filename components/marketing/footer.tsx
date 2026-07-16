import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight02Icon } from '@hugeicons/core-free-icons';
import Link from "next/link";
import { Logo } from "@/components/marketing/logo";
import { getToken } from "@/lib/api";
import { site } from "@/lib/site";

export async function MarketingFooter() {
  const isAuthenticated = Boolean(await getToken());

  return (
    <footer className="border-t border-white/[0.06]">
      <div className="mx-auto w-full max-w-6xl px-5 py-11">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.7fr_0.7fr_0.7fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/45">
              Your watch history, kept. One independent tracker for web and mobile.
            </p>
          </div>

          <nav className="space-y-3 text-sm">
            <p className="eyebrow">Product</p>
            <Link href="/import-tv-time" className="block font-bold text-white/55 transition hover:text-white">
              TV Time import
            </Link>
            {isAuthenticated ? (
              <Link href="/app/shows" className="block font-bold text-white/55 transition hover:text-white">
                Open app
              </Link>
            ) : (
              <>
                <Link href="/signup" className="block font-bold text-white/55 transition hover:text-white">
                  Create account
                </Link>
                <Link href="/login" className="block font-bold text-white/55 transition hover:text-white">
                  Log in
                </Link>
              </>
            )}
          </nav>

          <nav className="space-y-3 text-sm">
            <p className="eyebrow">Company</p>
            <Link href="/about" className="block font-bold text-white/55 transition hover:text-white">
              About tvcask
            </Link>
            <Link href="/support" className="block font-bold text-white/55 transition hover:text-white">
              Support
            </Link>
            <a href={site.instagram} target="_blank" rel="noreferrer" className="block font-bold text-white/55 transition hover:text-white">
              Instagram
            </a>
          </nav>

          <nav className="space-y-3 text-sm">
            <p className="eyebrow">Legal</p>
            <Link href="/privacy" className="block font-bold text-white/55 transition hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="block font-bold text-white/55 transition hover:text-white">
              Terms of Service
            </Link>
            <Link href="/guidelines" className="block font-bold text-white/55 transition hover:text-white">
              Community Guidelines
            </Link>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/[0.06] pt-6 text-xs font-semibold text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright {new Date().getFullYear()} tvcask. Not affiliated with TV Time or Whip Media.</p>
          <Link href="/about" className="inline-flex items-center font-bold transition hover:text-white">
            Why I built this <HugeiconsIcon icon={ArrowRight02Icon} className="ml-1.5 size-3.5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
