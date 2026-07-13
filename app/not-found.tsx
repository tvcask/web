import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";
import { MarketingFooter } from "@/components/marketing/footer";
import { MarketingHeader } from "@/components/marketing/header";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <MarketingHeader />
      <main className="mx-auto flex min-h-[68vh] max-w-4xl items-center px-5 py-20 sm:py-28">
        <section className="w-full text-center">
          <p className="display text-7xl text-[color:var(--accent-text)] sm:text-8xl">
            404
          </p>
          <h1 className="display mt-5 text-3xl leading-tight text-white sm:text-5xl">
            This page is not in your library.
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-white/55">
            The address may be wrong, or the page may have moved. Return home or
            open your tvcask library to keep watching.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild variant="secondary" className="h-12 px-6 text-sm">
              <Link href="/">
                <Home className="size-4" /> Go home
              </Link>
            </Button>
            <Button asChild className="h-12 px-6 text-sm">
              <Link href="/app">
                Open tvcask <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </>
  );
}
