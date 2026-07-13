"use client";

import { HugeiconsIcon } from '@hugeicons/react';
import { Alert02Icon, CheckmarkCircle02Icon, Loading03Icon } from '@hugeicons/core-free-icons';

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getImportStatus } from "@/app/actions";
import { toast } from "@/lib/toast";
import type { ImportRecord } from "@/lib/data";
import { forgetActiveImport, rememberActiveImport } from "@/components/import/active-import";

export function ImportProgress({ initial }: { initial: ImportRecord }) {
  const [rec, setRec] = useState(initial);
  const announced = useRef(false);
  const pollingStartedAt = useRef(Date.now());

  useEffect(() => {
    if (rec.status === "processing") {
      rememberActiveImport(rec.id);
    } else {
      forgetActiveImport(rec.id);
    }
  }, [rec.id, rec.status]);

  useEffect(() => {
    if (rec.status !== "processing") {
      return;
    }
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const poll = async () => {
      try {
        const next = await getImportStatus(rec.id);
        if (cancelled) return;
        setRec(next);
        if (next.status !== "processing") return;
      } catch {
        // keep the last known state; next tick retries
      }
      if (cancelled) return;
      const elapsed = Date.now() - pollingStartedAt.current;
      const delay = document.visibilityState === "visible" && elapsed < 60_000 ? 5000 : 15_000;
      timer = setTimeout(poll, delay);
    };
    timer = setTimeout(poll, 5000);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [rec.status, rec.id]);

  // Announce the outcome once, when the background matching settles.
  useEffect(() => {
    if (announced.current) return;
    if (rec.status === "completed") {
      announced.current = true;
      toast(`TV Time import complete. ${rec.matchedTitles} titles restored.`);
    } else if (rec.status === "failed") {
      announced.current = true;
      toast(rec.errorMessage ?? "Import failed. Please try again.");
    }
  }, [rec.status, rec.matchedTitles, rec.errorMessage]);

  const processed = rec.matchedTitles + rec.unmatchedTitles;
  const pct = rec.totalTitles > 0 ? Math.min(100, Math.round((processed / rec.totalTitles) * 100)) : 0;
  const done = rec.status === "completed";
  const failed = rec.status === "failed";

  if (failed) {
    return (
      <div className="surface rounded-[16px] p-7">
        <div className="flex items-center gap-3">
          <HugeiconsIcon icon={Alert02Icon} className="size-6 text-[#ef6d5a]" />
          <h2 className="display text-xl text-white">Import failed</h2>
        </div>
        <p className="mt-4 text-sm text-white/60">
          {rec.errorMessage ?? "Something went wrong while matching your history."}
        </p>
        <div className="mt-6">
          <Link
            href="/app/import"
            className="inline-block rounded-full px-5 py-2.5 text-sm font-bold"
            style={{ background: "var(--accent)", color: "var(--on-accent)" }}
          >
            Try again
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="surface rounded-[16px] p-7">
      <div className="flex items-center gap-3">
        {done ? (
          <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-6" style={{ color: "var(--accent-text)" }} />
        ) : (
          <HugeiconsIcon icon={Loading03Icon} className="size-6 animate-spin text-white/60" />
        )}
        <h2 className="display text-xl text-white">
          {done ? "Import complete" : "Importing your history…"}
        </h2>
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${done ? 100 : pct}%`, background: "var(--accent)" }}
        />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-4">
        <Stat label="Matched" value={rec.matchedTitles} accent />
        <Stat label="Episodes" value={rec.watchedEpisodes} />
        <Stat label="Lists" value={rec.importedLists} />
      </div>
      {rec.importedLists > 0 || rec.unmatchedListItems > 0 ? (
        <p className="mt-4 text-sm text-white/50">
          Imported {rec.importedListItems.toLocaleString()} list items
          {rec.unmatchedListItems > 0 ? `, skipped ${rec.unmatchedListItems.toLocaleString()} unmatched list items` : ""}.
        </p>
      ) : null}

      {!done ? (
        <p className="mt-5 text-sm text-white/50">
          Matching {rec.totalTitles} titles against TMDB. You can leave this page and return here to check progress.
        </p>
      ) : (
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/app/shows"
            className="rounded-full px-5 py-2.5 text-sm font-bold"
            style={{ background: "var(--accent)", color: "var(--on-accent)" }}
          >
            See my shows
          </Link>
          <Link href="/app/profile" className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-bold text-white">
            View profile
          </Link>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, accent = false }: { label: string; value: number; accent?: boolean }) {
  return (
    <div>
      <p className="eyebrow">{label}</p>
      <p className="display mt-1.5 text-2xl" style={{ color: accent ? "var(--accent-text)" : "#fff" }}>
        {value.toLocaleString()}
      </p>
    </div>
  );
}
