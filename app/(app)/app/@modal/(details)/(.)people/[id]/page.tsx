import { PersonDetail } from "@/components/people/person-detail";

export default async function PersonModal({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ character?: string; titleId?: string; returnTo?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  return <PersonDetail id={id} mode="app" character={query.character} titleId={query.titleId} returnTo={query.returnTo} />;
}
