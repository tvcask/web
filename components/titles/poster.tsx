import { Clapperboard } from "lucide-react";
import { cn } from "@/lib/utils";

export function Poster({ src, title, className }: { src?: string | null; title: string; className?: string }) {
  if (src) {
    return <img src={src} alt={`${title} poster`} className={cn("aspect-[2/3] w-full rounded-md object-cover poster-shadow", className)} />;
  }

  return (
    <div className={cn("grid aspect-[2/3] w-full place-items-center rounded-md border border-[#33281F] bg-[#211A14] text-[#A79B8E]", className)}>
      <Clapperboard className="size-8" />
    </div>
  );
}
