"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Badge, BadgeCategory } from "@/lib/data";
import { BadgeMedallion } from "@/components/badges/badge-medallion";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle
} from "@/components/ui/drawer";

export function BadgeGallery({ badges }: { badges: Badge[] }) {
  const [selected, setSelected] = useState<Badge | null>(null);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 639px)");
    const sync = () => setMobile(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const progress = selected ? Math.min(100, (selected.progress / selected.target) * 100) : 0;
  const groups = groupBadges(badges);

  return (
    <>
      <div className="space-y-9 pt-2">
        {groups.map((group) => (
          <section key={group.category}>
            <h3 className="display mb-3 text-base text-white">{group.title}</h3>
            <div className="grid grid-cols-3 gap-x-4 gap-y-7 sm:grid-cols-4">
              {group.badges.map((badge) => (
                <button
                  key={badge.key}
                  type="button"
                  onClick={() => setSelected(badge)}
                  className="cask-focus flex flex-col items-center rounded-[14px] py-2 text-center transition hover:bg-white/[0.03]"
                  aria-label={`${badge.name}. ${badge.earned ? "Earned" : "Locked"}. View badge details.`}
                >
                  <BadgeMedallion badge={badge} size={72} />
                  <span className={`mt-2.5 text-[13px] font-bold ${badge.earned ? "text-white" : "text-white/55"}`}>
                    {badge.name}
                  </span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>

      <Drawer
        open={selected != null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        direction={mobile ? "bottom" : "right"}
      >
        <DrawerContent aria-describedby={selected ? `badge-${selected.key}-description` : undefined}>
          <DrawerClose
            className="absolute right-4 top-4 z-10 grid size-9 place-items-center rounded-full bg-white/[0.06] text-white/70 transition hover:bg-white/10 hover:text-white"
            aria-label="Close badge details"
          >
            <X className="size-4" />
          </DrawerClose>

          {selected ? (
            <div className="flex min-h-0 flex-col items-center px-7 pb-8 pt-12 text-center sm:justify-center sm:px-10">
              <BadgeMedallion badge={selected} size={96} />
              <DrawerTitle className="display mt-5 text-2xl">{selected.name}</DrawerTitle>
              <p className={`mt-2 text-xs font-bold uppercase tracking-[0.12em] ${selected.earned ? "text-[color:var(--accent-text)]" : "text-white/40"}`}>
                {selected.earned ? "Earned" : "Locked"}
              </p>
              <DrawerDescription id={`badge-${selected.key}-description`} className="mt-4 max-w-sm text-[15px] leading-6">
                {selected.description}
              </DrawerDescription>

              <div className="mt-7 w-full max-w-sm">
                <div className="mb-2 flex items-center justify-between text-xs font-bold">
                  <span className="text-white/45">Progress</span>
                  <span className="text-white/75">
                    {selected.progress.toLocaleString()} / {selected.target.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                  <div className="h-full rounded-full bg-[color:var(--accent)]" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>
          ) : null}
        </DrawerContent>
      </Drawer>
    </>
  );
}

const categoryOrder: { category: BadgeCategory; title: string }[] = [
  { category: "getting-started", title: "Getting Started" },
  { category: "watching", title: "Watching" },
  { category: "collecting", title: "Collecting" },
  { category: "curation-milestones", title: "Curation & Milestones" }
];

const tierOrder: Record<string, number> = { bronze: 0, silver: 1, gold: 2, amber: 3 };

function groupBadges(badges: Badge[]) {
  if (!badges.some((badge) => badge.category != null)) {
    return [{ category: "all", title: "Badges", badges: sortByTier(badges) }];
  }
  return categoryOrder
    .map(({ category, title }) => ({
      category,
      title,
      badges: sortByTier(badges.filter((badge) => badge.category === category))
    }))
    .filter((group) => group.badges.length > 0);
}

function sortByTier(badges: Badge[]) {
  return [...badges].sort((a, b) => (tierOrder[a.tier] ?? 99) - (tierOrder[b.tier] ?? 99));
}
