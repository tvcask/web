"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Screen = { src: string; alt: string };

// The side phones start upright behind the centre one and settle out into the
// fan on first view, so the section reads as three screens rather than one.
const settle = [
  { rotate: -7, x: 0, y: 20 },
  { rotate: 0, x: 0, y: 0 },
  { rotate: 7, x: 0, y: 20 }
];

export function PhoneFan({ screens }: { screens: Screen[] }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative flex items-center justify-center">
      {screens.map((screen, index) => {
        const isCenter = index === 1;
        const target = settle[index];

        return (
          <motion.div
            key={screen.src}
            initial={reduceMotion ? false : { rotate: 0, y: 0, opacity: 0 }}
            whileInView={{ ...target, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: isCenter ? 0 : 0.12 }}
            className={cn(
              "relative w-[190px] shrink-0 rounded-[30px] border border-white/12 bg-[#1a1714] p-[5px] shadow-2xl shadow-black/50",
              isCenter ? "z-10" : "hidden w-[168px] sm:block",
              index === 0 && "-mr-10",
              index === 2 && "-ml-10"
            )}
          >
            <div className="relative aspect-[780/1600] overflow-hidden rounded-[26px] bg-black">
              <Image
                src={screen.src}
                alt={screen.alt}
                fill
                sizes="190px"
                className="object-cover"
                priority={isCenter}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
