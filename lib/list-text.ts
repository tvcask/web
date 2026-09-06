import type { Title } from "@/lib/services/types";

type TextList = {
  name: string;
  description?: string;
  items: { title: Pick<Title, "title" | "year"> }[];
};

/** Format a list for pasting into messages, notes, or any other text field. */
export function formatListAsText(list: TextList): string {
  const count = list.items.length;
  const heading = `${list.name} (${count.toLocaleString()} ${count === 1 ? "title" : "titles"})`;
  const description = list.description?.trim();
  const titles = list.items.map(({ title }) => `- ${title.title}${title.year ? ` (${title.year})` : ""}`);

  return [heading, description, titles.join("\n")].filter(Boolean).join("\n\n");
}
