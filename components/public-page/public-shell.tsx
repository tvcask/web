import Link from "next/link";

import { TmdbAttribution } from "@/components/tmdb-attribution";
import { site } from "@/lib/site";

// Deliberately not the marketing header and footer. Someone opened this because a
// friend sent it, so the page belongs to the friend, and tvcask is a quiet credit.
export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[720px] flex-col px-5 pt-10 sm:pt-16">
      <main className="flex-1">{children}</main>
      <TmdbAttribution className="mt-14 border-t border-white/[0.06] pt-5" />
      <footer className="flex items-center justify-between gap-4 py-5 text-xs text-white/35">
        <Link href="/" className="font-bold transition hover:text-white">
          Made with {site.displayName}
        </Link>
        <Link href="/support" rel="nofollow" className="transition hover:text-white">
          Report this page
        </Link>
      </footer>
    </div>
  );
}
