"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function WatchLoadError({ unavailable }: { unavailable: boolean }) {
  const router = useRouter();
  return (
    <div role="alert">
      <h1 className="display text-2xl text-white sm:text-3xl">Where to watch</h1>
      <p className="mt-3 text-sm text-white/55">
        {unavailable
          ? "Where to watch is unavailable right now. Try again in a bit."
          : "Couldn't load where to watch. Check your connection and try again."}
      </p>
      <Button variant="secondary" className="mt-3" onClick={() => router.refresh()}>
        Try again
      </Button>
    </div>
  );
}
