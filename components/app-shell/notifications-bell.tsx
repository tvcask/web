"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Award01Icon, Notification02Icon } from "@hugeicons/core-free-icons";
import { timeAgo } from "@/lib/dates";
import { BadgeMedallion } from "@/components/badges/badge-medallion";
import { useMarkNotificationRead, useNotifications } from "@/lib/query/notifications";
import { toast } from "@/lib/toast";

export function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const { data } = useNotifications();
  const markRead = useMarkNotificationRead();
  const containerRef = useRef<HTMLDivElement>(null);
  const knownIdsRef = useRef<Set<string> | null>(null);
  const unread = data?.unreadCount ?? 0;

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!data) return;
    const ids = new Set(data.items.map((item) => item.id));
    const knownIds = knownIdsRef.current;
    if (knownIds) {
      const arrivals = data.items.filter((item) => !knownIds.has(item.id));
      if (arrivals.length === 1) {
        const item = arrivals[0];
        const message = item.type === "badge_earned" ? `Badge unlocked: ${item.title}` : item.title;
        toast(message, { actionHref: item.actionPath ? `/app${item.actionPath}` : "/app/notifications" });
      } else if (arrivals.length > 1) {
        toast(`${arrivals.length} new notifications`, { actionHref: "/app/notifications" });
      }
    }
    knownIdsRef.current = ids;
  }, [data]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={unread > 0 ? `Notifications, ${unread} unread` : "Notifications"}
        onClick={() => setOpen((value) => !value)}
        className="cask-focus relative grid size-10 place-items-center rounded-full text-white/60 transition hover:text-white"
      >
        <HugeiconsIcon icon={Notification02Icon} className="size-5" strokeWidth={2} />
        {unread > 0 ? (
          <span
            className="absolute right-0.5 top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full px-1 text-[10px] font-extrabold"
            style={{ background: "var(--accent)", color: "var(--on-accent)" }}
          >
            {unread > 9 ? "9+" : unread}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+10px)] z-50 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-[18px] border border-white/[0.09] bg-[#131316] shadow-2xl shadow-black/60"
        >
          <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
            <p className="display text-[16px] text-white">Notifications</p>
            {unread > 0 ? <span className="text-xs font-bold text-white/40">{unread} unread</span> : null}
          </div>
          <div className="max-h-[min(28rem,70vh)] overflow-y-auto p-2">
            {data?.items.length ? (
              data.items.slice(0, 6).map((item) => (
                <Link
                  key={item.id}
                  href={item.actionPath ? `/app${item.actionPath}` : "/app/notifications"}
                  role="menuitem"
                  onClick={() => {
                    setOpen(false);
                    if (!item.readAt) markRead.mutate(item.id);
                  }}
                  className="flex items-center gap-3 rounded-[12px] p-2.5 transition hover:bg-white/5"
                >
                  {item.type === "badge_earned" && item.badgeKey && item.badgeArt && item.badgeTier ? (
                    <span className="grid h-[52px] w-10 shrink-0 place-items-center rounded-[7px] bg-[rgba(211,158,94,0.06)]">
                      <BadgeMedallion
                        badge={{ key: item.badgeKey, art: item.badgeArt, tier: item.badgeTier, earned: true }}
                        size={40}
                      />
                    </span>
                  ) : item.imageUrl ? (
                    <Image src={item.imageUrl} alt="" width={40} height={52} className="h-[52px] w-10 shrink-0 rounded-[7px] object-cover" />
                  ) : (
                    <span className="grid h-[52px] w-10 shrink-0 place-items-center rounded-[7px] bg-white/5">
                      <HugeiconsIcon icon={item.type === "badge_earned" ? Award01Icon : Notification02Icon} className="size-4 text-[color:var(--accent-text)]" />
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className={`block truncate text-sm font-bold ${item.readAt ? "text-white/55" : "text-white"}`}>{item.title}</span>
                    {item.body ? <span className="mt-0.5 block truncate text-xs text-white/40">{item.body}</span> : null}
                    <span className="mt-1 block text-[11px] text-white/30">{timeAgo(item.createdAt)}</span>
                  </span>
                  {!item.readAt ? <span className="size-2 shrink-0 rounded-full bg-[var(--accent)]" /> : null}
                </Link>
              ))
            ) : (
              <p className="px-3 py-8 text-center text-sm text-white/40">No notifications yet.</p>
            )}
          </div>
          <Link href="/app/notifications" onClick={() => setOpen(false)} className="block border-t border-white/[0.06] px-4 py-3 text-center text-sm font-bold text-[color:var(--accent-text)]">
            View all notifications
          </Link>
        </div>
      ) : null}
    </div>
  );
}
