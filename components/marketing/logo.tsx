import { site } from "@/lib/site";

export function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      {/* Switch the two srcs to swap logo variant. Both use height-based sizing
          so neither gets squished. Vertical alt: h-[32px]. */}
      <img src="/logo-horizontal.png" alt="" className="h-[26px] w-auto object-contain" />
      <span className="display whitespace-nowrap text-[17px] lowercase text-white">
        {site.displayName}
      </span>
    </div>
  );
}
