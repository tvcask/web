import Link from "next/link";

export function MarketingFooter() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-5 py-10">
      <div className="flex flex-col gap-5 border-t border-white/[0.06] pt-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <p className="text-xs text-white/40">© {new Date().getFullYear()} TV Cask</p>
          <nav className="flex flex-wrap gap-4 text-xs font-bold text-white/45">
            <Link href="/about" className="transition hover:text-white">
              About
            </Link>
            <Link href="/import-tv-time" className="transition hover:text-white">
              TV Time import
            </Link>
            <Link href="/signup" className="transition hover:text-white">
              Create account
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
