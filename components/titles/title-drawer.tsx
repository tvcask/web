"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useDragControls, type PanInfo } from "framer-motion";
import { X } from "lucide-react";

const outerBase = "fixed z-50 flex flex-col bg-[#0a0a0c]";
const outerMobile = "inset-x-0 bottom-0 max-h-[92dvh] w-full rounded-t-[22px] border-t border-white/[0.08]";
const outerDesktop = "inset-y-0 right-0 h-dvh w-full max-w-[560px] border-l border-white/[0.08]";

export function TitleDrawer({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const controls = useDragControls();
  const [mobile, setMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") router.back();
    }
    document.addEventListener("keydown", onKey);

    // Lock the page behind the sheet so the body doesn't scroll on mobile.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      mq.removeEventListener("change", sync);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [router]);

  // Dismiss when the sheet is flung or dragged far enough down.
  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.y > 120 || info.velocity.y > 700) router.back();
  }

  return (
    <>
      <div
        onClick={() => router.back()}
        className="fixed inset-0 z-40 bg-black/60"
        style={{ animation: "fadeIn 0.2s ease both" }}
      />
      {/* Outer shell owns the drag (mobile) / slide (both). The scroll lives in a
          child so framer's touch-action doesn't fight native scrolling. */}
      <motion.div
        key={mobile ? "sheet" : "drawer"}
        className={`${outerBase} ${mobile ? outerMobile : outerDesktop}`}
        initial={mobile ? { y: "100%" } : { x: "100%" }}
        animate={{ x: 0, y: 0 }}
        transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
        drag={mobile ? "y" : false}
        dragControls={controls}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.6 }}
        onDragEnd={onDragEnd}
      >
        {/* Grab handle — drag down (or tap outside) to dismiss. Mobile only. */}
        <div
          onPointerDown={(event) => mobile && controls.start(event)}
          className="flex shrink-0 touch-none cursor-grab justify-center py-3 active:cursor-grabbing sm:hidden"
        >
          <span className="h-1 w-9 rounded-full bg-white/45" />
        </div>

        <button
          onClick={() => router.back()}
          className="absolute left-4 top-4 z-30 grid size-9 place-items-center rounded-full bg-black/55 text-white backdrop-blur transition hover:bg-black/75 sm:left-5 sm:top-5"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>

        <div
          className="nos min-h-0 flex-1 overflow-y-auto overscroll-contain"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          {children}
        </div>
      </motion.div>
    </>
  );
}
