import { TitleDetail } from "@/components/titles/title-detail";

export default async function TitleModal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TitleDetail id={id} />;
}
