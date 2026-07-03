import { TitleCard } from "@/components/titles/title-card";
import type { UserTitleWithTitle } from "@/lib/services/types";

export function TitleGrid({ items }: { items: UserTitleWithTitle[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
      {items.map((item) => (
        <TitleCard key={item.id} item={item} />
      ))}
    </div>
  );
}
