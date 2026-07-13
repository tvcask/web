import { site } from "@/lib/site";

export function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <CaskMark className="size-[26px]" style={{ color: "var(--accent)" }} />
      <span className="whitespace-nowrap text-[18px] font-extrabold lowercase tracking-[-0.01em] text-white">
        {site.displayName}
      </span>
    </div>
  );
}

function CaskMark({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 48 48" className={className} style={style} aria-hidden="true">
      <mask id="cask-mark" maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48">
        <rect width="48" height="48" fill="black" />
        <path d="M14 7 L34 7 Q43 8 43 24 Q43 40 34 41 L14 41 Q5 40 5 24 Q5 8 14 7 Z" fill="white" />
        <rect x="4" y="12.4" width="40" height="2" fill="black" />
        <rect x="4" y="33.6" width="40" height="2" fill="black" />
        <path d="M20 16.5 L20 31.5 L31.5 24 Z" fill="black" />
      </mask>
      <rect width="48" height="48" fill="currentColor" mask="url(#cask-mark)" />
    </svg>
  );
}
