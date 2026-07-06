import type { ReactNode } from "react";

export function AuthCard({
  title,
  subtitle,
  children,
  footer
}: {
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="soft-enter w-full max-w-[400px]">
      <div className="surface relative overflow-hidden rounded-[20px] p-7 sm:p-8">
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(224,169,96,0.55), transparent)" }}
        />
        <h1 className="display text-[26px] leading-tight text-white">{title}</h1>
        {subtitle ? <p className="mt-2 text-sm leading-6 text-white/50">{subtitle}</p> : null}
        <div className="mt-6">{children}</div>
      </div>
      {footer ? <p className="mt-5 text-center text-sm text-white/50">{footer}</p> : null}
    </div>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: ReactNode; children: ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[13px] font-semibold text-white/70">{label}</span>
        {hint}
      </div>
      {children}
    </div>
  );
}

export function Banner({ tone, children }: { tone: "ok" | "err"; children: ReactNode }) {
  const ok = tone === "ok";
  return (
    <p
      className="mb-5 rounded-[11px] px-3.5 py-2.5 text-sm font-medium"
      style={{
        color: ok ? "var(--accent-text)" : "#ef6d5a",
        background: ok ? "rgba(224,169,96,0.08)" : "rgba(239,109,90,0.08)",
        boxShadow: `inset 0 0 0 1px ${ok ? "rgba(224,169,96,0.22)" : "rgba(239,109,90,0.22)"}`
      }}
    >
      {children}
    </p>
  );
}
