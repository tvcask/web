"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Notification02Icon } from "@hugeicons/core-free-icons";
import { useNotifications } from "@/lib/query/notifications";

/** Header bell with the unread count, linking to the notifications page. */
export function NotificationsBell() {
  const { data } = useNotifications();
  const unread = data?.unreadCount ?? 0;

  return (
    <Link
      href="/app/notifications"
      aria-label={unread > 0 ? `Notifications, ${unread} unread` : "Notifications"}
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
    </Link>
  );
}
