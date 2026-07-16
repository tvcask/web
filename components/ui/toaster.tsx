"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { onToast } from "@/lib/toast";

type Toast = { id: number; message: string; actionHref?: string };

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    return onToast(({ message, actionHref }) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, actionHref }]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3600);
    });
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex flex-col items-center gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="pointer-events-auto rounded-full border border-white/10 bg-[#14110d] text-sm font-bold text-white shadow-2xl shadow-black/50"
          >
            {t.actionHref ? (
              <Link href={t.actionHref} className="block px-5 py-3">
                {t.message}
              </Link>
            ) : (
              <span className="block px-5 py-3">{t.message}</span>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
}
