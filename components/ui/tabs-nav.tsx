import Link from "next/link";
import { cn } from "@/lib/utils";

type Tab = { value: string; label: string };

export function TabsNav({ tabs, active, base }: { tabs: Tab[]; active: string; base: string }) {
  return (
    <div className="inline-flex gap-2">
      {tabs.map((tab) => (
        <Link
          key={tab.value}
          href={`${base}?tab=${tab.value}`}
          className={cn(
            "whitespace-nowrap rounded-full px-[22px] py-2.5 text-[15px] font-extrabold transition",
            active === tab.value ? "accent-fill" : "bg-white/5 text-white/70 hover:text-white"
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
