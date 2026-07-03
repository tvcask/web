import Link from "next/link";
import { Heart, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Poster } from "@/components/titles/poster";
import type { UserTitleWithTitle } from "@/lib/services/types";
import { markNextAction } from "@/app/actions";

export function TitleCard({ item }: { item: UserTitleWithTitle }) {
  return (
    <Card className="overflow-hidden">
      <Link href={`/app/titles/${item.title.id}`}>
        <Poster src={item.title.posterUrl} title={item.title.title} />
      </Link>
      <div className="space-y-3 p-3">
        <div>
          <Link href={`/app/titles/${item.title.id}`} className="font-semibold text-[#F8F3EC]">
            {item.title.title}
          </Link>
          <p className="mt-1 text-xs text-[#A79B8E]">
            {[item.title.year, item.title.category.replace("_", " ")].filter(Boolean).join(" · ")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge>{item.status}</Badge>
          {item.favorite ? (
            <Badge className="border-[#D88945]/50 text-[#F0A85A]">
              <Heart className="mr-1 size-3 fill-current" /> Favorite
            </Badge>
          ) : null}
        </div>
        <form action={markNextAction}>
          <input type="hidden" name="userTitleId" value={item.id} />
          <Button className="w-full" variant="secondary">
            <Play className="size-4" /> Mark next
          </Button>
        </form>
      </div>
    </Card>
  );
}
