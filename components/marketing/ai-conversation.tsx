import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon } from "@hugeicons/core-free-icons";

// From a real run on a real library, so keep it true if it's ever edited.
const SORTED = [
  { title: "Dali & Cocky Prince", list: "Falling Hard" },
  { title: "Doctor Slump", list: "Cozy Hearts" },
  { title: "Oh My Ghost", list: "Love, Laughs & Chaos" },
  { title: "Taxi Driver", list: "No Mercy" }
];

export function AiConversation() {
  return (
    <figure className="rounded-[16px] border border-white/[0.08] bg-[#0a0a0c] p-4 sm:p-5">
      <div className="ml-auto max-w-[88%] rounded-[16px] rounded-br-[4px] bg-white/[0.08] px-4 py-3 text-sm leading-6 text-white/90">
        Look at my tvcask library and tell me which K-dramas belong in my custom lists.
      </div>
      <p className="mt-4 flex items-center gap-2 text-xs font-bold text-white/40">
        <HugeiconsIcon icon={Tick02Icon} className="size-3.5" style={{ color: "var(--accent-text)" }} />
        Checked your tvcask library
      </p>
      <p className="mt-2 text-sm leading-6 text-white/75">
        Quite a few dramas you&apos;ve watched have no list yet. These are strong matches:
      </p>
      <dl className="mt-3 divide-y divide-white/[0.06] text-sm">
        {SORTED.map((row) => (
          <div key={row.title} className="flex items-baseline justify-between gap-4 py-2">
            <dt className="min-w-0 truncate font-semibold text-white/85">{row.title}</dt>
            <dd className="shrink-0 text-xs font-bold" style={{ color: "var(--accent-text)" }}>{row.list}</dd>
          </div>
        ))}
      </dl>
      <figcaption className="mt-3 border-t border-white/[0.06] pt-3 text-xs text-white/35">
        From a real ChatGPT conversation, shortened.
      </figcaption>
    </figure>
  );
}
