import { TitleDetail } from "@/components/titles/title-detail";
import { TitleDrawer } from "@/components/titles/title-drawer";

export default async function TitleModal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <TitleDrawer>
      <TitleDetail id={id} />
    </TitleDrawer>
  );
}
