import { site } from "@/lib/site";

export function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <img src="/logo-vertical.png" alt="" className="size-[28px] object-contain" />
      <span className="display whitespace-nowrap text-[17px] lowercase text-white">{site.displayName}</span>
    </div>
  );
}
