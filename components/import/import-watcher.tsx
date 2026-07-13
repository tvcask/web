"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { getImportStatus } from "@/app/actions";
import {
  forgetActiveImport,
  onActiveImport,
  readActiveImport,
  rememberActiveImport
} from "@/components/import/active-import";
import { toast } from "@/lib/toast";
import type { ImportRecord } from "@/lib/data";

export function ImportWatcher({ initial }: { initial: ImportRecord | null }) {
  const pathname = usePathname();
  const [importId, setImportId] = useState<string | null>(null);
  const startedAt = useRef(Date.now());

  useEffect(() => {
    const stored = readActiveImport();
    const active = initial?.status === "processing" ? initial.id : null;
    const id = active ?? stored;
    if (id) {
      rememberActiveImport(id);
      setImportId(id);
    }
    return onActiveImport((next) => {
      startedAt.current = Date.now();
      setImportId(next);
    });
  }, [initial]);

  const announce = useCallback((record: ImportRecord) => {
    forgetActiveImport(record.id);
    if (record.status === "completed") {
      toast(`TV Time import complete. ${record.matchedTitles} titles restored.`);
      return;
    }
    toast(record.errorMessage ?? "TV Time import failed. Open the import screen to try again.");
  }, []);

  useEffect(() => {
    if (!importId || pathname === "/app/import") {
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const poll = async () => {
      try {
        const record = await getImportStatus(importId);
        if (cancelled) return;
        if (record.status !== "processing") {
          announce(record);
          return;
        }
      } catch {
        // A temporary API or network error is retried on the next tick.
      }
      if (cancelled) return;
      const elapsed = Date.now() - startedAt.current;
      const delay = document.visibilityState === "visible" && elapsed < 60_000 ? 5000 : 15_000;
      timer = setTimeout(poll, delay);
    };

    void poll();
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        if (timer) clearTimeout(timer);
        void poll();
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [announce, importId, pathname]);

  return null;
}
