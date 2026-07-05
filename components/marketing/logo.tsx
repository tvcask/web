import { site } from "@/lib/site";

export function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <img src={site.logo} alt="" className="size-[30px] rounded-[8px] object-cover" />
      <span className="display whitespace-nowrap text-[17px] text-white">{site.name}</span>
    </div>
  );
}
