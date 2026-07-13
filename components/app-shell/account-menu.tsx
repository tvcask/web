"use client";

import { HugeiconsIcon } from '@hugeicons/react';
import { FileUploadIcon, Logout03Icon, Settings01Icon, UserIcon } from '@hugeicons/core-free-icons';

import type { IconSvgElement } from '@hugeicons/react';

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { endSession } from "@/app/actions";
import { Avatar } from "@/components/ui/avatar";

export function AccountMenu({ name, email, avatarUrl }: { name: string; email?: string | null; avatarUrl?: string | null }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!ref.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account"
        onClick={() => setOpen((value) => !value)}
        className="cask-focus grid size-10 place-items-center rounded-full"
      >
        <Avatar src={avatarUrl} name={name} size={34} />
      </button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-64 rounded-[14px] border border-white/[0.09] bg-[#131316] p-2 shadow-2xl shadow-black/60" role="menu">
          <div className="border-b border-white/[0.06] px-2 pb-3 pt-1.5">
            <p className="display truncate text-[15px] text-white">{name}</p>
            {email ? <p className="truncate text-[13px] text-white/40">{email}</p> : null}
          </div>
          <div className="py-1">
            <MenuLink href="/app/profile" icon={UserIcon} label="Profile" onClick={() => setOpen(false)} />
            <MenuLink href="/app/settings" icon={Settings01Icon} label="Settings" onClick={() => setOpen(false)} />
            <MenuLink href="/app/import" icon={FileUploadIcon} label="Import from TV Time" onClick={() => setOpen(false)} />
          </div>
          <form action={endSession} className="border-t border-white/[0.06] pt-1">
            <button className="flex w-full items-center gap-3 rounded-[8px] px-3 py-2.5 text-left text-sm font-semibold text-white/70 transition hover:bg-white/5 hover:text-white">
              <HugeiconsIcon icon={Logout03Icon} className="size-4" /> Log out
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}

function MenuLink({
  href,
  icon,
  label,
  onClick
}: {
  href: string;
  icon: IconSvgElement;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/5 hover:text-white"
      role="menuitem"
    >
      <HugeiconsIcon icon={icon} className="size-4 text-[color:var(--accent-text)]" /> {label}
    </Link>
  );
}
