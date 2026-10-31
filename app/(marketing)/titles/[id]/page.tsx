import { notFound, permanentRedirect } from "next/navigation";

import { getPublicTitleDetail } from "@/lib/data";
import { publicTitlePath } from "@/lib/public-urls";

// The old id-based URL. Already shared widely, including from older app versions.
export default async function LegacyTitlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = await getPublicTitleDetail(id);
  if (!detail) notFound();
  const path = publicTitlePath(detail);
  if (path === `/titles/${id}`) notFound();
  permanentRedirect(path);
}
