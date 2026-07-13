import Link from "next/link";
import { MarketingFooter } from "@/components/marketing/footer";
import { MarketingHeader } from "@/components/marketing/header";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <MarketingHeader />
      <main className="mx-auto flex min-h-[64vh] max-w-4xl items-center px-5 py-16 sm:py-24">
        <section className="w-full text-center">
          <p className="display text-5xl text-[color:var(--accent-text)] sm:text-6xl">
            404
          </p>
          <h1 className="display mt-4 text-3xl leading-tight text-white sm:text-4xl">
            Page not found
          </h1>
          <p className="mx-auto mt-3 max-w-md text-base leading-7 text-white/55">
            The page you are looking for does not exist or has moved.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild variant="secondary" className="h-12 px-6 text-sm">
              <Link href="/">Go home</Link>
            </Button>
            <Button asChild className="h-12 px-6 text-sm">
              <Link href="/app/shows">Open tvcask</Link>
            </Button>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </>
  );
}
