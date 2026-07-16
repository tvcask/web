"use client";

import { useEffect } from "react";

export default function AppError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app] route error", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-md px-5 py-20 text-center">
      <h1 className="display text-xl text-white">Something went wrong.</h1>
      <p className="mt-2 text-sm leading-6 text-white/55">
        We couldn&apos;t load this page. It&apos;s usually temporary.
      </p>
      <button
        onClick={reset}
        className="mt-6 inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-bold"
        style={{ background: "var(--accent)", color: "var(--on-accent)" }}
      >
        Try again
      </button>
    </div>
  );
}
