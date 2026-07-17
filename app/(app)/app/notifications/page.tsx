"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Award01Icon, Loading03Icon, Notification02Icon } from "@hugeicons/core-free-icons";
import { timeAgo } from "@/lib/dates";
import { BadgeMedallion } from "@/components/badges/badge-medallion";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useInfiniteNotifications,
  type NotificationItem
} from "@/lib/query/notifications";

export default function NotificationsPage() {
  const query = useInfiniteNotifications();
  const markAll = useMarkAllNotificationsRead();
  const pages = query.data?.pages ?? [];
  const items = pages.flatMap((page) => page.items);
  const unread = pages[0]?.unreadCount ?? 0;

  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="display text-xl text-white sm:text-2xl">Notifications</h1>
        {unread > 0 ? (
          <button
            onClick={() => markAll.mutate()}
            className="cask-focus text-[14px] font-extrabold"
            style={{ color: "var(--accent-text)" }}
          >
            Read all
          </button>
        ) : null}
      </header>

      {query.isPending ? (
        <div className="flex justify-center py-16">
          <HugeiconsIcon icon={Loading03Icon} className="size-6 animate-spin text-white/40" />
        </div>
      ) : query.isError ? (
        <p className="surface rounded-[14px] p-6 text-white/50">Could not load notifications. Try again shortly.</p>
      ) : items.length === 0 ? (
        <p className="surface rounded-[14px] p-6 text-white/50">
          New episodes of shows you track and badges you earn show up here.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <Row key={item.id} item={item} />
          ))}
          {query.hasNextPage ? (
            <button
              type="button"
              disabled={query.isFetchingNextPage}
              onClick={() => void query.fetchNextPage()}
              className="cask-focus self-center rounded-full border border-white/15 px-5 py-2.5 text-sm font-bold text-white/65 disabled:opacity-50"
            >
              {query.isFetchingNextPage ? "Loading…" : "Load older"}
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}

function Row({ item }: { item: NotificationItem }) {
  const router = useRouter();
  const markRead = useMarkNotificationRead();
  const unread = !item.readAt;

  const onClick = () => {
    if (unread) {
      markRead.mutate(item.id);
    }
    if (item.actionPath) {
      router.push(`/app${item.actionPath}`);
    }
  };

  return (
    <button
      onClick={onClick}
      className="cask-focus flex items-center gap-4 overflow-hidden rounded-[20px] bg-white/5 pr-4 text-left transition hover:bg-white/[0.07]"
    >
      {item.type === "badge_earned" && item.badgeKey && item.badgeArt && item.badgeTier ? (
        <span className="grid h-[88px] w-16 shrink-0 place-items-center self-stretch bg-[rgba(211,158,94,0.06)]">
          <BadgeMedallion
            badge={{ key: item.badgeKey, art: item.badgeArt, tier: item.badgeTier, earned: true }}
            size={58}
          />
        </span>
      ) : item.imageUrl ? (
        <span className="relative h-[88px] w-[64px] shrink-0 self-stretch overflow-hidden">
          <Image src={item.imageUrl} alt="" fill sizes="64px" className="object-cover" />
        </span>
      ) : (
        <span
          className="grid h-[88px] w-[64px] shrink-0 place-items-center self-stretch"
          style={{ background: "rgba(211,158,94,0.1)" }}
        >
          <HugeiconsIcon
            icon={item.type === "badge_earned" ? Award01Icon : Notification02Icon}
            className="size-5"
            style={{ color: "var(--accent-text)" }}
          />
        </span>
      )}

      <span className="min-w-0 flex-1 py-3">
        <span className={`block truncate text-[15.5px] font-extrabold ${unread ? "text-white" : "text-white/55"}`}>
          {item.title}
        </span>
        {item.body ? <span className="mt-0.5 block text-[13px] text-white/50">{item.body}</span> : null}
        <span className="mt-1 block text-[11.5px] text-white/35">{timeAgo(item.createdAt)}</span>
      </span>

      {unread ? <span className="size-2.5 shrink-0 rounded-full" style={{ background: "var(--accent)" }} /> : null}
    </button>
  );
}
